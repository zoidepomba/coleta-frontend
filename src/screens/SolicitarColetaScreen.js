import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { colors, spacing, radius, shadows } from '../theme';
import { Button, Header } from '../components';
import { coletaService } from '../services/api';

export default function SolicitarColetaScreen({ navigation, route }) {
  const { wasteType } = route.params;

  const [address, setAddress] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!address.trim()) {
      setError('Informe o endereço de coleta');
      return;
    }
    const numValue = parseFloat(value.replace(',', '.'));
    if (!value || isNaN(numValue) || numValue <= 0) {
      setError('Informe um valor válido');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await coletaService.create({
        address: address.trim(),
        waste_type: wasteType.id,
        waste_label: wasteType.title,
        waste_icon: wasteType.icon,
        value: numValue,
      });
      navigation.navigate('Historico', { novaSolicitacao: true });
    } catch (e) {
      const detail = e.response?.data?.detail;
      setError(Array.isArray(detail) ? detail[0]?.msg : detail ?? 'Erro ao criar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Nova solicitação" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.wasteCard}>
            <Text style={styles.wasteIcon}>{wasteType.icon}</Text>
            <View>
              <Text style={styles.wasteLabel}>Tipo de resíduo</Text>
              <Text style={styles.wasteTitle}>{wasteType.title}</Text>
            </View>
          </View>

          <Text style={styles.fieldLabel}>Endereço de coleta</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Rua das Flores, 142 — Uberlândia"
            placeholderTextColor={colors.textMuted}
            value={address}
            onChangeText={setAddress}
            autoCapitalize="words"
          />

          <Text style={styles.fieldLabel}>Valor oferecido (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 25,00"
            placeholderTextColor={colors.textMuted}
            value={value}
            onChangeText={setValue}
            keyboardType="decimal-pad"
          />
          <Text style={styles.fieldHint}>
            Defina quanto você está disposto a pagar pela coleta.
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            label="Confirmar solicitação"
            onPress={handleSubmit}
            loading={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },

  wasteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  wasteIcon: { fontSize: 32 },
  wasteLabel: { fontSize: 12, color: colors.primary, fontWeight: '600', marginBottom: 2 },
  wasteTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },

  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  fieldHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },

  error: {
    fontSize: 13,
    color: '#DC2626',
    textAlign: 'center',
  },
});
