// src/components/ui/AppInput.tsx
import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
type Props = {
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
};

export const AppInput = ({ placeholder, secureTextEntry, onChangeText }: Props) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 14,
  },
  input: {
    height: 48,
    fontSize: 14,
  },
});
