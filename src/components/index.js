import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { colors, radius, spacing, typography, shadows } from '../theme';

// ── Button ──────────────────────────────────────────────
export function Button({ label, onPress, variant = 'primary', loading = false, style }) {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[styles.btn, isPrimary ? styles.btnPrimary : styles.btnSecondary, style]}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : colors.primary} />
      ) : (
        <Text style={[styles.btnText, isPrimary ? styles.btnTextPrimary : styles.btnTextSecondary]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ── Card ────────────────────────────────────────────────
export function Card({ children, onPress, style }) {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.card, style]}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

// ── FadeCard ─────────────────────────────────────────────
// Wrapper com animação de fade-in + slide-up para listas de cards
export function FadeCard({ children, delay = 0, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

// ── Avatar ──────────────────────────────────────────────
export function Avatar({ initials, color = colors.primaryLight, textColor = colors.primary, size = 44 }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[styles.avatarText, { color: textColor, fontSize: size * 0.32 }]}>{initials}</Text>
    </View>
  );
}

// ── Badge ──────────────────────────────────────────────
export function Badge({ label, color = colors.primaryLight, textColor = colors.primaryDark }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

// ── Stars ──────────────────────────────────────────────
export function Stars({ rating }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <Text key={i} style={{ color: i <= rating ? '#F59E0B' : colors.border, fontSize: 13 }}>★</Text>
      ))}
    </View>
  );
}

// ── SectionLabel ────────────────────────────────────────
export function SectionLabel({ children }) {
  return <Text style={[typography.label, { marginBottom: spacing.sm, marginTop: spacing.md }]}>{children}</Text>;
}

// ── Divider ─────────────────────────────────────────────
export function Divider({ style }) {
  return <View style={[styles.divider, style]} />;
}

// ── EmptyState ──────────────────────────────────────────
export function EmptyState({ icon = '📭', title, subtitle }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

// ── Header ──────────────────────────────────────────────
export function Header({ title, onBack, rightIcon, onRightPress }) {
  return (
    <View style={styles.header}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.rightBtn}>
          <Text style={styles.rightIcon}>{rightIcon}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.rightPlaceholder} />
      )}
    </View>
  );
}

// ── BottomNav ────────────────────────────────────────────
export function BottomNav({ active, onNavigate }) {
  const items = [
    { key: 'home', label: 'Início', icon: '🏠' },
    { key: 'history', label: 'Histórico', icon: '📋' },
    { key: 'account', label: 'Conta', icon: '👤' },
  ];
  return (
    <View style={styles.nav}>
      {items.map(item => {
        const isActive = active === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.navItemWrapper}
            onPress={() => onNavigate && onNavigate(item.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {item.label}
            </Text>
            {isActive && <View style={styles.navDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  btnPrimary: { backgroundColor: colors.primary, ...shadows.sm },
  btnSecondary: { backgroundColor: '#F3F4F6', borderWidth: 0.5, borderColor: colors.border },
  btnText: { fontSize: 15, fontWeight: '600' },
  btnTextPrimary: { color: '#fff' },
  btnTextSecondary: { color: colors.textPrimary },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },

  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '600' },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    marginTop: 6,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },

  starsRow: { flexDirection: 'row', gap: 2, marginTop: 2 },

  divider: { height: 0.5, backgroundColor: colors.border, marginVertical: spacing.sm },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  emptyIcon: { fontSize: 52, marginBottom: spacing.md },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  emptySubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 21 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  backBtn: { minWidth: 70 },
  backText: { fontSize: 14, color: colors.primary },
  rightBtn: { minWidth: 70, alignItems: 'flex-end' },
  rightIcon: { fontSize: 20 },
  rightPlaceholder: { minWidth: 70 },

  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingBottom: 6,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  navItemWrapper: { alignItems: 'center', flex: 1, paddingVertical: 4 },
  navIcon: { fontSize: 20, marginBottom: 2 },
  navLabel: { fontSize: 11, color: colors.textMuted },
  navLabelActive: { color: colors.primary, fontWeight: '600' },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 3,
  },
});
