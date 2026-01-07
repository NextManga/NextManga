import { Text, StyleSheet, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';

type Props = {
  label: string;
  emoji: string;
  count: string;
  selected: boolean;
  onPress: () => void;
  width: number;
};

export const GenreCard = ({
  label,
  emoji,
  count,
  selected,
  onPress,
  width,
}: Props) => {
  const CardContent = (
    <>
      {selected && (
        <View style={styles.check}>
          <Ionicons name="checkmark" size={14} color={colors.primary} />
        </View>
      )}

      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, selected && styles.white]}>{label}</Text>
      <Text style={[styles.count, selected && styles.whiteMuted]}>
        {count}
      </Text>
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      {selected ? (
        <LinearGradient
          colors={['#6366F1', '#818CF8']}
          style={[styles.card, styles.selected, { width }]}
        >
          {CardContent}
        </LinearGradient>
      ) : (
        <View style={[styles.card, { width }]}>
          {CardContent}
        </View>
      )}
    </Pressable>
  );
};



const styles = StyleSheet.create({
  card: {
    height: 120,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  selected: {
    borderWidth: 0,
    elevation: 4,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  count: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  white: {
    color: '#FFF',
  },
  whiteMuted: {
    color: '#E0E7FF',
  },
  check: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFF',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
