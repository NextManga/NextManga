import { Ionicons } from '@expo/vector-icons';
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
  placeholder = "Rechercher un manga..." 
}: Props) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />
      <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
        <Ionicons name="options-outline" size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: '#F3F4F6',
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
    color: '#1F2937',
  },
  filterButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
