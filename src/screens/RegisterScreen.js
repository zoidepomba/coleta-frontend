import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, radius } from '../theme';
import { Button } from '../components';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
    } catch (e) {
      const detail = e.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail[0]?.msg ?? 'Erro ao criar conta'
        : detail ?? 'Erro ao criar conta';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.hero}>
        <Text style={styles.appName}>ColetaApp</Text>
        <Text style={styles.heroSubtitle}>Descarte consciente, perto de você</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.formWrapper}
      >
        <View style={styles.form}>
          <Text style={styles.title}>Criar conta</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha (mín. 6 caracteres)"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button label="Criar conta" onPress={handleRegister} loading={loading} />

          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>
              Já tem conta?{' '}
              <Text style={styles.linkBold}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  appName: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6 },

  formWrapper: { flex: 1 },
  form: {
    padding: spacing.md,
    paddingTop: spacing.xl,
    gap: spacing.sm,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: '#fff',
  },

  error: {
    fontSize: 13,
    color: '#DC2626',
    textAlign: 'center',
  },

  link: { alignItems: 'center', marginTop: spacing.sm },
  linkText: { fontSize: 14, color: colors.textSecondary },
  linkBold: { fontWeight: '700', color: colors.primary },
});
