import { colors } from '@/constants/theme';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MangaSynopsisSectionProps {
  synopsis: string;
}

export const MangaSynopsisSection: React.FC<MangaSynopsisSectionProps> = ({
  synopsis,
}) => {
  const [expanded, setExpanded] = useState(false);

  const MAX_LINES = 6;
  const shouldShowMore = synopsis.split('\n').length > MAX_LINES || synopsis.length > 300;
  const displayText = expanded ? synopsis : synopsis.substring(0, 300);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Synopsis</Text>
      <Text
        style={styles.text}
        numberOfLines={expanded ? undefined : MAX_LINES}
      >
        {displayText}
      </Text>
      {shouldShowMore && (
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.seeMoreLink}>
            {expanded ? 'Voir moins' : 'Voir plus'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    lineHeight: 25.5,
    color: '#4B5563',
    marginBottom: 8,
  },
  seeMoreLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
  },
});
