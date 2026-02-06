// src/components/ui/AppButton.tsx
import { borderRadius, colors, dimensions, typography } from '@/constants/theme';
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
  const buttonStyle = [
    styles.button,
    variant === 'outline' && styles.outlineButton,
    variant === 'primary' && styles.primaryButton,
    style,
  ];

  const labelStyle = [
    styles.text,
    variant === 'outline' && styles.outlineText,
    variant === 'primary' && styles.primaryText,
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
  primaryButton: {
    backgroundColor: colors.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.gray300,
  },
  text: {
    fontWeight: typography.fontWeight.semiBold,
  },
  primaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.gray700,
  },
});
