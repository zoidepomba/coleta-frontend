import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, radius } from '../theme';
import { Button, Card, SectionLabel, BottomNav, FadeCard } from '../components';
import { WASTE_TYPES } from '../data/mock';

export default function HomeScreen({ navigation }) {
  const handleNavigate = (key) => {
    if (key === 'history') navigation.navigate('Historico');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Hero Header */}
      <View style={styles.hero}>
        <Text style={styles.greeting}>Boa tarde, Carlos 👋</Text>
        <Text style={styles.heroTitle}>Agendar coleta</Text>
        <View style={styles.addressPill}>
          <Text style={styles.addressText}>📍 Rua das Flores, 142 — Uberlândia</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <SectionLabel>Tipo de descarte</SectionLabel>

        {WASTE_TYPES.map((type, index) => (
          <FadeCard key={type.id} delay={index * 80}>
            <Card
              onPress={type.available ? () => navigation.navigate('Prestadores', { wasteType: type }) : undefined}
              style={[
                styles.wasteCard,
                type.available && styles.wasteCardActive,
                !type.available && styles.wasteCardDisabled,
              ]}
            >
              <View style={styles.row}>
                <Text style={styles.wasteIcon}>{type.icon}</Text>
                <View style={styles.wasteInfo}>
                  <Text style={[styles.wasteTitle, !type.available && { color: colors.textMuted }]}>
                    {type.title}
                  </Text>
                  <Text style={styles.wasteSubtitle}>{type.subtitle}</Text>
                </View>
                {type.available && <Text style={styles.chevron}>›</Text>}
              </View>
            </Card>
          </FadeCard>
        ))}

        <FadeCard delay={WASTE_TYPES.length * 80}>
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              💡 Nossos prestadores são verificados e avaliados pela comunidade.
            </Text>
          </View>
        </FadeCard>
      </ScrollView>

      <BottomNav active="home" onNavigate={handleNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 4 },
  heroTitle: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: spacing.md },
  addressPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  addressText: { fontSize: 13, color: '#fff' },

  scroll: { flex: 1, marginTop: -spacing.md },
  content: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  wasteCard: { borderWidth: 1, borderColor: colors.border },
  wasteCardActive: { borderColor: colors.primary, borderWidth: 1.5 },
  wasteCardDisabled: { opacity: 0.5 },

  wasteIcon: { fontSize: 26 },
  wasteInfo: { flex: 1 },
  wasteTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  wasteSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  chevron: { fontSize: 22, color: colors.primary, fontWeight: '300' },

  tip: {
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  tipText: { fontSize: 13, color: '#1E40AF', lineHeight: 20 },
});
