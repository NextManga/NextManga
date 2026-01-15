import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  cover: string;
  selected: boolean;
  onPress: () => void;
};

export const MangaCard = ({ title, cover, selected, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, selected && styles.containerSelected]}
    >
      <View style={[styles.card, selected && styles.cardSelected]}>
        <Image source={{ uri: cover }} style={styles.image} />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </LinearGradient>

        <View style={[styles.icon, selected && styles.selectedIcon]}>
          <Ionicons
            name={selected ? 'checkmark' : 'add'}
            size={16}
            color="#FFF"
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 110,
    height: 180,
    marginBottom: 12,
  },
  containerSelected: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: '#6366F1',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 12,
    paddingBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  icon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: {
    backgroundColor: '#6366F1',
  },
});
