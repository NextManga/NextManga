import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MangaRatingCardProps {
  rating: number;
  votes: number;
  rank: number;
  popularity: number;
  favorites: number;
}

export const MangaRatingCard: React.FC<MangaRatingCardProps> = ({
  rating,
  votes,
  rank,
  popularity,
  favorites,
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <View style={styles.card}>
      {/* Column 1: Rating */}
      <View style={styles.column}>
        <Text style={styles.icon}>⭐</Text>
        <Text style={styles.value}>{rating.toFixed(1)}/5</Text>
        <Text style={styles.label}>{formatNumber(votes)} votes</Text>
      </View>

      {/* Column 2: Rank */}
      <View style={styles.column}>
        <Text style={styles.icon}>📚</Text>
        <Text style={styles.value}>#{rank}</Text>
        <Text style={styles.label}>Popularité</Text>
      </View>

      {/* Column 3: Favorites */}
      <View style={styles.column}>
        <Text style={styles.icon}>❤️</Text>
        <Text style={styles.value}>{formatNumber(favorites)}</Text>
        <Text style={styles.label}>Favoris</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
});
