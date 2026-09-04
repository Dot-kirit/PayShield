import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/colors';
import StatusHeader from '../components/common/StatusHeader';
import PayShieldModal from '../components/modals/PayShieldModal';
import { analyzeSharedLink } from '../api/scamDetector';

export default function HomeScreen() {
  const [inputText, setInputText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanData, setScanData] = useState(null);

  const handleRunScan = async () => {
    if (!inputText.trim()) {
      Alert.alert('Empty Input', 'Please paste a payment link or SMS message to inspect.');
      return;
    }

    setModalVisible(true);
    setAnalyzing(true);
    setScanData(null);

    try {
      const result = await analyzeSharedLink(inputText);
      setScanData(result);
    } catch (err) {
      setModalVisible(false);
      Alert.alert('Analysis Failed', err.message || 'Unable to connect to backend engine.');
    } finally {
      setAnalyzing(false);
    }
  };

  const clearInput = () => {
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <StatusHeader />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>🛡️ Real-Time Payment Interceptor</Text>
          <Text style={styles.bannerSubtitle}>
            Paste suspicious links or message text below for immediate heuristic and LLM verification.
          </Text>
        </View>

        <View style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>TARGET LINK / MESSAGE CONTENT</Text>
            {inputText.length > 0 && (
              <TouchableOpacity onPress={clearInput}>
                <Text style={styles.clearBtn}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={styles.messageInput}
            multiline
            value={inputText}
            onChangeText={setInputText}
            placeholder="Paste payment link, SMS, or shared WhatsApp text here..."
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, !inputText.trim() && styles.actionBtnDisabled]}
          onPress={handleRunScan}
          disabled={!inputText.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>⚡ Intercept & Inspect Link</Text>
        </TouchableOpacity>

        <View style={styles.shieldNotice}>
          <Text style={styles.noticeTitle}>Zero-Trust Gatekeeper</Text>
          <Text style={styles.noticeBody}>
            PayShield runs continuous structural verification against gateway records, domain age anomalies, and social engineering coercion markers.
          </Text>
        </View>
      </ScrollView>

      <PayShieldModal
        visible={modalVisible}
        analyzing={analyzing}
        scanData={scanData}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: 20 },
  banner: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  bannerTitle: { color: COLORS.primary, fontSize: 14, fontWeight: '800', marginBottom: 4 },
  bannerSubtitle: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 },
  inputCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 16,
  },
  inputHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  inputLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },
  clearBtn: { color: COLORS.highRisk, fontSize: 12, fontWeight: '600' },
  messageInput: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  actionBtnDisabled: {
    opacity: 0.45,
  },
  actionBtnText: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700' },
  shieldNotice: {
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  noticeTitle: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '700', marginBottom: 6 },
  noticeBody: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 },
});