import { View, StyleSheet } from 'react-native';

type Props = {
  level: number; // 0 → 3
};

export const PasswordStrength = ({ level }: Props) => {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.bar,
            level > i && styles.active,
            level === 1 && i === 0 && styles.weak,
            level === 2 && i < 2 && styles.medium,
            level === 3 && styles.strong,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginRight: 6,
  },
  active: {},
  weak: { backgroundColor: '#EF4444' },
  medium: { backgroundColor: '#F59E0B' },
  strong: { backgroundColor: '#22C55E' },
});
