// src/components/auth/AuthFooter.tsx
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '@/constants/theme';

type Props = {
  question: string;
  actionText: string;
  onPress: () => void;
};

export const AuthFooter = ({ question, actionText, onPress }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{question}</Text>
      <TouchableOpacity onPress={onPress}>
      <Text style={styles.link}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    textAlign: 'center',
    color: colors.gray,
    marginInlineEnd: 5,
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
  },
});
