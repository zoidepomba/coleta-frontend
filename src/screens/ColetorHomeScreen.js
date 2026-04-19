import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, radius, shadows } from '../theme';
import { EmptyState } from '../components';
import { coletaService } from '../services/api';

const STATUS_LABEL = {
  negotiating: 'Em negociação',
  accepted: 'Aceita',
  completed: 'Concluída',
};

const STATUS_COLOR = {
  negotiating: { bg: '#EDE9FE', text: '#5B21B6' },
  accepted: { bg: '#DBEAFE', text: '#1E40AF' },
  completed: { bg: '#D1FAE5', text: '#065F46' },
};

// ── Modal de proposta de valor ────────────────────────────────────────────────
function ModalProposta({ visible, coleta, onClose, onConfirm, loading }) {
  const [valor, setValor] = useState('');

  const handleConfirm = () => {
    const num = parseFloat(valor.replace(',', '.'));
    if (!valor || isNaN(num) || num <= 0) return;
    onConfirm(num);
    setValor('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Propor valor</Text>
          {coleta && (
            <Text style={styles.modalSub}>
              Valor oferecido:{' '}
              <Text style={{ fontWeight: '700', color: colors.primary }}>
                R$ {coleta.value.toFixed(2).replace('.', ',')}
              </Text>
            </Text>
          )}
          <TextInput
            style={styles.modalInput}
            placeholder="Seu valor (ex: 30,00)"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            value={valor}
            onChangeText={setValor}
            autoFocus
          />
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={[styles.confirmBtn, loading && { opacity: 0.6 }]}
                onPress={handleConfirm}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.confirmText}>Enviar proposta</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Card de coleta disponível ─────────────────────────────────────────────────
function DisponiveisCard({ item, onAceitar, onPropor, loadingId }) {
  const isLoading = loadingId === item.id;
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{item.waste_icon}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.waste_label}</Text>
          <Text style={styles.cardAddress} numberOfLines={2}>{item.address}</Text>
        </View>
      </View>
      <View style={styles.cardDivider} />
      <View style={styles.valueRow}>
        <Text style={styles.valueLabel}>Valor oferecido</Text>
        <Text style={styles.valueText}>R$ {item.value.toFixed(2).replace('.', ',')}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.acceptBtn, isLoading && { opacity: 0.6 }]}
          onPress={() => onAceitar(item)}
          disabled={isLoading}
        >
          {isLoading
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.acceptText}>✓ Aceitar preço</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.proposeBtn, isLoading && { opacity: 0.6 }]}
          onPress={() => onPropor(item)}
          disabled={isLoading}
        >
          <Text style={styles.proposeText}>$ Propor valor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Card de coleta aceita ─────────────────────────────────────────────────────
function AceitasCard({ item, onConcluir, loadingId }) {
  const isLoading = loadingId === item.id;
  const statusColor = STATUS_COLOR[item.status] ?? STATUS_COLOR.accepted;
  const valorFinal = item.valor_aceito ?? item.value;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{item.waste_icon}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.waste_label}</Text>
          <Text style={styles.cardAddress} numberOfLines={2}>{item.address}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusColor.bg }]}>
          <Text style={[styles.badgeText, { color: statusColor.text }]}>
            {STATUS_LABEL[item.status] ?? item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>👤 Solicitante</Text>
        <Text style={styles.infoValue}>{item.solicitante_nome ?? '—'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>💰 Valor acordado</Text>
        <Text style={[styles.infoValue, { color: colors.primary, fontWeight: '700' }]}>
          R$ {valorFinal.toFixed(2).replace('.', ',')}
        </Text>
      </View>

      {item.status === 'accepted' && (
        <TouchableOpacity
          style={[styles.concluirBtn, isLoading && { opacity: 0.6 }]}
          onPress={() => onConcluir(item.id)}
          disabled={isLoading}
        >
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.concluirText}>✓ Marcar como concluída</Text>}
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Tela principal ────────────────────────────────────────────────────────────
export default function ColetorHomeScreen({ navigation }) {
  const [aba, setAba] = useState('disponiveis');
  const [disponiveis, setDisponiveis] = useState([]);
  const [aceitas, setAceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [modalColeta, setModalColeta] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchTudo = useCallback(async () => {
    setErro('');
    setLoading(true);
    try {
      const [resDisp, resAc] = await Promise.all([
        coletaService.disponiveis(),
        coletaService.aceitas(),
      ]);
      setDisponiveis(resDisp.data);
      setAceitas(resAc.data);
    } catch (e) {
      setErro(e.response?.data?.detail ?? 'Erro ao carregar coletas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTudo(); }, [fetchTudo]);

  const handleAceitar = async (coleta) => {
    setLoadingId(coleta.id);
    try {
      await coletaService.aceitar(coleta.id, coleta.value);
      await fetchTudo();
    } catch {
    } finally {
      setLoadingId(null);
    }
  };

  const handleConfirmarProposta = async (valor) => {
    setModalLoading(true);
    try {
      await coletaService.aceitar(modalColeta.id, valor);
      setModalColeta(null);
      await fetchTudo();
    } catch {
    } finally {
      setModalLoading(false);
    }
  };

  const handleConcluir = async (id) => {
    setLoadingId(id);
    try {
      const { data } = await coletaService.concluir(id);
      setAceitas((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    } catch {
    } finally {
      setLoadingId(null);
    }
  };

  const dados = aba === 'disponiveis' ? disponiveis : aceitas;
  const vazio = aba === 'disponiveis'
    ? { icon: '🚛', title: 'Nenhuma coleta disponível', sub: 'Quando moradores criarem solicitações elas aparecerão aqui.' }
    : { icon: '📋', title: 'Nenhuma coleta aceita', sub: 'As coletas que você aceitar aparecerão aqui.' };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Área do Coletor</Text>
      </View>

      {/* Abas */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, aba === 'disponiveis' && styles.tabActive]}
          onPress={() => setAba('disponiveis')}
        >
          <Text style={[styles.tabText, aba === 'disponiveis' && styles.tabTextActive]}>
            Disponíveis {disponiveis.length > 0 ? `(${disponiveis.length})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, aba === 'aceitas' && styles.tabActive]}
          onPress={() => setAba('aceitas')}
        >
          <Text style={[styles.tabText, aba === 'aceitas' && styles.tabTextActive]}>
            Minhas coletas {aceitas.length > 0 ? `(${aceitas.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : erro ? (
        <View style={styles.center}>
          <EmptyState icon="⚠️" title="Erro ao carregar" subtitle={erro} />
          <TouchableOpacity onPress={fetchTudo} style={styles.retryBtn}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : dados.length === 0 ? (
        <View style={styles.center}>
          <EmptyState icon={vazio.icon} title={vazio.title} subtitle={vazio.sub} />
        </View>
      ) : (
        <FlatList
          data={dados}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) =>
            aba === 'disponiveis' ? (
              <DisponiveisCard
                item={item}
                onAceitar={handleAceitar}
                onPropor={setModalColeta}
                loadingId={loadingId}
              />
            ) : (
              <AceitasCard
                item={item}
                onConcluir={handleConcluir}
                loadingId={loadingId}
              />
            )
          }
          contentContainerStyle={styles.list}
          onRefresh={fetchTudo}
          refreshing={loading}
        />
      )}

      <ModalProposta
        visible={!!modalColeta}
        coleta={modalColeta}
        onClose={() => setModalColeta(null)}
        onConfirm={handleConfirmarProposta}
        loading={modalLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  back: { marginBottom: spacing.sm },
  backText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },

  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.primary },

  list: { padding: spacing.md, gap: spacing.sm },
  retryBtn: { marginTop: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  retryText: { color: colors.primary, fontWeight: '700', fontSize: 14 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  cardIcon: { fontSize: 32 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardAddress: { fontSize: 13, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
  cardDivider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },

  badge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '700' },

  valueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  valueLabel: { fontSize: 13, color: colors.textSecondary },
  valueText: { fontSize: 18, fontWeight: '700', color: colors.primary },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  infoLabel: { fontSize: 13, color: colors.textSecondary },
  infoValue: { fontSize: 13, color: colors.textPrimary },

  cardActions: { flexDirection: 'row', gap: spacing.sm },
  acceptBtn: {
    flex: 1, backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 12, alignItems: 'center', justifyContent: 'center',
  },
  acceptText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  proposeBtn: {
    flex: 1, backgroundColor: colors.primaryLight, borderRadius: radius.md,
    paddingVertical: 12, alignItems: 'center',
  },
  proposeText: { color: colors.primary, fontWeight: '700', fontSize: 14 },

  concluirBtn: {
    marginTop: spacing.sm, backgroundColor: colors.primary,
    borderRadius: radius.md, paddingVertical: 12, alignItems: 'center',
  },
  concluirText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl, padding: spacing.lg, gap: spacing.sm,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  modalSub: { fontSize: 14, color: colors.textSecondary },
  modalInput: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: 14,
    fontSize: 16, color: colors.textPrimary, backgroundColor: colors.background, marginTop: spacing.xs,
  },
  modalActions: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', marginTop: spacing.xs },
  cancelBtn: { paddingHorizontal: spacing.md, paddingVertical: 12 },
  cancelText: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  confirmBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 12, alignItems: 'center',
  },
  confirmText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
