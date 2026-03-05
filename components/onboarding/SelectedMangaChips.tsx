import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  items: Array<{ id: string; title: string }>;
  onRemove: (mangaId: string) => void;
};

export const SelectedMangaChips = ({ items, onRemove }: Props) => {
  if (items.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {items.map((item) => (
        <View key={item.id} style={styles.chip}>
          <Text style={styles.text}>{item.title}</Text>
          <TouchableOpacity onPress={() => onRemove(item.id)}>
            <Text style={styles.close}>×</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    marginVertical: spacing.sm,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    height: 32,
    marginRight: spacing.sm,
  },

  text: {
    color: colors.white,
    fontSize: 13,
    fontWeight: typography.fontWeight.semiBold,
    marginRight: spacing.xs,
  },

  close: {
    color: colors.white,
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 14,
  },
});
