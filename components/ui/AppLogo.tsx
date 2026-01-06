// src/components/ui/AppLogo.tsx
import { colors } from '@/constants/theme';
import { View, Text, StyleSheet } from 'react-native';

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
    marginVertical: 40,
    marginTop: 65,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.white,
    marginBottom: 10,
  },
  text: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 50,
  },
});
