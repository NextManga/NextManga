import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

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
    marginVertical: 16,
  },
  box: {
    width: 18,
    height: 18,
    borderRadius: 4,
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
    fontSize: 12,
    color: colors.gray,
    flex: 1,
  },
});
