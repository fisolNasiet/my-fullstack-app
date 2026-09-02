import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { TokenStorage } from './TokenStorage';
import { authEvents } from './authEvents';
import * as authApi from '../api/authApi';
import '../api/authInterceptors';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => TokenStorage.hasSession());

  useEffect(() => {
    return authEvents.onLogout(() => setIsAuthenticated(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authApi.login(email, password);
    TokenStorage.save(tokens.accessToken, tokens.refreshToken);
    setIsAuthenticated(true);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    await authApi.register(email, password);
  }, []);

  const logout = useCallback(() => {
    TokenStorage.clear();
    setIsAuthenticated(false);
  }, []);

  const deleteAccount = useCallback(async () => {
    await authApi.deleteAccount();
    TokenStorage.clear();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}
