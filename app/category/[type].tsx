import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MangaCardHorizontal } from '@/components/home/MangaCardHorizontal';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { api } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';

export default function CategoryScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userId, token } = useAuth();
  const { width } = useWindowDimensions();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getCategoryTitle = (): string => {
    switch (type) {
      case 'ai-recommendations':
        return t('ui.home.sections.aiRecommendations');
      case 'trending':
        return t('ui.home.sections.trending');
      case 'new-releases':
        return t('ui.home.sections.newReleases');
      case 'continue-reading':
        return t('ui.home.sections.continueReading');
      default:
        return 'Catégorie';
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      let data: any[] = [];

      switch (type) {
        case 'ai-recommendations':
          try {
            data = await api.getRecommendationsMangas(token || '', 1000);
          } catch (err) {
            console.warn('Erreur recommandations IA:', err);
            data = [];
          }
          break;

        case 'trending':
          try {
            data = await api.getTrendingMangas(1000);
          } catch (err) {
            console.warn('Erreur tendances:', err);
            data = [];
          }
          break;

        case 'new-releases':
          try {
            data = await api.getNewReleases(1, 1000);
          } catch (err) {
            console.warn('Erreur nouvelles sorties:', err);
            data = [];
          }
          break;

        case 'continue-reading':
          if (userId && token) {
            try {
              const historyResponse = await api.getHistory(userId, token);
              const alreadyRead = historyResponse?.alreadyRead?.items || [];
              const toRead = historyResponse?.toRead?.items || [];
              const historyArray = [...alreadyRead, ...toRead];
              data = historyArray.filter(item => item.progress && item.progress > 0).map(item => ({
                ...item,
                cover: item.coverImage || item.cover
              }));
            } catch (err) {
              console.warn('Erreur continue reading:', err);
              data = [];
            }
          }
          break;
      }

      setItems(data || []);
    } catch (err) {
      console.error('Erreur chargement catégorie:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [type]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddToRead = async (item: any) => {
    if (!userId || !token) {
      console.warn('Utilisateur non connecte: impossible d\'ajouter a la liste a lire');
      return;
    }

    const mangaId = String(item?.mangaId || item?.id || '');
    if (!mangaId) {
      console.warn('Impossible d\'ajouter a la liste a lire: mangaId manquant');
      return;
    }

    try {
      await api.addToHistory(
        userId,
        {
          mangaId,
          title: item?.title || 'Titre inconnu',
          coverImage: item?.coverImage || item?.cover,
          status: 'planned',
        },
        token
      );
    } catch {
      await api.updateHistory(userId, mangaId, { status: 'planned' }, token);
    }
  };

  const cardWidth = Math.max(96, (width - 32 - 16) / 3);
  const cardHeight = Math.round(cardWidth * 1.55);

  const renderCard = ({ item }: { item: any }) => {
    const mangaId = item.mangaId || item.id;
    return (
      <View style={styles.cardWrapper}>
        <MangaCardHorizontal
          title={item.title}
          cover={item.cover || 'https://via.placeholder.com/150x220?text=No+Image'}
          rating={item.rating}
          badge={type === 'new-releases' ? t('ui.home.badgeNew') : item.position ? `#${item.position}` : undefined}
          badgeColor={type === 'new-releases' ? '#06B6D4' : colors.primary}
          position={item.position}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          containerStyle={styles.cardContainer}
          onPress={() => router.push({ pathname: '/manga/[id]' as any, params: { id: mangaId } })}
          onBookmarkPress={() => handleAddToRead(item)}
        />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={80} color={colors.textTertiary} />
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
        Aucun manga disponible
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Revenez plus tard pour de nouveaux contenus
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surfacePrimary, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {getCategoryTitle()}
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderCard}
          keyExtractor={(item, index) => item.id || item.mangaId || index.toString()}
          contentContainerStyle={styles.listContent}
          numColumns={3}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={renderEmptyState}
          scrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardWrapper: {
    width: '32%',
    alignItems: 'center',
  },
  cardContainer: {
    marginRight: 0,
  },
  cover: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
