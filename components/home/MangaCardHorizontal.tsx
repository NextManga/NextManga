import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  cover: string;
  rating?: number;
  badge?: string;
  badgeColor?: string;
  position?: number;
  onPress?: () => void;
  onBookmarkPress?: () => void;
  isBookmarked?: boolean;
};

export const MangaCardHorizontal = ({ 
  title, 
  cover, 
  rating = 0,
  badge,
  badgeColor = '#6366F1',
  position,
  onPress,
  onBookmarkPress,
  isBookmarked = false
}: Props) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: cover }} style={styles.image} />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          {rating > 0 && (
            <Text style={styles.rating}>⭐ {rating}/5</Text>
          )}
        </LinearGradient>

        {badge && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}

        {position !== undefined && (
          <View style={styles.position}>
            <Text style={styles.positionText}>#{position}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.bookmark} 
          onPress={onBookmarkPress}
        >
          <Ionicons 
            name={isBookmarked ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  card: {
    width: 140,
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  rating: {
    fontSize: 11,
    color: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  position: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#1F2937',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  positionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  bookmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
