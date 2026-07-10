import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { AuthResponse } from '../types';
import { apiClient, setAccessToken as setApiToken } from '../api/client';

interface AuthContextType {
  user: { id: string; email: string; role: string } | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setTokens = useCallback(
    (token: string | null, userData: AuthContextType['user']) => {
      setAccessTokenState(token);
      setApiToken(token);
      setUser(userData);
    },
    []
  );

  useEffect(() => {
    apiClient
      .post('/api/auth/refresh')
      .then((res) => {
        const token = res.data.data.accessToken;
        setApiToken(token);
        setAccessTokenState(token);
        return apiClient.get('/api/auth/me');
      })
      .then((res) => {
        setUser(res.data.data);
      })
      .catch(() => {
        setApiToken(null);
        setAccessTokenState(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiClient.post('/api/auth/login', { email, password });
      const data = res.data.data as AuthResponse;
      setTokens(data.accessToken, data.user);
    },
    [setTokens]
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch {
      // clear state regardless
    }
    setTokens(null, null);
  }, [setTokens]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
