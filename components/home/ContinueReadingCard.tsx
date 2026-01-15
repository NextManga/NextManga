import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  cover: string;
  currentChapter: number;
  totalChapters: number;
  onPress?: () => void;
};

export const ContinueReadingCard = ({ 
  title, 
  cover, 
  currentChapter,
  totalChapters,
  onPress 
}: Props) => {
  const progress = (currentChapter / totalChapters) * 100;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: cover }} style={styles.cover} />
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
        
        <Text style={styles.chapter}>
          Chapitre {currentChapter}/{totalChapters}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" style={styles.arrow} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cover: {
    width: 80,
    height: 120,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressContainer: {
    marginVertical: 4,
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  chapter: {
    fontSize: 12,
    color: '#6B7280',
  },
  arrow: {
    alignSelf: 'center',
    marginRight: 8,
  },
});
