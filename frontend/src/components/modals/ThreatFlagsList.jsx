import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function ThreatFlagsList({ flags, isHazard }) {
  return (
    <View style={styles.flagsList}>
      {flags.map((reason, idx) => (
        <View key={idx} style={styles.flagRow}>
          <Text style={styles.flagIcon}>{isHazard ? '⚠️' : '✓'}</Text>
          <Text style={styles.flagReason}>{reason}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flagsList: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  flagRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  flagIcon: { fontSize: 13, marginTop: 1 },
  flagReason: { color: '#EBEBF5', fontSize: 12, flex: 1, lineHeight: 17 },
});