// src/components/ui/AppLogo.tsx
import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export const AppLogo = () => {
  return (
    <View style={styles.container}>
      <View style={styles.icon} />
      <Text style={styles.text}>NextManga</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.xxxl,
    marginTop: 65,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.white,
    marginBottom: 10,
  },
  text: {
    color: colors.white,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: 50,
  },
});
