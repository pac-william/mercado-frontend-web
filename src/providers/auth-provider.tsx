'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CurrentUser, AuthResponse } from '@/types/auth';
import { http } from '@/lib/http';

interface AuthContextType {
  user: CurrentUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Carregar usuário na montagem
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await http<{ user: CurrentUser }>('/api/auth/me');
      setUser(response.user);
    } catch (error) {
      // Se não autenticado, limpar estado
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await http<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      setUser(response.user);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await http('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      // Ignorar erros de logout
    } finally {
      setUser(null);
    }
  };

  const refresh = async () => {
    try {
      const response = await http<{ accessToken: string }>('/api/auth/refresh', {
        method: 'POST'
      });
      // Token renovado, recarregar usuário
      await loadUser();
    } catch (error) {
      // Se refresh falhar, fazer logout
      setUser(null);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refresh
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
