import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, radius } from '../theme';
import { Header, Card, Avatar, Stars, Badge, SectionLabel, BottomNav, FadeCard } from '../components';
import { PROVIDERS } from '../data/mock';

export default function PrestadoresScreen({ navigation, route }) {
  const [selected, setSelected] = useState(null);
  const wasteType = route?.params?.wasteType;

  const handleSelect = (provider) => {
    setSelected(provider.id);
    setTimeout(() => {
      navigation.navigate('Confirmacao', { provider, wasteType });
    }, 150);
  };

  const handleNavigate = (key) => {
    if (key === 'home') navigation.navigate('Home');
    if (key === 'history') navigation.navigate('Historico');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Prestadores próximos" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.infoRow}>
          <View style={styles.dot} />
          <Text style={styles.infoText}>
            {PROVIDERS.length} disponíveis agora para {wasteType?.title ?? 'lixo doméstico'}
          </Text>
        </View>

        <SectionLabel>Ordenado por distância</SectionLabel>

        {PROVIDERS.map((provider, index) => (
          <FadeCard key={provider.id} delay={index * 100}>
            <Card
              onPress={() => handleSelect(provider)}
              style={selected === provider.id ? styles.cardSelected : {}}
            >
              <View style={styles.row}>
                <Avatar
                  initials={provider.initials}
                  color={provider.avatarBg}
                  textColor={provider.avatarColor}
                />
                <View style={styles.providerInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.providerName}>{provider.name}</Text>
                    {provider.topRated && (
                      <View style={styles.topRatedBadge}>
                        <Text style={styles.topRatedText}>⭐ Mais avaliado</Text>
                      </View>
                    )}
                  </View>
                  <Stars rating={provider.rating} />
                  <Text style={styles.providerMeta}>
                    {provider.reviews} coletas · {provider.distance}
                  </Text>
                </View>
                <Text style={styles.price}>R${provider.price}</Text>
              </View>
              <Badge
                label={`Chega em ${provider.eta}`}
                color={provider.badgeBg}
                textColor={provider.badgeColor}
              />
            </Card>
          </FadeCard>
        ))}
      </ScrollView>

      <BottomNav active="home" onNavigate={handleNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.primary,
  },
  infoText: { fontSize: 14, color: colors.textSecondary },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },

  providerInfo: { flex: 1 },
  providerName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  providerMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  topRatedBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  topRatedText: { fontSize: 10, fontWeight: '600', color: '#92400E' },

  price: { fontSize: 18, fontWeight: '700', color: colors.primary },

  cardSelected: { borderColor: colors.primary, borderWidth: 2 },
});
