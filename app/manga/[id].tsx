import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { MangaActionButtons } from '@/components/manga-detail/MangaActionButtons';
import { MangaGenresSection } from '@/components/manga-detail/MangaGenresSection';
import { MangaHeroSection } from '@/components/manga-detail/MangaHeroSection';
import { MangaInformationCard } from '@/components/manga-detail/MangaInformationCard';
import { MangaRatingCard } from '@/components/manga-detail/MangaRatingCard';
import { MangaSynopsisSection } from '@/components/manga-detail/MangaSynopsisSection';
import { MangaTitleInfo } from '@/components/manga-detail/MangaTitleInfo';

import { useAuth } from '@/contexts/AuthContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { api } from '@/services/api';

export interface MangaDetail {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  status: 'reading' | 'completed' | 'paused' | 'planned' | 'dropped';
  chapters: number;
  year: number;
  rating: number;
  votes: number;
  rank: number;
  popularity: number;
  favorites: number;
  genres: string[];
  synopsis: string;
  type: string;
  volumes: number;
  score: number;
  isFavorite?: boolean;
  isInLibrary?: boolean;
}

export default function MangaDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userId, token } = useAuth();
  const colors = useThemeColors();

  const [manga, setManga] = useState<MangaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);

  useEffect(() => {
    loadMangaDetail();
  }, [id]);

  const loadMangaDetail = async () => {
    try {
      setLoading(true);

      const mangaId = id as string;

      // Charger les détails du manga depuis l'API
      const detailResponse = await api.getMangaDetail(mangaId);
      console.log('Manga detail:', detailResponse);

      const mangaData = detailResponse.data;

      // Extraire le titre (peut être objet ou string)
      const title = typeof mangaData.title === 'object' 
        ? (mangaData.title.romaji || mangaData.title.english || mangaData.title.native || 'Titre inconnu')
        : mangaData.title;

      // Extraire l'auteur depuis le staff
      const author = mangaData.staff?.edges?.find(
        (edge: any) => edge.role === 'Story' || edge.role === 'Story & Art'
      )?.node?.name?.full || 'Auteur inconnu';

      // Charger les stats du manga (sans authentification)
      const statsResponse = await api.getMangaStats(mangaId);
      console.log('Manga stats:', statsResponse);
      const statsData = statsResponse.stats;

      // Charger le statut bibliothèque si utilisateur connecté
      let libraryStatus = null;
      if (userId && token) {
        try {
          libraryStatus = await api.getLibraryStatus(mangaId, token);
          console.log('Library status:', libraryStatus);
          setIsInLibrary(libraryStatus.inLibrary);
          setIsFavorite(libraryStatus.isFavorite);
        } catch (err) {
          console.warn('Impossible de charger le statut:', err);
        }
      }

      // Construire l'objet manga avec les vraies données
      const mangaDetail: MangaDetail = {
        id: mangaId,
        title: title,
        author: author,
        coverImage: mangaData.coverImage || 'https://via.placeholder.com/400x600?text=No+Image',
        status: libraryStatus?.status || 'planned',
        chapters: mangaData.chapters || 0,
        year: mangaData.startDate?.year || 0,
        rating: statsData?.averageScore || (mangaData.averageScore ? mangaData.averageScore / 20 : 0),
        votes: statsData?.totalVotes || mangaData.popularity || 0,
        rank: statsData?.trending || 0,
        popularity: statsData?.popularity || mangaData.popularity || 0,
        favorites: statsData?.favourites || mangaData.favourites || 0,
        genres: mangaData.genres || [],
        synopsis: mangaData.description || 'Aucun synopsis disponible',
        type: 'Manga',
        volumes: mangaData.volumes || 0,
        score: statsData?.averageScore || (mangaData.averageScore ? mangaData.averageScore / 20 : 0),
        isInLibrary: libraryStatus?.inLibrary || false,
        isFavorite: libraryStatus?.isFavorite || false,
      };

      setManga(mangaDetail);
    } catch (error) {
      console.error('Erreur lors du chargement du manga:', error);
      Alert.alert('Erreur', 'Impossible de charger ce manga');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadMangaDetail();
  };

  const addMangaToToRead = async (mangaItem: MangaDetail) => {
    if (!userId || !token) {
      return;
    }

    try {
      await api.addToHistory(
        userId,
        {
          mangaId: mangaItem.id,
          title: mangaItem.title,
          cover: mangaItem.coverImage,
          status: 'planned',
        },
        token
      );
    } catch {
      await api.updateHistory(userId, mangaItem.id, { status: 'planned' }, token);
    }
  };

  const handleToggleFavorite = async () => {
    if (!token || !manga) {
      Alert.alert('Erreur', 'Vous devez être connecté pour utiliser cette fonctionnalité');
      return;
    }

    try {
      setIsFavorite(!isFavorite);

      const response = await api.toggleFavorite(
        manga.id,
        {
          title: manga.title,
          score: manga.rating ? Math.round(manga.rating * 20) : null,
        },
        token
      );

      console.log('Toggle favorite response:', response);

      await addMangaToToRead(manga);
      
      // Mise à jour avec la réponse du serveur
      if (response.isFavorite !== undefined) {
        setIsFavorite(response.isFavorite);
      }
    } catch (error: any) {
      console.error('Erreur toggle favorite:', error);
      setIsFavorite(isFavorite); // Rollback en cas d'erreur
      Alert.alert('Erreur', error.message || 'Impossible de modifier les favoris');
    }
  };

  const handleToggleLibrary = async () => {
    if (!token || !manga) {
      Alert.alert('Erreur', 'Vous devez être connecté pour utiliser cette fonctionnalité');
      return;
    }

    try {
      if (isInLibrary) {
        // Supprimer de la bibliothèque
        setIsInLibrary(false);

        const response = await api.removeFromLibrary(manga.id, token);
        console.log('Remove from library response:', response);
      } else {
        // Ajouter à la bibliothèque
        setIsInLibrary(true);

        const response = await api.addToLibrary(
          {
            mangaId: manga.id,
            title: manga.title,
            status: 'planned', // Par défaut "Prévu"
            rating: null,
            progress: 0,
          },
          token
        );

        console.log('Add to library response:', response);
        await addMangaToToRead(manga);
      }
    } catch (error: any) {
      console.error('Erreur toggle library:', error);
      setIsInLibrary(isInLibrary); // Rollback en cas d'erreur
      Alert.alert('Erreur', error.message || 'Impossible de modifier la bibliothèque');
    }
  };

  const handleStartReading = () => {
    // Navigate to chapter 1 or last read chapter
    console.log('Start reading manga:', id);
    // router.push(`/manga/${id}/chapter/1`);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!manga) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>Impossible de charger ce manga</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
      <MangaHeroSection
        coverImage={manga.coverImage}
        onBackPress={() => router.back()}
        isFavorite={isFavorite}
        onFavoritePress={handleToggleFavorite}
      />

      <View style={styles.content}>
        <MangaTitleInfo
          title={manga.title}
          author={manga.author}
          status={manga.status}
          // chapters={manga.chapters}
          year={manga.year}
        />

        <MangaRatingCard
          rating={manga.rating}
          votes={manga.votes}
          rank={manga.rank}
          popularity={manga.popularity}
          favorites={manga.favorites}
        />

        <MangaActionButtons
          isInLibrary={isInLibrary}
          onAddToLibrary={handleToggleLibrary}
          onStartReading={handleStartReading}
        />

        <MangaGenresSection genres={manga.genres} />

        <MangaSynopsisSection synopsis={manga.synopsis} />

        <MangaInformationCard
          type={manga.type}
          status={manga.status}
          chapters={manga.chapters}
          year={manga.year}
          volumes={manga.volumes}
          score={manga.score}
        />

        {/* <MangaRecommendations mangaId={manga.id} /> */}

        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});
