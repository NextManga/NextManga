// src/components/auth/AuthFooter.tsx
import { spacing, typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  question: string;
  actionText: string;
  onPress: () => void;
};

export const AuthFooter = ({ question, actionText, onPress }: Props) => {
  const colors = useThemeColors();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.textSecondary }]}>{question}</Text>
      <TouchableOpacity onPress={onPress}>
      <Text style={[styles.link, { color: colors.primary }]}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  text: {
    textAlign: 'center',
    marginInlineEnd: 5,
  },
  link: {
    fontWeight: typography.fontWeight.semiBold,
  },
});
