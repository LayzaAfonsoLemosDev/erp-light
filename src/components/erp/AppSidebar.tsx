import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '../Logo';
import {
  LayoutDashboard, Users, Package, ShoppingCart,
  LogOut, Settings, Database, Shield, UserCog
} from 'lucide-react';

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Clientes', icon: Users, path: '/clientes' },
    { label: 'Produtos', icon: Package, path: '/produtos' },
    { label: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
  ];

  const configItems = [
    { label: 'Usuários', icon: UserCog, path: '/configuracoes/usuarios' },
    { label: 'Perfis', icon: Shield, path: '/configuracoes/perfis' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isConfigActive = location.pathname.startsWith('/configuracoes');

  return (
    <aside className="w-64 min-h-screen gradient-sidebar flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Logo size="sm" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}

        {/* Configurações — apenas Admin */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-1">
              <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 px-3 font-semibold">
                Configurações
              </p>
            </div>
            {configItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </>
        )}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
            {user?.nome?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.nome}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{user?.perfilNome || user?.cargo}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-destructive/20 hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair do sistema
        </button>
      </div>
    </aside>
  );
}
