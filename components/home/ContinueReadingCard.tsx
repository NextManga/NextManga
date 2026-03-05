import { useThemeColors } from '@/hooks/useThemeColors';
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
  const colors = useThemeColors();
  const progress = (currentChapter / totalChapters) * 100;

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.surfacePrimary }]} 
      onPress={onPress}
    >
      <Image source={{ uri: cover }} style={styles.cover} />
      
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
          {title}
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBackground, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
          </View>
        </View>
        
        <Text style={[styles.chapter, { color: colors.textSecondary }]}>
          Chapitre {currentChapter}/{totalChapters}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} style={styles.arrow} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 120,
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
  },
  progressContainer: {
    marginVertical: 4,
  },
  progressBackground: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  chapter: {
    fontSize: 12,
  },
  arrow: {
    alignSelf: 'center',
    marginRight: 8,
  },
});
