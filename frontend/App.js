import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  Share2,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Wifi,
  Battery,
  Send,
} from 'lucide-react-native';

const API_URL = 'https://your-n8n-instance.com/webhook/payshield-analyze';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const demoScamLink =
    'Pay ₹18,500 immediately to release your package: https://pay-secure-verify.top/rq?id=992';

  const handleShareTrigger = async (payload) => {
    setModalVisible(true);
    setLoading(true);
    setScanResult(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: payload }),
      });

      const data = await response.json();
      setScanResult(data);
    } catch (error) {
      // Mock fallback so the pitch demo works perfectly even offline
      setScanResult({
        risk_score: 87,
        verdict: 'HIGH_RISK',
        flags: [
          'Domain registered less than 14 days ago',
          'Artificial urgency detected in message',
          'Merchant identity unverified in database',
        ],
        explanation:
          'This payment request exhibits strong indicators associated with domain impersonation and phishing fraud.',
      });
    } finally {
      setLoading(false);
    }
  };

  const isHighRisk = scanResult?.verdict === 'HIGH_RISK';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Mobile Status Bar Visual */}
      <View style={styles.statusBarSim}>
        <Text style={styles.timeText}>9:41</Text>
        <View style={styles.notch} />
        <View style={styles.statusIcons}>
          <Wifi color="#A0A0A0" size={14} />
          <Battery color="#A0A0A0" size={14} style={{ marginLeft: 4 }} />
        </View>
      </View>

      {/* Main Screen UI */}
      <View style={styles.mainContent}>
        <Text style={styles.appTitle}>PayShield Mobile Sandbox</Text>
        <Text style={styles.subTitle}>
          Tap the share button below to simulate receiving a payment request in WhatsApp or SMS.
        </Text>

        <View style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <Send color="#007AFF" size={14} />
            <Text style={styles.messageSender}>WhatsApp • +91 98765 43210</Text>
          </View>
          <Text style={styles.messageBody}>"{demoScamLink}"</Text>
        </View>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => handleShareTrigger(demoScamLink)}
          activeOpacity={0.8}
        >
          <Share2 color="#FFFFFF" size={18} />
          <Text style={styles.shareButtonText}>Share to PayShield</Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM SHEET MODAL */}
      {/* BOTTOM SHEET MODAL */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.sheetCard}>
            <View style={styles.dragHandle} />

            {loading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Analyzing Payment Context...</Text>
                <Text style={styles.loadingSubtext}>Checking domain reputation & AI threat markers</Text>
              </View>
            ) : scanResult ? (
              <View style={styles.resultContainer}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: isHighRisk ? 'rgba(255, 59, 48, 0.2)' : 'rgba(52, 199, 89, 0.2)' },
                    { borderColor: isHighRisk ? '#FF3B30' : '#34C759' },
                  ]}
                >
                  {isHighRisk ? (
                    <>
                      <ShieldAlert color="#FF3B30" size={16} />
                      <Text style={[styles.badgeText, { color: '#FF3B30' }]}>HIGH RISK DETECTED</Text>
                    </>
                  ) : (
                    <>
                      <CheckCircle color="#34C759" size={16} />
                      <Text style={[styles.badgeText, { color: '#34C759' }]}>SAFE TO PAY</Text>
                    </>
                  )}
                </View>

                <View style={styles.scoreRow}>
                  <Text style={styles.scoreTitle}>Threat Score</Text>
                  <Text style={[styles.scoreValue, { color: isHighRisk ? '#FF3B30' : '#34C759' }]}>
                    {scanResult.risk_score}/100
                  </Text>
                </View>

                <Text style={styles.explanationText}>{scanResult.explanation}</Text>

                <View style={styles.flagsCard}>
                  {scanResult.flags?.map((flag, index) => (
                    <View key={index} style={styles.flagItem}>
                      <AlertTriangle color="#FFCC00" size={14} style={styles.flagIcon} />
                      <Text style={styles.flagText}>{flag}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.buttonRow}>
                  {isHighRisk ? (
                    <>
                      <TouchableOpacity
                        style={[styles.btn, styles.btnCancel]}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={styles.btnCancelText}>Cancel Payment</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.btn, styles.btnProceed]}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={styles.btnProceedText}>Proceed Anyway</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={[styles.btn, styles.btnSafe]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.btnSafeText}>Continue to Pay</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : null}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0C' },
  statusBarSim: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8 },
  timeText: { color: '#A0A0A0', fontSize: 12, fontWeight: '600' },
  notch: { width: 60, height: 12, backgroundColor: '#1C1C1E', borderRadius: 6 },
  statusIcons: { flexDirection: 'row', alignItems: 'center' },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  appTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  subTitle: { color: '#8E8E93', fontSize: 13, textAlign: 'center', marginBottom: 32, lineHeight: 18 },
  messageCard: { backgroundColor: '#1C1C1E', width: '100%', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#2C2C2E', marginBottom: 24 },
  messageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  messageSender: { color: '#007AFF', fontSize: 12, fontWeight: '600', marginLeft: 6 },
  messageBody: { color: '#EBEBF5', fontSize: 14, lineHeight: 20 },
  shareButton: { backgroundColor: '#007AFF', width: '100%', paddingVertical: 14, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  shareButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  modalStyle: { justifyContent: 'flex-end', margin: 0 },
  sheetCard: { backgroundColor: '#161618', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 380, borderTopWidth: 1, borderTopColor: '#2C2C2E' },
  dragHandle: { width: 36, height: 4, backgroundColor: '#3A3A3C', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  centerBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  loadingText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginTop: 16 },
  loadingSubtext: { color: '#8E8E93', fontSize: 12, marginTop: 4 },
  resultContainer: { flex: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, gap: 6, marginBottom: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  scoreTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  scoreValue: { fontSize: 28, fontWeight: '800' },
  explanationText: { color: '#98989D', fontSize: 13, lineHeight: 18, marginBottom: 16 },
  flagsCard: { backgroundColor: '#202024', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#2C2C2E', marginBottom: 24, gap: 8 },
  flagItem: { flexDirection: 'row', alignItems: 'center' },
  flagIcon: { marginRight: 8 },
  flagText: { color: '#FFCC00', fontSize: 12, fontWeight: '500', flex: 1 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnCancel: { backgroundColor: '#FF3B30' },
  btnCancelText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  btnProceed: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#3A3A3C' },
  btnProceedText: { color: '#8E8E93', fontSize: 14 },
  btnSafe: { backgroundColor: '#34C759' },
  btnSafeText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', },
});