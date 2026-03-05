import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ContinueReadingCard } from '@/components/home/ContinueReadingCard';
import { Header } from '@/components/home/Header';
import { HeroBanner } from '@/components/home/HeroBanner';
import { MangaCardHorizontal } from '@/components/home/MangaCardHorizontal';
import { SearchBar } from '@/components/home/SearchBar';
import { SectionHeader } from '@/components/home/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { api, HistoryItem } from '@/services/api';

// Mock data - pour featured manga
const FEATURED_MANGA = {
  title: "Jujutsu Kaisen",
  genres: ["Action", "Surnaturel", "Shōnen"],
  coverImage: "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx101517-H3TdM3g5ZUe9.jpg"
};

// Fallback vide si l'API ne retourne rien
const DEFAULT_AI_RECOMMENDATIONS: any[] = [];
const DEFAULT_TRENDING_MANGAS: any[] = [];
const DEFAULT_NEW_RELEASES: any[] = [];

export default function HomeScreen() {
  const { user, userId, token, setUser } = useAuth();
  const colors = useThemeColors();
  const router = useRouter();
  const { t } = useTranslation();
  const { notifications, clearNotifications } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  
  const [aiRecommendations, setAiRecommendations] = useState<any[]>(DEFAULT_AI_RECOMMENDATIONS);
  const [trending, setTrending] = useState<any[]>(DEFAULT_TRENDING_MANGAS);
  const [newReleases, setNewReleases] = useState<any[]>(DEFAULT_NEW_RELEASES);
  const [continueReading, setContinueReading] = useState<any[]>([]);
  const [libraryHistory, setLibraryHistory] = useState<HistoryItem[]>([]);

  const notificationCount = notifications.length;

  const notificationItems = useMemo(() => {
    return notifications.map((item) => {
      if (item.type === 'theme') {
        const modeLabel =
          item.value === 'light'
            ? t('profile.themeModes.light')
            : item.value === 'dark'
              ? t('profile.themeModes.dark')
              : t('profile.themeModes.auto');
        return {
          ...item,
          message: t('ui.notifications.themeChanged', { mode: modeLabel }),
        };
      }

      const languageLabel = t(`languages.${item.value}`, { defaultValue: item.value });
      return {
        ...item,
        message: t('ui.notifications.languageChanged', { language: languageLabel }),
      };
    });
  }, [notifications, t]);

  // Charger les données au montage
  useEffect(() => {
    if (userId) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const loadData = async () => {
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Charger le profil utilisateur si pas déjà en cache
      if (!user) {
        try {
          console.log('👤 Chargement du profil utilisateur...');
          const userProfile = await api.getUser(userId, token);
          console.log('✅ Profil chargé:', userProfile);
          setUser(userProfile);
        } catch (err) {
          console.warn('Impossible de charger le profil utilisateur:', err);
        }
      }

      // Charger l'historique de lecture
      try {
        const history = await api.getHistory(userId, token);
        if (history && history.length > 0) {
          const formattedHistory = history.map((item: any) => ({
            id: item.mangaId,
            title: item.title,
            cover: item.cover || 'https://via.placeholder.com/80x120',
            currentChapter: item.currentChapter || item.progress || 0,
            totalChapters: item.totalChapters || 100,
          }));
          setContinueReading(formattedHistory);
        }
      } catch (err) {
        console.warn('Impossible de charger l\'historique:', err);
      }

      // Charger les recommandations personnalisées depuis l'API
      try {
        const recommendations = await api.getRecommendationsMangas(token, 20);
        if (recommendations && recommendations.length > 0) {
          setAiRecommendations(recommendations);
        } else {
          setAiRecommendations([]);
        }
      } catch (err) {
        console.warn('Impossible de charger les recommandations:', err);
        setAiRecommendations([]);
      }

      // Charger les tendances depuis l'API
      try {
        const trendingData = await api.getTrendingMangas(20);
        if (trendingData && trendingData.length > 0) {
          setTrending(trendingData);
        } else {
          setTrending([]);
        }
      } catch (err) {
        console.warn('Impossible de charger les tendances:', err);
        setTrending([]);
      }

      // Charger les nouveautés depuis l'API
      try {
        const newData = await api.getNewReleases(1, 20);
        if (newData && newData.length > 0) {
          setNewReleases(newData);
        } else {
          setNewReleases([]);
        }
      } catch (err) {
        console.warn('Impossible de charger les nouveautés:', err);
        setNewReleases([]);
      }

      // Charger l'historique (bibliothèque)
      try {
        const history = await api.getHistory(userId, token);
        let historyArray: HistoryItem[] = [];
        if (Array.isArray(history)) {
          historyArray = history;
        } else if (history && typeof history === 'object') {
          historyArray = (history as any).history || (history as any).data || [];
        }
        setLibraryHistory(historyArray);
      } catch (err) {
        console.warn('Impossible de charger la bibliothèque:', err);
        setLibraryHistory([]);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData().finally(() => setRefreshing(false));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        userName={user?.displayName || t('ui.home.defaultUser')}
        notificationCount={notificationCount}
        onAvatarPress={() => router.push('/profile')}
        onNotificationPress={() => setIsNotificationsVisible(true)}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t('ui.search.placeholder')}
        onFilterPress={() => console.log('Filter pressed')}
      />

      {isLoading && continueReading.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Hero Banner */}
          <HeroBanner
            title={FEATURED_MANGA.title}
            genres={FEATURED_MANGA.genres}
            coverImage={FEATURED_MANGA.coverImage}
            onReadPress={() => console.log('Read pressed')}
            onLearnMorePress={() => console.log('Learn more pressed')}
          />

          {/* Library Section */}
          {libraryHistory.length > 0 && (
            <>
              {/* À lire */}
              {libraryHistory.filter(item => ['planned', 'reading', 'paused'].includes(item.status)).length > 0 && (
                <>
                  <SectionHeader
                    title={t('ui.library.toRead')}
                    onSeeAllPress={() => router.push('/library' as any)}
                  />
                  <FlatList
                    data={libraryHistory.filter(item => ['planned', 'reading', 'paused'].includes(item.status))}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalList}
                    snapToInterval={152}
                    decelerationRate="fast"
                    renderItem={({ item }) => (
                      <MangaCardHorizontal
                        title={item.title}
                        cover={item.cover || 'https://via.placeholder.com/150x220?text=No+Image'}
                        rating={item.rating}
                        onPress={() => router.push({ pathname: '/manga/[id]' as any, params: { id: item.mangaId } })}
                        onBookmarkPress={() => console.log('Bookmark pressed:', item.title)}
                      />
                    )}
                    keyExtractor={(item) => item.mangaId}
                  />
                </>
              )}

              {/* Déjà lus */}
              {libraryHistory.filter(item => item.status === 'completed').length > 0 && (
                <>
                  <SectionHeader
                    title={t('ui.library.completed')}
                    onSeeAllPress={() => router.push('/library' as any)}
                  />
                  <FlatList
                    data={libraryHistory.filter(item => item.status === 'completed')}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalList}
                    snapToInterval={152}
                    decelerationRate="fast"
                    renderItem={({ item }) => (
                      <MangaCardHorizontal
                        title={item.title}
                        cover={item.cover || 'https://via.placeholder.com/150x220?text=No+Image'}
                        rating={item.rating}
                        onPress={() => router.push({ pathname: '/manga/[id]' as any, params: { id: item.mangaId } })}
                        onBookmarkPress={() => console.log('Bookmark pressed:', item.title)}
                      />
                    )}
                    keyExtractor={(item) => item.mangaId}
                  />
                </>
              )}
            </>
          )}

          {/* AI Recommendations Section */}
          <SectionHeader
            title={t('ui.home.sections.aiRecommendations')}
            onSeeAllPress={() => router.push({ pathname: '/category/[type]' as any, params: { type: 'ai-recommendations' } })}
          />
          <FlatList
            data={aiRecommendations}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            snapToInterval={152}
            decelerationRate="fast"
            renderItem={({ item }) => (
              <MangaCardHorizontal
                title={item.title}
                cover={item.cover}
                rating={item.rating}
                onPress={() => router.push({ pathname: '/manga/[id]' as any, params: { id: item.id } })}
                onBookmarkPress={() => console.log('Bookmark pressed:', item.title)}
              />
            )}
            keyExtractor={(item) => item.id}
          />

          {/* Trending Section */}
          <SectionHeader
            title={t('ui.home.sections.trending')}
            onSeeAllPress={() => router.push({ pathname: '/category/[type]' as any, params: { type: 'trending' } })}
          />
          <FlatList
            data={trending}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            snapToInterval={152}
            decelerationRate="fast"
            renderItem={({ item }) => (
              <MangaCardHorizontal
                title={item.title}
                cover={item.cover}
                rating={item.rating}
                position={item.position}
                onPress={() => router.push({ pathname: '/manga/[id]' as any, params: { id: item.id } })}
                onBookmarkPress={() => console.log('Bookmark pressed:', item.title)}
              />
            )}
            keyExtractor={(item) => item.id}
          />

          {/* New Releases Section */}
          <SectionHeader
            title={t('ui.home.sections.newReleases')}
            onSeeAllPress={() => router.push({ pathname: '/category/[type]' as any, params: { type: 'new-releases' } })}
          />
          <FlatList
            data={newReleases}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            snapToInterval={152}
            decelerationRate="fast"
            renderItem={({ item }) => (
              <MangaCardHorizontal
                title={item.title}
                cover={item.cover}
                rating={item.rating}
                badge={t('ui.home.badgeNew')}
                badgeColor="#06B6D4"
                onPress={() => router.push({ pathname: '/manga/[id]' as any, params: { id: item.id } })}
                onBookmarkPress={() => console.log('Bookmark pressed:', item.title)}
              />
            )}
            keyExtractor={(item) => item.id}
          />

          {/* Continue Reading Section */}
          {continueReading.length > 0 && (
            <>
              <SectionHeader
                title={t('ui.home.sections.continueReading')}
                onSeeAllPress={() => router.push({ pathname: '/category/[type]' as any, params: { type: 'continue-reading' } })}
              />
              <FlatList
                data={continueReading}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                snapToInterval={292}
                decelerationRate="fast"
                renderItem={({ item }) => (
                  <ContinueReadingCard
                    title={item.title}
                    cover={item.cover}
                    currentChapter={item.currentChapter}
                    totalChapters={item.totalChapters}
                    onPress={() => router.push({ pathname: '/manga/[id]' as any, params: { id: item.id } })}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            </>
          )}

          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      <Modal
        animationType="fade"
        transparent
        visible={isNotificationsVisible}
        onRequestClose={() => setIsNotificationsVisible(false)}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
          onPress={() => setIsNotificationsVisible(false)}
        >
          <Pressable
            style={[styles.modalSheet, { backgroundColor: colors.surfacePrimary }]}
            onPress={() => null}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {t('ui.notifications.title')}
              </Text>
              {notificationCount > 0 && (
                <TouchableOpacity onPress={clearNotifications}>
                  <Text style={[styles.clearText, { color: colors.primary }]}>
                    {t('ui.notifications.clear')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {notificationCount === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('ui.notifications.empty')}
              </Text>
            ) : (
              <FlatList
                data={notificationItems}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.notificationList}
                renderItem={({ item }) => (
                  <View style={[styles.notificationItem, { borderColor: colors.border }]}>
                    <Text style={[styles.notificationText, { color: colors.textPrimary }]}>
                      {item.message}
                    </Text>
                  </View>
                )}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  horizontalList: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    maxHeight: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 24,
  },
  notificationList: {
    paddingBottom: 20,
  },
  notificationItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  notificationText: {
    fontSize: 14,
  },
});
