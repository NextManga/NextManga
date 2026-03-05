import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { api, HistoryItem } from '@/services/api';

type TabType = 'toRead' | 'completed';

export default function LibraryScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userId, token } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('toRead');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [libraryItems, setLibraryItems] = useState<HistoryItem[]>([]);

  const loadLibrary = async () => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.getHistory(userId, token);
      
      // Extraire le tableau de la réponse
      let historyArray: HistoryItem[] = [];
      if (Array.isArray(response)) {
        historyArray = response;
      } else if (response && typeof response === 'object') {
        historyArray = (response as any).history || (response as any).data || [];
      }
      
      setLibraryItems(historyArray);
    } catch (error) {
      console.error('Erreur chargement bibliothèque:', error);
      setLibraryItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, [userId, token]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLibrary();
    setRefreshing(false);
  };

  // Filtrer les mangas par catégorie
  const toReadMangas = (libraryItems || []).filter((item) =>
    ['planned', 'reading', 'paused'].includes(item.status)
  );
  const completedMangas = (libraryItems || []).filter((item) => item.status === 'completed');

  const currentList = activeTab === 'toRead' ? toReadMangas : completedMangas;

  const renderMangaCard = ({ item }: { item: HistoryItem }) => {
    return (
      <Pressable
        style={[styles.card, { backgroundColor: colors.surfacePrimary }]}
        onPress={() => router.push({ pathname: '/manga/[id]' as any, params: { id: item.mangaId } })}
      >
        <View style={styles.coverContainer}>
          {item.cover ? (
            <Image
              source={{ uri: item.cover }}
              style={styles.cover}
              onError={(error) => console.log('❌ Image load error:', error.nativeEvent)}
            />
          ) : (
            <View style={[styles.cover, { backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="image-outline" size={40} color={colors.textTertiary} />
            </View>
          )}
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
            {item.title}
          </Text>

          {item.rating && item.rating > 0 && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FBBF24" />
              <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                {item.rating.toFixed(1)}
              </Text>
            </View>
          )}

          {item.progress !== undefined && item.totalChapters && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      backgroundColor: colors.primary,
                      width: `${(item.progress / 100) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: colors.textTertiary }]}>
                {item.currentChapter || 0}/{item.totalChapters}
              </Text>
            </View>
          )}

          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusLabel(item.status, t)}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={activeTab === 'toRead' ? 'book-outline' : 'checkmark-circle-outline'}
        size={80}
        color={colors.textTertiary}
      />
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
        {activeTab === 'toRead' ? t('ui.library.emptyToRead') : t('ui.library.emptyCompleted')}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {activeTab === 'toRead' ? t('ui.library.emptyToReadDesc') : t('ui.library.emptyCompletedDesc')}
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
        <Ionicons name="book" size={24} color={colors.primary} style={styles.headerIcon} />
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t('ui.library.title')}
        </Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.surfacePrimary, borderBottomColor: colors.border }]}>
        <Pressable
          style={[styles.tab, activeTab === 'toRead' && { borderBottomColor: colors.primary }]}
          onPress={() => setActiveTab('toRead')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'toRead' ? colors.primary : colors.textSecondary }]}>
            {t('ui.library.toRead')} ({toReadMangas.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'completed' && { borderBottomColor: colors.primary }]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'completed' ? colors.primary : colors.textSecondary }]}>
            {t('ui.library.completed')} ({completedMangas.length})
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={currentList}
          renderItem={renderMangaCard}
          keyExtractor={(item) => item.mangaId}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={renderEmptyState}
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

const getStatusLabel = (status: string, t: any) => {
  switch (status) {
    case 'planned':
      return t('ui.library.status.planned');
    case 'reading':
      return t('ui.library.status.reading');
    case 'completed':
      return t('ui.library.status.completed');
    case 'paused':
      return t('ui.library.status.paused');
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planned':
      return '#6366F1';
    case 'reading':
      return '#10B981';
    case 'completed':
      return '#8B5CF6';
    case 'paused':
      return '#F59E0B';
    default:
      return '#6B7280';
  }
};

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
    marginRight: 8,
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 16,
  },
  card: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverContainer: {
    width: '100%',
    height: 200,
  },
  cover: {
    width: '100%',
    height: '100%',
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
  progressContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
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
