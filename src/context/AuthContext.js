import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const { data } = await authService.me();
        setUser(data);
      }
    } catch {
      await SecureStore.deleteItemAsync('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await authService.login(email, password);
    await SecureStore.setItemAsync('token', data.access_token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await authService.register(name, email, password);
    await SecureStore.setItemAsync('token', data.access_token);
    setUser(data.user);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
