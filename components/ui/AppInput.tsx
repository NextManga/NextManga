// src/components/ui/AppInput.tsx
import { borderRadius, colors, dimensions, typography } from '@/constants/theme';
import { StyleSheet, TextInput, View } from 'react-native';
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
        placeholderTextColor={colors.backgroundAppI}
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
    borderRadius: borderRadius.base,
    marginBottom: 15,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  input: {
    height: dimensions.inputHeight.base,
    fontSize: typography.fontSize.base,
  },
});
