import { borderRadius, spacing, typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  checked: boolean;
  onToggle: () => void;
  label: React.ReactNode;
};

export const AppCheckbox = ({ checked, onToggle, label }: Props) => {
  const colors = useThemeColors();
  
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle} activeOpacity={0.8}>
      <View style={[styles.box, { borderColor: colors.primary }, checked && { backgroundColor: colors.primary }]}>
        {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
      </View>

      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
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
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: typography.fontSize.sm,
    flex: 1,
  },
});
