import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';

type Props = {
  items: string[];
  onRemove: (title: string) => void;
};

export const SelectedMangaChips = ({ items, onRemove }: Props) => {
  if (items.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {items.map((title) => (
        <View key={title} style={styles.chip}>
          <Text style={styles.text}>{title}</Text>
          <TouchableOpacity onPress={() => onRemove(title)}>
            <Text style={styles.close}>×</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 32,
    marginRight: 8,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 6,
  },

  close: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14,
  },
});
