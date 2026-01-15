import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  title: string;
  cover: string;
  selected: boolean;
  onPress: () => void;
};

export const MangaCard = ({ title, cover, selected, onPress }: Props) => {
  return (
    <Pressable onPress={onPress} style={[styles.card, selected && styles.selected]}>
      <Image source={{ uri: cover }} style={styles.image} />

      <View style={styles.overlay}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>

      <View style={styles.icon}>
        <Ionicons
          name={selected ? 'checkmark' : 'add'}
          size={14}
          color="#FFF"
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '30%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  selected: {
    borderWidth: 3,
    borderColor: '#6366F1',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  title: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  icon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
