import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Database, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@erp.com');
  const [senha, setSenha] = useState('admin123');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    
    // Simula latência de API
    await new Promise(r => setTimeout(r, 800));
    
    if (login(email, senha)) {
      navigate('/');
    } else {
      setErro('Credenciais inválidas. Tente admin@erp.com / admin123');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-sidebar items-center justify-center p-12">
        <div className="max-w-md animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Database className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sidebar-foreground">ERP Light</h1>
              <p className="text-sm text-sidebar-foreground/60">Sistema de Gestão Comercial</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-sidebar-foreground mb-4 leading-tight">
            Gerencie seu negócio com eficiência
          </h2>
          <p className="text-sidebar-foreground/60 leading-relaxed">
            Sistema completo de gestão comercial com controle de clientes, produtos, 
            pedidos e dashboard em tempo real. Arquitetura moderna com Clean Architecture.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { label: 'Clientes', value: '6+' },
              { label: 'Produtos', value: '8+' },
              { label: 'Vendas/mês', value: 'R$ 27k' },
              { label: 'Uptime', value: '99.9%' },
            ].map(stat => (
              <div key={stat.label} className="bg-sidebar-accent rounded-lg p-3">
                <p className="text-xl font-bold text-sidebar-primary">{stat.value}</p>
                <p className="text-xs text-sidebar-foreground/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Database className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ERP Light</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">Entrar no sistema</h2>
          <p className="text-sm text-muted-foreground mb-6">Informe suas credenciais para acessar</p>

          {erro && (
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive rounded-lg px-3 py-2.5 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Senha</label>
              <input
                type="password" value={senha} onChange={e => setSenha(e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
                required
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full gradient-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? 'Autenticando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 bg-muted rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Credenciais de teste:</p>
            <p className="text-xs text-muted-foreground font-mono">admin@erp.com / admin123 (Admin)</p>
            <p className="text-xs text-muted-foreground font-mono">usuario@erp.com / user123 (Vendedor)</p>
            <p className="text-xs text-muted-foreground font-mono">carlos@erp.com / est123 (Estoque)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
