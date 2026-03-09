import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  onSeeAllPress?: () => void;
  showSeeAll?: boolean;
};

export const SectionHeader = ({ title, onSeeAllPress, showSeeAll = true }: Props) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {showSeeAll && (
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>{t('ui.section.seeAll')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
});
