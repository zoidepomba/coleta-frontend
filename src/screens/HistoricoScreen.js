import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../theme';
import { Header, EmptyState, BottomNav } from '../components';

export default function HistoricoScreen({ navigation }) {
  const handleNavigate = (key) => {
    if (key === 'home') navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Histórico de coletas" onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        <EmptyState
          icon="📋"
          title="Nenhuma coleta ainda"
          subtitle="Suas coletas realizadas aparecerão aqui. Agende a sua primeira agora!"
        />
      </View>

      <BottomNav active="history" onNavigate={handleNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1 },
});
