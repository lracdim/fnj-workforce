import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { storage } from '../utils/storage';

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const saved = storage.get<AdminUser>('fnj_admin_auth');
    if (saved) setUser(saved);
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === 'admin@fjworkforce.com' && password === 'FnJ2025!') {
      const u = { name: 'Admin', email, role: 'owner' };
      storage.set('fnj_admin_auth', u);
      setUser(u);
      return true;
    }
    return false;
  };

  const logout = () => {
    storage.remove('fnj_admin_auth');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
};