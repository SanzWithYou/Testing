// 📁 src/services/api.ts
import axios from 'axios';
import { User } from '../types';

export interface AuthCredentials {
  email: string;
  password: string;
}

// Konfigurasi dasar Axios untuk Sanctum
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // PENTING agar cookie dikirim
});

// GET /api/user (butuh sesi aktif dan cookie)
export const getProfileForUser = async (): Promise<User> => {
  const response = await api.get('/api/user');
  return response.data;
};

// POST /login setelah GET csrf-cookie
export const signIn = async (credentials: AuthCredentials): Promise<User> => {
  // WAJIB: ambil CSRF cookie dulu
  await api.get('/sanctum/csrf-cookie');
  // Lanjut login dengan POST ke endpoint Laravel
  const response = await api.post('/login', credentials);
  return response.data;
};

// POST /logout (juga butuh CSRF + session)
export const signOut = async (): Promise<void> => {
  await api.post('/logout');
};
export default api;