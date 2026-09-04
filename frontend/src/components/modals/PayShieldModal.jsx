import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import ThreatFlagsList from './ThreatFlagsList';

export default function PayShieldModal({ visible, analyzing, scanData, onClose }) {
  const verdict = scanData?.verdict || 'SAFE';
  const isScam = verdict === 'SCAM';
  const isSuspicious = verdict === 'SUSPICIOUS';
  const isSafe = verdict === 'SAFE';

  const getThemeColor = () => {
    if (isScam) return COLORS.highRisk;
    if (isSuspicious) return '#FFCC00';
    return COLORS.safe;
  };

  const getThemeBg = () => {
    if (isScam) return COLORS.highRiskBg;
    if (isSuspicious) return 'rgba(255, 204, 0, 0.15)';
    return COLORS.safeBg;
  };

  const themeColor = getThemeColor();

  return (
    <Modal
      visible={Boolean(visible)}
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (typeof onClose === 'function') onClose();
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          {analyzing ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingHeading}>Analyzing Security Telemetry...</Text>
              <Text style={styles.loadingSub}>Inspecting domain history & risk patterns via n8n</Text>
            </View>
          ) : scanData ? (
            <View>
              <View style={[styles.badge, { backgroundColor: getThemeBg(), borderColor: themeColor }]}>
                <Text style={[styles.badgeText, { color: themeColor }]}>
                  {isScam ? '🚨 SCAM DETECTED' : isSuspicious ? '⚠️ SUSPICIOUS LINK' : '✅ VERIFIED SAFE'}
                </Text>
              </View>

              <View style={styles.scoreRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.domainText} numberOfLines={1}>
                    {scanData.targetDomain}
                  </Text>
                  <Text style={styles.categoryText}>Threat Score Index</Text>
                </View>
                <View style={styles.scoreCircle}>
                  <Text style={[styles.scoreValue, { color: themeColor }]}>
                    {scanData.score}
                  </Text>
                  <Text style={styles.scoreScale}>/100</Text>
                </View>
              </View>

              <Text style={styles.evidenceTitle}>Risk Indicators Identified</Text>
              {scanData.reasons && scanData.reasons.length > 0 ? (
                <ThreatFlagsList flags={scanData.reasons} isHazard={!isSafe} />
              ) : (
                <View style={styles.noFlagsBox}>
                  <Text style={styles.noFlagsText}>No critical risk indicators flagged by engine.</Text>
                </View>
              )}

              <Text style={styles.recommendationText}>{scanData.recommendation}</Text>

              <View style={styles.ctaRow}>
                {isScam || isSuspicious ? (
                  <>
                    <TouchableOpacity
                      style={[styles.modalBtn, { backgroundColor: COLORS.highRisk }]}
                      onPress={onClose}
                    >
                      <Text style={styles.btnTextWhite}>Block & Discard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalBtn, styles.btnSecondary]}
                      onPress={onClose}
                    >
                      <Text style={styles.btnSecondaryText}>Override</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: COLORS.safe }]}
                    onPress={onClose}
                  >
                    <Text style={styles.btnTextWhite}>Proceed to Gateway</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 440,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sheetHandle: { width: 36, height: 4, backgroundColor: '#3A3A3C', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  loadingBox: { paddingVertical: 60, alignItems: 'center' },
  loadingHeading: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 18 },
  loadingSub: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, marginBottom: 16 },
  badgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  domainText: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '800' },
  categoryText: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  scoreCircle: { alignItems: 'flex-end' },
  scoreValue: { fontSize: 32, fontWeight: '900' },
  scoreScale: { color: COLORS.textMuted, fontSize: 11 },
  evidenceTitle: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.6 },
  noFlagsBox: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  noFlagsText: { color: COLORS.textSecondary, fontSize: 12 },
  recommendationText: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18, marginBottom: 24 },
  ctaRow: { flexDirection: 'row', gap: 12 },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnTextWhite: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  btnSecondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#3A3A3C' },
  btnSecondaryText: { color: COLORS.textSecondary, fontSize: 14 },
});