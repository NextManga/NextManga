import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

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
    paddingHorizontal: 24,
    paddingTop:50,
  },
  step: {
    color: '#6B7280',
    fontSize: 12,
  },
  skip: {
    color: colors.primary,
    fontWeight: '600',
  },
});
