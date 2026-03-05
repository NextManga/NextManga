import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
};

export const SearchBar = ({ 
  value, 
  onChangeText, 
  onFilterPress,
  placeholder
}: Props) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const resolvedPlaceholder = placeholder ?? t('ui.search.placeholder');

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceSecondary }]}>
      <Ionicons name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={resolvedPlaceholder}
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, { color: colors.textPrimary }]}
      />
      <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
        <Ionicons name="options-outline" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  filterButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
