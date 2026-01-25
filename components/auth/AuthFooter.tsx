// src/components/auth/AuthFooter.tsx
import { colors, spacing, typography } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  question: string;
  actionText: string;
  onPress: () => void;
};

export const AuthFooter = ({ question, actionText, onPress }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{question}</Text>
      <TouchableOpacity onPress={onPress}>
      <Text style={styles.link}>{actionText}</Text>
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
    color: colors.textSecondary,
    marginInlineEnd: 5,
  },
  link: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semiBold,
  },
});
