// src/components/ui/AppButton.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
};

export const AppButton = ({ title, onPress, disabled, variant = 'primary' }: Props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={disabled} activeOpacity={disabled ? 1 : 0.7}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  text: {
    color: colors.white,
    fontWeight: '600',
  },
});
