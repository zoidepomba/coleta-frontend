import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, radius, shadows } from '../theme';
import { Header, EmptyState, BottomNav } from '../components';
import { coletaService } from '../services/api';

const STATUS_LABEL = {
  pending: 'Aguardando coletor',
  negotiating: 'Proposta recebida',
  accepted: 'Aceita',
  completed: 'Concluída',
  cancelled: 'Cancelada',
};

const STATUS_COLOR = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  negotiating: { bg: '#EDE9FE', text: '#5B21B6' },
  accepted: { bg: '#DBEAFE', text: '#1E40AF' },
  completed: { bg: '#D1FAE5', text: '#065F46' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
};

function ColetaItem({ item, onResponder }) {
  const statusColor = STATUS_COLOR[item.status] ?? STATUS_COLOR.pending;
  const [loadingResposta, setLoadingResposta] = useState(false);

  const date = new Date(item.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handleResponder = async (aceitar) => {
    setLoadingResposta(true);
    await onResponder(item.id, aceitar);
    setLoadingResposta(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{item.waste_icon}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.waste_label}</Text>
          <Text style={styles.cardDate}>{date}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusColor.bg }]}>
          <Text style={[styles.badgeText, { color: statusColor.text }]}>
            {STATUS_LABEL[item.status] ?? item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <Text style={styles.cardAddress} numberOfLines={2}>{item.address}</Text>

      <View style={styles.valueRow}>
        <Text style={styles.valueLabel}>Seu valor</Text>
        <Text style={styles.cardValue}>
          R$ {item.value.toFixed(2).replace('.', ',')}
        </Text>
      </View>

      {item.status === 'negotiating' && item.valor_aceito != null && (
        <View style={styles.propostaBox}>
          <View style={styles.propostaHeader}>
            <Text style={styles.propostaIcon}>💬</Text>
            <Text style={styles.propostaLabel}>O coletor propôs um novo valor:</Text>
          </View>
          <Text style={styles.propostaValor}>
            R$ {item.valor_aceito.toFixed(2).replace('.', ',')}
          </Text>

          {loadingResposta ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.sm }} />
          ) : (
            <View style={styles.propostaActions}>
              <TouchableOpacity
                style={styles.aceitarBtn}
                onPress={() => handleResponder(true)}
              >
                <Text style={styles.aceitarText}>✓ Aceitar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.recusarBtn}
                onPress={() => handleResponder(false)}
              >
                <Text style={styles.recusarText}>✕ Recusar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function HistoricoScreen({ navigation, route }) {
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNavigate = (key) => {
    if (key === 'home') navigation.navigate('Home');
    if (key === 'account') navigation.navigate('Conta');
  };

  const fetchColetas = useCallback(async () => {
    try {
      const { data } = await coletaService.minhas();
      setColetas(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColetas();
  }, [fetchColetas]);

  useEffect(() => {
    if (route.params?.novaSolicitacao) {
      fetchColetas();
    }
  }, [route.params?.novaSolicitacao, fetchColetas]);

  const handleResponder = async (id, aceitar) => {
    try {
      const { data } = await coletaService.responder(id, aceitar);
      setColetas((prev) => prev.map((c) => (c.id === id ? data : c)));
    } catch {
      // silently fail
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Histórico de coletas" onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : coletas.length === 0 ? (
        <View style={styles.center}>
          <EmptyState
            icon="📋"
            title="Nenhuma coleta ainda"
            subtitle="Suas solicitações de coleta aparecerão aqui."
          />
        </View>
      ) : (
        <FlatList
          data={coletas}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ColetaItem item={item} onResponder={handleResponder} />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <BottomNav active="history" onNavigate={handleNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  list: { padding: spacing.md, gap: spacing.sm },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardIcon: { fontSize: 28 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardDate: { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },

  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },

  cardAddress: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.xs },

  valueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  valueLabel: { fontSize: 13, color: colors.textSecondary },
  cardValue: { fontSize: 16, fontWeight: '700', color: colors.primary },

  propostaBox: {
    marginTop: spacing.sm,
    backgroundColor: '#F5F3FF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  propostaHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  propostaIcon: { fontSize: 14 },
  propostaLabel: { fontSize: 13, color: '#5B21B6', flex: 1 },
  propostaValor: { fontSize: 20, fontWeight: '800', color: '#4C1D95', marginBottom: spacing.sm },

  propostaActions: { flexDirection: 'row', gap: spacing.sm },
  aceitarBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  aceitarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  recusarBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  recusarText: { color: '#991B1B', fontWeight: '700', fontSize: 14 },
});
