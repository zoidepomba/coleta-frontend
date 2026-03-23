import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, radius } from '../theme';
import { Header, Card, Avatar, Stars, Divider, Button, SectionLabel } from '../components';
import { PAYMENT_METHODS, APP_FEE } from '../data/mock';

export default function ConfirmacaoScreen({ navigation, route }) {
  const { provider, wasteType } = route?.params ?? {};
  const [payment, setPayment] = useState('pix');
  const [loading, setLoading] = useState(false);

  const servicePrice = provider?.price ?? 15;
  const total = servicePrice + APP_FEE;

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Sucesso', { provider, total });
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Confirmar coleta" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

          {/* Provider summary */}
          <SectionLabel>Prestador selecionado</SectionLabel>
          <Card style={styles.providerCard}>
            <View style={styles.row}>
              <Avatar
                initials={provider?.initials ?? 'JM'}
                color={provider?.avatarBg ?? '#E1F5EE'}
                textColor={provider?.avatarColor ?? '#0F6E56'}
                size={48}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.providerName}>{provider?.name ?? 'João Mendes'}</Text>
                <Stars rating={provider?.rating ?? 5} />
                <Text style={styles.providerMeta}>Chega em {provider?.eta ?? '~20 min'}</Text>
              </View>
            </View>
          </Card>

          {/* Service details */}
          <SectionLabel>Detalhes do serviço</SectionLabel>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {wasteType?.icon} {wasteType?.title ?? 'Lixo doméstico'}
              </Text>
              <Text style={styles.summaryValue}>R$ {servicePrice.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelMuted}>Taxa do app</Text>
              <Text style={styles.summaryValueMuted}>R$ {APP_FEE.toFixed(2)}</Text>
            </View>
            <Divider />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
            </View>
          </Card>

          {/* Payment method */}
          <SectionLabel>Forma de pagamento</SectionLabel>
          {PAYMENT_METHODS.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[styles.paymentOption, payment === method.id && styles.paymentSelected]}
              onPress={() => setPayment(method.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.paymentIcon}>{method.icon}</Text>
              <Text style={[styles.paymentLabel, payment === method.id && styles.paymentLabelActive]}>
                {method.label}
              </Text>
              <View style={[styles.radio, payment === method.id && styles.radioSelected]}>
                {payment === method.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}

          <Button
            label={`Confirmar e pagar R$ ${total.toFixed(2)}`}
            onPress={handleConfirm}
            loading={loading}
            style={{ marginTop: spacing.lg }}
          />
          <Button
            label="Cancelar"
            variant="secondary"
            onPress={() => navigation.goBack()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  providerCard: {},
  providerName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  providerMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },

  summaryCard: { gap: 6 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 14, color: colors.textPrimary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  summaryLabelMuted: { fontSize: 14, color: colors.textSecondary },
  summaryValueMuted: { fontSize: 14, color: colors.textSecondary },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '700', color: colors.primary },

  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: 12,
  },
  paymentSelected: { borderColor: colors.primary, borderWidth: 1.5 },
  paymentIcon: { fontSize: 20 },
  paymentLabel: { flex: 1, fontSize: 15, color: colors.textPrimary },
  paymentLabelActive: { fontWeight: '600', color: colors.primary },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
