import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, useAuth } from './context/AuthContext';
import { colors } from './theme';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import PrestadoresScreen from './screens/PrestadoresScreen';
import ConfirmacaoScreen from './screens/ConfirmacaoScreen';
import SucessoScreen from './screens/SucessoScreen';
import HistoricoScreen from './screens/HistoricoScreen';
import ContaScreen from './screens/ContaScreen';
import EscolherPerfilScreen from './screens/EscolherPerfilScreen';
import ColetorHomeScreen from './screens/ColetorHomeScreen';
import SolicitarColetaScreen from './screens/SolicitarColetaScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EscolherPerfil" component={EscolherPerfilScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ColetorHome" component={ColetorHomeScreen} />
      <Stack.Screen name="SolicitarColeta" component={SolicitarColetaScreen} />
      <Stack.Screen name="Prestadores" component={PrestadoresScreen} />
      <Stack.Screen name="Confirmacao" component={ConfirmacaoScreen} />
      <Stack.Screen name="Sucesso" component={SucessoScreen} />
      <Stack.Screen name="Historico" component={HistoricoScreen} />
      <Stack.Screen name="Conta" component={ContaScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
}

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

registerRootComponent(App);
