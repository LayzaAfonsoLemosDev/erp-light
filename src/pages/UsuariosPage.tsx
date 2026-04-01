import { useState } from 'react';
import { AppLayout } from '@/components/erp/AppLayout';
import { DataTable } from '@/components/erp/DataTable';
import { StatusBadge } from '@/components/erp/StatusBadge';
import { usuarios as initialUsuarios, perfis } from '@/data/mockData';
import { Usuario } from '@/types/erp';
import { UserCog, Plus, Edit2, Power } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function UsuariosPage() {
  const { isAdmin } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState({ nome: '', email: '', perfilId: 1 });

  if (!isAdmin) return <Navigate to="/" replace />;

  const abrirNovo = () => {
    setEditando(null);
    setForm({ nome: '', email: '', perfilId: 1 });
    setDialogOpen(true);
  };

  const abrirEditar = (u: Usuario) => {
    setEditando(u);
    setForm({ nome: u.nome, email: u.email, perfilId: u.perfilId });
    setDialogOpen(true);
  };

  const salvar = () => {
    const perfilNome = perfis.find(p => p.id === form.perfilId)?.nome || '';
    if (editando) {
      setUsuarios(prev => prev.map(u => u.id === editando.id
        ? { ...u, nome: form.nome, email: form.email, perfilId: form.perfilId, perfilNome }
        : u
      ));
    } else {
      const novo: Usuario = {
        id: Math.max(...usuarios.map(u => u.id)) + 1,
        nome: form.nome,
        email: form.email,
        perfilId: form.perfilId,
        perfilNome,
        ativo: true,
        dataCriacao: new Date().toISOString().split('T')[0],
        ultimoAcesso: '-',
      };
      setUsuarios(prev => [...prev, novo]);
    }
    setDialogOpen(false);
  };

  const toggleAtivo = (id: number) => {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ativo: !u.ativo } : u));
  };

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    { key: 'perfilNome', label: 'Perfil', render: (u: Usuario) => (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
        {u.perfilNome}
      </span>
    )},
    { key: 'ativo', label: 'Status', render: (u: Usuario) => (
      <StatusBadge status={u.ativo ? 'ativo' : 'inativo'} />
    )},
    { key: 'ultimoAcesso', label: 'Último Acesso' },
  ];

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <UserCog className="w-6 h-6 text-primary" />
            Gerenciamento de Usuários
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Controle de acesso e gerenciamento de contas</p>
        </div>
        <button onClick={abrirNovo} className="flex items-center gap-2 gradient-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Novo Usuário
        </button>
      </div>

      <DataTable
        data={usuarios}
        columns={columns}
        searchPlaceholder="Buscar usuários..."
        searchKeys={['nome', 'email', 'perfilNome']}
        actions={(u: Usuario) => (
          <div className="flex items-center gap-1 justify-end">
            <button onClick={() => abrirEditar(u)} className="p-1.5 rounded-md hover:bg-muted transition" title="Editar">
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={() => toggleAtivo(u.id)} className="p-1.5 rounded-md hover:bg-muted transition" title={u.ativo ? 'Desativar' : 'Ativar'}>
              <Power className={`w-4 h-4 ${u.ativo ? 'text-destructive' : 'text-success'}`} />
            </button>
          </div>
        )}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nome</label>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Perfil</label>
              <select value={form.perfilId} onChange={e => setForm(f => ({ ...f, perfilId: Number(e.target.value) }))}
                className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition">
                {perfis.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-lg text-sm border border-input hover:bg-muted transition">
              Cancelar
            </button>
            <button onClick={salvar} disabled={!form.nome || !form.email}
              className="gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition">
              {editando ? 'Salvar' : 'Criar'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
