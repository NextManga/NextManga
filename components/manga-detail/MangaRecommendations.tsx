import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface MangaRecommendationsProps {
  mangaId: string;
}

export const MangaRecommendations: React.FC<MangaRecommendationsProps> = ({
  mangaId,
}) => {
  const router = useRouter();
  const { token } = useAuth();
  const [recommendations, setRecommendations] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [mangaId]);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      // Charger les recommandations depuis l'API avec le mangaId comme seedMangaId
      const data = await api.getRecommendationsForManga(mangaId, token || undefined);
      if (data && data.length > 0) {
        setRecommendations(data);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.warn('Impossible de charger les recommandations:', err);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePressRecommendation = (id: string) => {
    router.push({ pathname: '/manga/[id]' as any, params: { id } });
  };

  const renderRecommendationCard = ({
    item,
  }: {
    item: any;
  }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePressRecommendation(item.id)}
      activeOpacity={0.7}
    >
      <ImageBackground
        source={{ uri: item.cover }}
        style={styles.cardImage}
        resizeMode="cover"
      >
        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)']}
          style={styles.gradientOverlay}
        />

        {/* Rating badge */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {item.rating.toFixed(1)}</Text>
        </View>

        {/* Title at bottom */}
        <View style={styles.titleOverlay}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  if (recommendations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucune recommandation disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vous aimerez aussi</Text>
        <Text style={styles.subtitle}>Basé sur vos préférences</Text>
      </View>

      <FlatList
        data={recommendations}
        renderItem={renderRecommendationCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 32,
  },
  header: {
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#6B7280',
  },
  listContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  card: {
    width: 130,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  titleOverlay: {
    padding: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  emptyContainer: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
