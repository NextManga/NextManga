import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  genres: string[];
  coverImage: string;
  onReadPress?: () => void;
  onLearnMorePress?: () => void;
};

export const HeroBanner = ({ title, genres, coverImage, onReadPress, onLearnMorePress }: Props) => {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: coverImage }} 
        style={styles.background}
        blurRadius={2}
      >
        <LinearGradient
          colors={['transparent', 'rgba(99, 102, 241, 0.9)']}
          style={styles.gradient}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Recommandé pour vous</Text>
          </View>
          
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          
          <Text style={styles.genres}>{genres.join(' • ')}</Text>
          
          <TouchableOpacity onPress={onLearnMorePress}>
            <Text style={styles.learnMore}>En savoir plus &gt;</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.ctaButton} onPress={onReadPress}>
            <Text style={styles.ctaText}>Commencer la lecture</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  background: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  badge: {
    backgroundColor: '#6366F1',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  genres: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  learnMore: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaText: {
    color: '#6366F1',
    fontSize: 15,
    fontWeight: '700',
  },
});
