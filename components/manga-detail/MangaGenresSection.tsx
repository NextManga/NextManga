import { colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MangaGenresSectionProps {
  genres: string[];
}

export const MangaGenresSection: React.FC<MangaGenresSectionProps> = ({ genres }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Genres</Text>
      <View style={styles.tagsContainer}>
        {genres.map((genre, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{genre}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
  },
});
