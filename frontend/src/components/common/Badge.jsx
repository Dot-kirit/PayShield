import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function Badge({ verdict }) {
  const isHighRisk = verdict === 'HIGH_RISK';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: isHighRisk ? COLORS.highRiskBg : COLORS.safeBg,
          borderColor: isHighRisk ? COLORS.highRisk : COLORS.safe,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color: isHighRisk ? COLORS.highRisk : COLORS.safe }]}>
        {isHighRisk ? '🚨 CRITICAL PAYMENT THREAT' : '✅ VERIFIED TRUSTED LINK'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});