import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { User } from '../types';
import {
  getProfileForUser,
  signIn as apiSignIn,
  signOut as apiSignOut,
  AuthCredentials,
} from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import apiClient from '../services/apiClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkLoggedIn = useCallback(async () => {
    setLoading(true);
    try {
      const profile = await getProfileForUser();
      setUser(profile);
    } catch (error) {
      setUser(null);
      console.info('[AuthContext] User not logged in.', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  const login = async (credentials: AuthCredentials) => {
    try {
      const userProfile = await apiSignIn(credentials);
      setUser(userProfile);
    } catch (error) {
      console.error('[AuthContext] Login failed:', error);
      setUser(null);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      await apiSignOut();
    } catch (error) {
      console.warn(
        '[AuthContext] Server logout failed, clearing user data locally.',
        error
      );
    } finally {
      setUser(null);
      // Hapus cookie 'XSRF-TOKEN' secara manual jika ada
      // Ini mungkin tidak diperlukan tergantung pada konfigurasi server
      document.cookie =
        'XSRF-TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await checkLoggedIn();
  }, [checkLoggedIn]);

  // Set up interceptor to handle session expiry globally
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 419) &&
          user // Hanya logout jika ada user yang login
        ) {
          await logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, [user, logout]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark bg-opacity-80">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
