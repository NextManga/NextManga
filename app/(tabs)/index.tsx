import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ContinueReadingCard } from '@/components/home/ContinueReadingCard';
import { Header } from '@/components/home/Header';
import { HeroBanner } from '@/components/home/HeroBanner';
import { MangaCardHorizontal } from '@/components/home/MangaCardHorizontal';
import { SearchBar } from '@/components/home/SearchBar';
import { SectionHeader } from '@/components/home/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

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
  const { user, userId, token } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [aiRecommendations, setAiRecommendations] = useState<any[]>(DEFAULT_AI_RECOMMENDATIONS);
  const [trending, setTrending] = useState<any[]>(DEFAULT_TRENDING_MANGAS);
  const [newReleases, setNewReleases] = useState<any[]>(DEFAULT_NEW_RELEASES);
  const [continueReading, setContinueReading] = useState<any[]>([]);

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
        const trendingData = await api.getTrendingMangas();
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
        const newData = await api.getNewReleases();
        if (newData && newData.length > 0) {
          setNewReleases(newData);
        } else {
          setNewReleases([]);
        }
      } catch (err) {
        console.warn('Impossible de charger les nouveautés:', err);
        setNewReleases([]);
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
    <View style={styles.container}>
      <Header
        userName={user?.displayName || 'User'}
        notificationCount={3}
        onAvatarPress={() => router.push('/profile')}
        onNotificationPress={() => console.log('Notification pressed')}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => console.log('Filter pressed')}
      />

      {isLoading && continueReading.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
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

          {/* AI Recommendations Section */}
          <SectionHeader
            title="Recommandations IA ✨"
            onSeeAllPress={() => console.log('See all AI')}
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
            title="Tendances 🔥"
            onSeeAllPress={() => console.log('See all trending')}
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
            title="Nouveautés"
            onSeeAllPress={() => console.log('See all new')}
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
                badge="NOUVEAU"
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
                title="Continuer la lecture"
                onSeeAllPress={() => console.log('See all continue')}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
});
