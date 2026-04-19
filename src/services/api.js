import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Android emulator acessa o host via 10.0.2.2
// Dispositivo físico: use o IP local da sua máquina (ex: 192.168.68.59)
const API_URL = 'http://10.0.2.2:8000';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  me: () =>
    api.get('/auth/me'),
};

export const coletaService = {
  create: (data) => api.post('/coletas/', data),
  minhas: () => api.get('/coletas/me'),
  disponiveis: () => api.get('/coletas/disponiveis'),
  aceitar: (id, valorAceito) => api.post(`/coletas/${id}/aceitar`, { valor_aceito: valorAceito }),
  responder: (id, aceitar) => api.post(`/coletas/${id}/responder`, { aceitar }),
  aceitas: () => api.get('/coletas/aceitas'),
  concluir: (id) => api.post(`/coletas/${id}/concluir`),
};

export default api;
