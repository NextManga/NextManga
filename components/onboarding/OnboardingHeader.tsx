import { colors, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  step: string;
  onBack?: () => void;
  onSkip?: () => void;
};

export const OnboardingHeader = ({ step, onBack, onSkip }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#9CA3AF" />
      </TouchableOpacity>

      <Text style={styles.step}>{step}</Text>

      <TouchableOpacity onPress={onSkip}>
        <Text style={styles.skip}>Passer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 50,
  },
  step: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  skip: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semiBold,
  },
});
