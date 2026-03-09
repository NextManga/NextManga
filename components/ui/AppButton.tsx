// src/components/ui/AppButton.tsx
import { borderRadius, dimensions, typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export const AppButton = ({ title, onPress, disabled, variant = 'primary', style, textStyle }: Props) => {
  const colors = useThemeColors();
  
  const buttonStyle = [
    styles.button,
    variant === 'outline' && [styles.outlineButton, { borderColor: colors.border }],
    variant === 'primary' && { backgroundColor: colors.primary },
    style,
  ];

  const labelStyle = [
    styles.text,
    variant === 'outline' && { color: colors.textPrimary },
    variant === 'primary' && { color: '#FFFFFF' },
    textStyle,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled} activeOpacity={disabled ? 1 : 0.7}>
      <Text style={labelStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: dimensions.buttonHeight.base,
    borderRadius: borderRadius.base,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  text: {
    fontWeight: typography.fontWeight.semiBold,
  },
});
