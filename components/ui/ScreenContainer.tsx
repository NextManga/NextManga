import { colors } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

export const ScreenContainer = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});
