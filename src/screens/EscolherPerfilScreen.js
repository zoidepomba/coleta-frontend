import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, radius, shadows } from '../theme';
import { useAuth } from '../context/AuthContext';

function PerfilCard({ icon, titulo, descricao, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardTitulo}>{titulo}</Text>
      <Text style={styles.cardDescricao}>{descricao}</Text>
      <View style={styles.cardBotao}>
        <Text style={styles.cardBotaoTexto}>Continuar →</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function EscolherPerfilScreen({ navigation }) {
  const { user } = useAuth();

  const firstName = user?.name?.split(' ')[0] ?? 'você';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.appName}>ColetaApp</Text>
        <Text style={styles.greeting}>Olá, {firstName}! O que deseja fazer hoje?</Text>
      </View>

      <View style={styles.content}>
        <PerfilCard
          icon="🏠"
          titulo="Preciso de uma coleta"
          descricao="Solicite a retirada do lixo da sua casa e acompanhe em tempo real."
          onPress={() => navigation.navigate('Home')}
        />

        <PerfilCard
          icon="🚛"
          titulo="Quero oferecer coleta"
          descricao="Atenda solicitações de coleta na sua região e gerencie seus atendimentos."
          onPress={() => navigation.navigate('ColetorHome')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 30,
  },

  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
    justifyContent: 'center',
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardDescricao: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  cardBotao: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  cardBotaoTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
