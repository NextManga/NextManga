import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MangaInformationCardProps {
  type: string;
  status: 'reading' | 'completed' | 'paused' | 'planned' | 'dropped';
  chapters: number;
  year: number;
  volumes: number;
  score: number;
}

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

export const MangaInformationCard: React.FC<MangaInformationCardProps> = ({
  type,
  status,
  chapters,
  year,
  volumes,
  score,
}) => {
  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Informations</Text>

      {/* Left Column */}
      <View style={styles.row}>
        <View style={styles.column}>
          <InfoItem label="Type" value={type} />
          <InfoItem label="Statut" value={getStatusLabel(status)} />
          <InfoItem label="Chapitres" value={chapters.toString()} />
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          <InfoItem label="Début" value={year.toString()} />
          <InfoItem label="Volumes" value={volumes.toString()} />
          <InfoItem label="Score" value={score.toFixed(1) + '/5'} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  infoItem: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});
