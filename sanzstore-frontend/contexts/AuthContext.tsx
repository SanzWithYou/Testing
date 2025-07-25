import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import {
  getProfileForUser,
  signIn as apiSignIn,
  signOut as apiSignOut,
  AuthCredentials,
} from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      setLoading(true);
      try {
        const profile = await getProfileForUser();
        setUser(profile);
      } catch {
        setUser(null);
        console.info('[AuthContext] Not logged in.');
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (credentials: AuthCredentials) => {
    try {
      const user = await apiSignIn(credentials);
      setUser(user);
    } catch (error) {
      console.error('[AuthContext] Login failed', error);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiSignOut();
    } catch (error) {
      console.warn('[AuthContext] Logout failed on server, clearing client anyway.', error);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    try {
      const profile = await getProfileForUser();
      setUser(profile);
    } catch (error) {
      console.error('[AuthContext] Failed to refresh user', error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark">
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
