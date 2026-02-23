// src/components/ui/AppInput.tsx
import { borderRadius, dimensions, typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { StyleSheet, TextInput, View } from 'react-native';
type Props = {
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  value?: string;
};

export const AppInput = ({ placeholder, secureTextEntry, onChangeText, value }: Props) => {
  const colors = useThemeColors();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceSecondary, borderColor: colors.primary }]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        secureTextEntry={secureTextEntry}
        style={[styles.input, { color: colors.textPrimary }]}
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.base,
    marginBottom: 15,
    paddingHorizontal: 14,
    borderWidth: 1.5,
  },
  input: {
    height: dimensions.inputHeight.base,
    fontSize: typography.fontSize.base,
  },
});
