import { useState } from 'react';
import { AppLayout } from '@/components/erp/AppLayout';
import { perfis as initialPerfis, MODULOS_SISTEMA, ACOES_DISPONIVEIS } from '@/data/mockData';
import { Perfil, Permissao, ModuloSistema, AcaoPermissao } from '@/types/erp';
import { Shield, Plus, Edit2, Check, X, Users } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function PerfisPage() {
  const { isAdmin } = useAuth();
  const [perfilList, setPerfilList] = useState<Perfil[]>(initialPerfis);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Perfil | null>(null);
  const [form, setForm] = useState({ nome: '', descricao: '', permissoes: [] as Permissao[] });

  if (!isAdmin) return <Navigate to="/" replace />;

  const abrirNovo = () => {
    setEditando(null);
    setForm({ nome: '', descricao: '', permissoes: [] });
    setDialogOpen(true);
  };

  const abrirEditar = (p: Perfil) => {
    setEditando(p);
    setForm({ nome: p.nome, descricao: p.descricao, permissoes: JSON.parse(JSON.stringify(p.permissoes)) });
    setDialogOpen(true);
  };

  const togglePermissao = (modulo: ModuloSistema, acao: AcaoPermissao) => {
    setForm(f => {
      const perms = [...f.permissoes];
      const idx = perms.findIndex(p => p.modulo === modulo);
      if (idx === -1) {
        perms.push({ modulo, acoes: [acao] });
      } else {
        const acoes = perms[idx].acoes;
        if (acoes.includes(acao)) {
          perms[idx] = { ...perms[idx], acoes: acoes.filter(a => a !== acao) };
          if (perms[idx].acoes.length === 0) perms.splice(idx, 1);
        } else {
          perms[idx] = { ...perms[idx], acoes: [...acoes, acao] };
        }
      }
      return { ...f, permissoes: perms };
    });
  };

  const temAcao = (modulo: ModuloSistema, acao: AcaoPermissao) => {
    const perm = form.permissoes.find(p => p.modulo === modulo);
    return perm ? perm.acoes.includes(acao) : false;
  };

  const salvar = () => {
    if (editando) {
      setPerfilList(prev => prev.map(p => p.id === editando.id
        ? { ...p, nome: form.nome, descricao: form.descricao, permissoes: form.permissoes }
        : p
      ));
    } else {
      const novo: Perfil = {
        id: Math.max(...perfilList.map(p => p.id)) + 1,
        nome: form.nome,
        descricao: form.descricao,
        permissoes: form.permissoes,
        ativo: true,
        dataCriacao: new Date().toISOString().split('T')[0],
      };
      setPerfilList(prev => [...prev, novo]);
    }
    setDialogOpen(false);
  };

  const totalPermissoes = (p: Perfil) => p.permissoes.reduce((sum, perm) => sum + perm.acoes.length, 0);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Perfis e Permissões
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie perfis de acesso e permissões do sistema</p>
        </div>
        <button onClick={abrirNovo} className="flex items-center gap-2 gradient-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Novo Perfil
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {perfilList.map(perfil => (
          <div key={perfil.id} className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">{perfil.nome}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{perfil.descricao}</p>
              </div>
              <button onClick={() => abrirEditar(perfil)} className="p-1.5 rounded-md hover:bg-muted transition" title="Editar">
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {perfil.nome === 'Administrador' ? '1' : perfil.nome === 'Vendedor' ? '2' : '1'} usuário(s)</span>
              <span>{totalPermissoes(perfil)} permissões</span>
            </div>

            <div className="space-y-1.5">
              {MODULOS_SISTEMA.map(mod => {
                const perm = perfil.permissoes.find(p => p.modulo === mod.id);
                if (!perm) return null;
                return (
                  <div key={mod.id} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground w-16 truncate">{mod.label}</span>
                    <div className="flex gap-1">
                      {perm.acoes.map(acao => (
                        <span key={acao} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                          {acao.charAt(0).toUpperCase() + acao.slice(1, 3)}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar Perfil' : 'Novo Perfil'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nome do Perfil</label>
                <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Descrição</label>
                <input value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Permissões por Módulo</label>
              <div className="bg-muted/50 rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Módulo</th>
                      {ACOES_DISPONIVEIS.map(a => (
                        <th key={a.id} className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2.5">{a.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MODULOS_SISTEMA.map(mod => (
                      <tr key={mod.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 text-sm font-medium text-foreground">{mod.label}</td>
                        {ACOES_DISPONIVEIS.map(acao => (
                          <td key={acao.id} className="text-center px-3 py-2.5">
                            <button
                              onClick={() => togglePermissao(mod.id, acao.id)}
                              className={`w-7 h-7 rounded-md border transition-all flex items-center justify-center ${
                                temAcao(mod.id, acao.id)
                                  ? 'bg-primary border-primary text-primary-foreground'
                                  : 'border-input bg-background hover:bg-muted text-muted-foreground'
                              }`}
                            >
                              {temAcao(mod.id, acao.id) ? <Check className="w-3.5 h-3.5" /> : null}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-lg text-sm border border-input hover:bg-muted transition">
              Cancelar
            </button>
            <button onClick={salvar} disabled={!form.nome}
              className="gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition">
              {editando ? 'Salvar' : 'Criar'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
