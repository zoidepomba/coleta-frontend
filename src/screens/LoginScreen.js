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

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (e) {
      const detail = e.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail[0]?.msg ?? 'Erro ao fazer login'
        : detail ?? 'Erro ao fazer login';
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
          <Text style={styles.title}>Entrar</Text>

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
            placeholder="Senha"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button label="Entrar" onPress={handleLogin} loading={loading} />

          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>
              Não tem conta?{' '}
              <Text style={styles.linkBold}>Cadastre-se</Text>
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
