import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { useScanContext } from '../context/ScanContext';

export default function HistoryScreen({ onBack }) {
  const { history, clearHistory } = useScanContext();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Audit Trail</Text>
        <TouchableOpacity onPress={clearHistory}>
          <Text style={styles.clearBtn}>Clear</Text>
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No recent scans recorded</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isHazard = item.verdict === 'HIGH_RISK';
            return (
              <View style={styles.logCard}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.verdictText, { color: isHazard ? COLORS.highRisk : COLORS.safe }]}>
                    {isHazard ? '🚨 BLOCKED' : '✅ APPROVED'}
                  </Text>
                  <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
                <Text style={styles.domainText}>{item.targetDomain}</Text>
                <Text style={styles.scoreText}>Threat Score: {item.score}/100</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },
  heading: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '800' },
  clearBtn: { color: COLORS.highRisk, fontSize: 13, fontWeight: '600' },
  list: { gap: 12 },
  logCard: { backgroundColor: COLORS.cardBg, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  verdictText: { fontSize: 12, fontWeight: '800' },
  timestamp: { color: COLORS.textMuted, fontSize: 11 },
  domainText: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  scoreText: { color: COLORS.textSecondary, fontSize: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 36, marginBottom: 10 },
  emptyText: { color: COLORS.textSecondary, fontSize: 14 },
});