import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { perfis } from '@/data/mockData';
import { ModuloSistema, AcaoPermissao } from '@/types/erp';

interface User {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  perfilId: number;
  perfilNome: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => boolean;
  logout: () => void;
  temPermissao: (modulo: ModuloSistema, acao: AcaoPermissao) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('erp_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, senha: string): boolean => {
    if (email === 'admin@erp.com' && senha === 'admin123') {
      const userData: User = { id: 1, nome: 'Administrador', email, cargo: 'Gerente de TI', perfilId: 1, perfilNome: 'Administrador' };
      setUser(userData);
      localStorage.setItem('erp_user', JSON.stringify(userData));
      return true;
    }
    if (email === 'usuario@erp.com' && senha === 'user123') {
      const userData: User = { id: 2, nome: 'Operador', email, cargo: 'Analista Comercial', perfilId: 2, perfilNome: 'Vendedor' };
      setUser(userData);
      localStorage.setItem('erp_user', JSON.stringify(userData));
      return true;
    }
    if (email === 'carlos@erp.com' && senha === 'est123') {
      const userData: User = { id: 3, nome: 'Carlos Oliveira', email, cargo: 'Analista de Estoque', perfilId: 3, perfilNome: 'Estoque' };
      setUser(userData);
      localStorage.setItem('erp_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('erp_user');
  };

  const temPermissao = useCallback((modulo: ModuloSistema, acao: AcaoPermissao): boolean => {
    if (!user) return false;
    const perfil = perfis.find(p => p.id === user.perfilId);
    if (!perfil) return false;
    const perm = perfil.permissoes.find(p => p.modulo === modulo);
    return perm ? perm.acoes.includes(acao) : false;
  }, [user]);

  const isAdmin = user?.perfilId === 1;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, temPermissao, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
