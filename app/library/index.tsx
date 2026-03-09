import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import { api, HistoryItem } from '@/services/api';

type TabType = 'toRead' | 'completed';

export default function LibraryScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userId, token } = useAuth();
  const { width } = useWindowDimensions();

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
      const historyResponse = await api.getHistory(userId, token);
      const alreadyRead = historyResponse?.alreadyRead?.items || [];
      const toRead = historyResponse?.toRead?.items || [];
      const historyArray: HistoryItem[] = [...alreadyRead, ...toRead];
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

  const handleAddToRead = async (item: HistoryItem) => {
    if (!userId || !token) {
      console.warn('Utilisateur non connecte: impossible d\'ajouter a la liste a lire');
      return;
    }

    try {
      await api.addToHistory(
        userId,
        {
          mangaId: item.mangaId,
          title: item.title,
          coverImage: item.coverImage || item.cover,
          status: 'planned',
        },
        token
      );
    } catch {
      await api.updateHistory(userId, item.mangaId, { status: 'planned' }, token);
    }

    await loadLibrary();
  };

  // Filtrer les mangas par catégorie
  const toReadMangas = (libraryItems || []).filter((item) =>
    ['planned', 'reading', 'paused'].includes(item.status)
  );
  const completedMangas = (libraryItems || []).filter((item) => item.status === 'completed');

  const currentList = activeTab === 'toRead' ? toReadMangas : completedMangas;
  const cardWidth = Math.max(96, (width - 32 - 16) / 3);
  const cardHeight = Math.round(cardWidth * 1.55);

  const renderMangaCard = ({ item }: { item: HistoryItem }) => {
    return (
      <View style={styles.cardWrapper}>
        <MangaCardHorizontal
          title={item.title}
          cover={item.coverImage || item.cover}
          rating={item.rating}
          badge={getStatusLabel(item.status, t)}
          badgeColor={getStatusColor(item.status)}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          containerStyle={styles.cardContainer}
          onPress={() => router.push({ pathname: '/manga/[id]' as any, params: { id: item.mangaId } })}
          onBookmarkPress={() => handleAddToRead(item)}
        />
      </View>
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
          numColumns={3}
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
    marginBottom: 12,
  },
  cardWrapper: {
    width: '32%',
    alignItems: 'center',
  },
  cardContainer: {
    marginRight: 0,
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
