import { colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MangaTitleInfoProps {
  title: string;
  author: string;
  status: 'reading' | 'completed' | 'paused' | 'planned' | 'dropped';
  chapters: number;
  year: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'reading':
      return '#10B981';
    case 'completed':
      return '#3B82F6';
    case 'paused':
      return '#F59E0B';
    case 'planned':
      return '#6B7280';
    case 'dropped':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'reading':
      return 'En cours';
    case 'completed':
      return 'Terminé';
    case 'paused':
      return 'Pause';
    case 'planned':
      return 'Prévu';
    case 'dropped':
      return 'Abandonné';
    default:
      return status;
  }
};

export const MangaTitleInfo: React.FC<MangaTitleInfoProps> = ({
  title,
  author,
  status,
  chapters,
  year,
}) => {
  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Author */}
      <View style={styles.authorRow}>
        <Text style={styles.authorIcon}>👤</Text>
        <Text style={styles.authorText}>Par {author}</Text>
      </View>

      {/* Status & Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>

        <Text style={styles.separator}>•</Text>

        <Text style={styles.stat}>{chapters.toLocaleString()} chapitres</Text>

        <Text style={styles.separator}>•</Text>

        <Text style={styles.stat}>{year}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  authorText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  separator: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  stat: {
    fontSize: 14,
    color: '#6B7280',
  },
});
