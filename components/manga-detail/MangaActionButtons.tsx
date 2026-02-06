import { colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MangaActionButtonsProps {
  isInLibrary: boolean;
  onAddToLibrary: () => void;
  onStartReading: () => void;
}

export const MangaActionButtons: React.FC<MangaActionButtonsProps> = ({
  isInLibrary,
  onAddToLibrary,
  onStartReading,
}) => {
  return (
    <View style={styles.container}>
      {/* Add to Library Button */}
      <TouchableOpacity
        style={[
          styles.button,
          isInLibrary ? styles.buttonAdded : styles.buttonNotAdded,
        ]}
        onPress={onAddToLibrary}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonIcon}>{isInLibrary ? '✓' : '+'}</Text>
        <Text
          style={[
            styles.buttonText,
            isInLibrary && styles.buttonTextAdded,
          ]}
        >
          {isInLibrary ? 'Dans ma liste' : 'Ajouter à ma liste'}
        </Text>
      </TouchableOpacity>

      {/* Start Reading Button */}
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={onStartReading}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonSecondaryIcon}>📖</Text>
        <Text style={styles.buttonSecondaryText}>Commencer la lecture</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    gap: 12,
  },
  button: {
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonNotAdded: {
    backgroundColor: colors.primary,
  },
  buttonAdded: {
    backgroundColor: '#10B981',
  },
  buttonIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonTextAdded: {
    color: '#FFFFFF',
  },
  buttonSecondary: {
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.primary,
    gap: 8,
  },
  buttonSecondaryIcon: {
    fontSize: 18,
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
