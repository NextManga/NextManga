// src/components/ui/AppLogo.tsx
import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import { Image, StyleSheet, Text, View } from 'react-native';

export const AppLogo = () => {
  return (
    <View style={styles.container}>
      {/* <Image 
        source={require('@/assets/images/App_icon.png')} 
        style={styles.icon}
        resizeMode="cover"
      /> */}
      <Image
      source={require('@/assets/images/logo.png')}
      style={styles.icon}
      resizeMode="cover"
      />

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
    width: 65,
    height: 65,
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
