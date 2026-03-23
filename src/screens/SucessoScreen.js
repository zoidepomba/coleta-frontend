import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { colors, spacing, radius } from '../theme';
import { Button, Divider } from '../components';

const STEPS = ['Pedido confirmado', 'Prestador a caminho', 'Coleta realizada'];

export default function SucessoScreen({ navigation, route }) {
  const { provider, total } = route?.params ?? {};
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 14 }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const details = [
    { label: 'Prestador', value: provider?.name ?? 'João Mendes' },
    { label: 'Chegada estimada', value: provider?.eta ?? '~20 min' },
    { label: 'Endereço', value: 'Rua das Flores, 142' },
    { label: 'Valor pago', value: `R$ ${(total ?? 17).toFixed(2)}`, highlight: true },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>

        {/* Animated check */}
        <Animated.View style={[styles.checkCircle, { transform: [{ scale }] }]}>
          <Text style={styles.checkIcon}>✓</Text>
        </Animated.View>

        <Text style={styles.title}>Coleta agendada!</Text>
        <Text style={styles.subtitle}>
          {provider?.name ?? 'João Mendes'} está a caminho e chega em{' '}
          <Text style={styles.highlightText}>{provider?.eta ?? '~20 min'}</Text>.
        </Text>

        {/* Status tracker — layout corrigido com linhas flexíveis */}
        <Animated.View style={[styles.tracker, { opacity }]}>
          {STEPS.map((step, i) => (
            <View key={step} style={styles.trackerStep}>
              {/* Dot + linha antes (exceto primeiro) */}
              <View style={styles.trackerDotRow}>
                {i > 0 && (
                  <View style={[styles.trackerLine, i === 1 && styles.trackerLineDone]} />
                )}
                <View
                  style={[
                    styles.trackerDot,
                    i === 0 && styles.trackerDotDone,
                    i === 1 && styles.trackerDotActive,
                  ]}
                />
                {i < STEPS.length - 1 && (
                  <View style={[styles.trackerLine, i === 0 && styles.trackerLineDone]} />
                )}
              </View>
              <Text style={[styles.trackerLabel, i === 0 && styles.trackerLabelDone]}>
                {step}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Details card */}
        <Animated.View style={[styles.detailCard, { opacity }]}>
          {details.map((item, i) => (
            <View key={item.label}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={[styles.detailValue, item.highlight && styles.detailValueHighlight]}>
                  {item.value}
                </Text>
              </View>
              {i < details.length - 1 && <Divider />}
            </View>
          ))}
        </Animated.View>

        <Button
          label="Voltar ao início"
          onPress={() => navigation.navigate('Home')}
          style={{ marginTop: spacing.lg }}
        />
        <Button
          label="Ver histórico de coletas"
          variant="secondary"
          onPress={() => navigation.navigate('Historico')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.md, alignItems: 'center', paddingTop: spacing.xxl },

  checkCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  checkIcon: { fontSize: 36, color: colors.primary },

  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  subtitle: {
    fontSize: 15, color: colors.textSecondary, textAlign: 'center',
    marginTop: spacing.sm, marginBottom: spacing.lg, lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  highlightText: { color: colors.primary, fontWeight: '600' },

  // Tracker corrigido: flex horizontal dentro de cada step
  tracker: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    width: '100%',
    justifyContent: 'center',
  },
  trackerStep: { alignItems: 'center', flex: 1 },
  trackerDotRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' },
  trackerDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: colors.border,
  },
  trackerDotDone: { backgroundColor: colors.primary },
  trackerDotActive: { backgroundColor: colors.primary, width: 16, height: 16, borderRadius: 8 },
  trackerLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
  },
  trackerLineDone: { backgroundColor: colors.primary },
  trackerLabel: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 4, paddingHorizontal: 2 },
  trackerLabelDone: { color: colors.primary, fontWeight: '600' },

  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.md,
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailLabel: { fontSize: 13, color: colors.textSecondary },
  detailValue: { fontSize: 13, fontWeight: '500', color: colors.textPrimary },
  detailValueHighlight: { color: colors.primary, fontWeight: '700', fontSize: 15 },
});
