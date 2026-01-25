import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
};

export const MangaSearchBar = ({ value, onChange, onClear }: Props) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#9CA3AF" />
      <TextInput
        placeholder="Rechercher un manga..."
        placeholderTextColor={colors.gray400}
        style={styles.input}
        value={value}
        onChangeText={onChange}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <Ionicons name="close" size={18} color={colors.gray400} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.xxl,
    paddingHorizontal: spacing.base,
    height: 48,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
});
