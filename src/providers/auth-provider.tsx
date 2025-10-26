'use client';

import { http } from '@/lib/http';
import { AuthResponse, CurrentUser } from '@/types/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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
  const [initialized, setInitialized] = useState(false);

  const isAuthenticated = !!user;

  // Carregar usuário na montagem (apenas uma vez)
  useEffect(() => {
    if (!initialized) {
      loadUser();
      setInitialized(true);
    }
  }, [initialized]);

  // Manter sessão ativa - verificar periodicamente
  useEffect(() => {
    if (user && !loading) {
      const interval = setInterval(() => {
        // Verificar sessão a cada 5 minutos
        loadUser();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user, loading]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await http<{ user: CurrentUser }>('/api/auth/me', {
        showToast: false // Não mostrar toast para verificação de sessão
      });
      setUser(response.user);
    } catch (error) {
      // Se não autenticado, limpar estado silenciosamente
      // Mas só se realmente for erro de autenticação
      if (error && typeof error === 'object' && 'status' in error) {
        const httpError = error as { status: number };
        if (httpError.status === 401) {
          setUser(null);
        }
        // Para outros erros (500, 404, etc), manter usuário logado
      } else {
        // Para erros de rede ou outros, manter usuário logado
        console.warn('Erro ao verificar sessão, mantendo usuário logado:', error);
      }
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
      
      // Criar objeto user a partir da resposta do backend
      const user: CurrentUser = {
        id: response.id,
        name: email.split('@')[0] ?? 'Usuário',
        email,
        role: response.role,
        marketId: response.marketId,
        market: response.market
      };
      
      setUser(user);
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
    } catch {
      // Ignorar erros de logout
    } finally {
      setUser(null);
    }
  };

  const refresh = async () => {
    try {
      await http<{ accessToken: string }>('/api/auth/refresh', {
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
