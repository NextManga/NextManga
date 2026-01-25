import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  checked: boolean;
  onToggle: () => void;
  label: React.ReactNode;
};

export const AppCheckbox = ({ checked, onToggle, label }: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle} activeOpacity={0.8}>
      <View style={[styles.box, checked && styles.checked]}>
        {checked && <Ionicons name="checkmark" size={14} color={colors.white} />}
      </View>

      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  box: {
    width: 18,
    height: 18,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
});
