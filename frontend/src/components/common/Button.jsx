import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'destructive':
        return styles.btnDestructive;
      case 'safe':
        return styles.btnSafe;
      case 'secondary':
        return styles.btnSecondary;
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyle = () => {
    if (variant === 'secondary') return styles.textSecondary;
    return styles.textLight;
  };

  return (
    <TouchableOpacity
      style={[styles.btnBase, getVariantStyle(), disabled && styles.btnDisabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? COLORS.primary : '#FFFFFF'} />
      ) : (
        <Text style={[styles.textBase, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnBase: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
  },
  btnDestructive: {
    backgroundColor: COLORS.highRisk,
  },
  btnSafe: {
    backgroundColor: COLORS.safe,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  textBase: {
    fontSize: 14,
    fontWeight: '700',
  },
  textLight: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: COLORS.textSecondary,
  },
});