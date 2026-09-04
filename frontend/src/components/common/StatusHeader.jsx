import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function StatusHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.logoBadge}>
        <Text style={styles.logoIcon}>🛡️</Text>
      </View>
      <View>
        <Text style={styles.title}>PayShield</Text>
        <Text style={styles.subtitle}>Payment Threat Detection Engine</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoIcon: { fontSize: 22 },
  title: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800', letterSpacing: 0.3 },
  subtitle: { color: COLORS.textSecondary, fontSize: 12 },
});