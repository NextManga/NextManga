import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface MangaHeroSectionProps {
  coverImage: string;
  onBackPress: () => void;
  isFavorite: boolean;
  onFavoritePress: () => void;
}

export const MangaHeroSection: React.FC<MangaHeroSectionProps> = ({
  coverImage,
  onBackPress,
  isFavorite,
  onFavoritePress,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6366F1', '#4F46E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <View style={styles.backButtonIcon}>
            <View style={styles.backArrow} />
          </View>
        </TouchableOpacity>

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
          activeOpacity={0.7}
        >
          <View style={[styles.heartIcon, isFavorite && styles.heartFilled]}>
            <HeartIcon size={24} color={isFavorite ? '#EF4444' : '#FFFFFF'} />
          </View>
        </TouchableOpacity>

        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>
    </View>
  );
};

// Simple Heart Icon component
const HeartIcon = ({ size, color }: { size: number; color: string }) => (
  <View
    style={{
      width: size,
      height: size,
      borderColor: color,
      borderWidth: 2,
      borderRadius: size / 2,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  />
);

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  heartIcon: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartFilled: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 14,
  },
  coverContainer: {
    width: 160,
    height: 230,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
});
