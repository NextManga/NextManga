import { useThemeColors } from '@/hooks/useThemeColors';
import { StyleSheet, View } from 'react-native';

type Props = {
  level: number; // 0 → 3
};

export const PasswordStrength = ({ level }: Props) => {
  const colors = useThemeColors();
  
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { backgroundColor: level > i ? (
              level === 1 && i === 0 ? colors.error :
              level === 2 && i < 2 ? colors.warning :
              level === 3 ? colors.success :
              colors.gray200
            ) : colors.gray200 },
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
    marginRight: 6,
  },
});
