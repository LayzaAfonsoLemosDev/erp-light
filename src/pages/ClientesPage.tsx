import { useState } from 'react';
import { AppLayout } from '@/components/erp/AppLayout';
import { DataTable } from '@/components/erp/DataTable';
import { clientes as initialClientes } from '@/data/mockData';
import { Cliente } from '@/types/erp';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function ClientesPage() {
  const [clientes, setClientes] = useState(initialClientes);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', cpfCnpj: '', endereco: '', cidade: '', estado: '' });

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    { key: 'telefone', label: 'Telefone' },
    { key: 'cidade', label: 'Cidade' },
    { key: 'estado', label: 'UF' },
    { key: 'ativo', label: 'Status', render: (c: Cliente) => (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${c.ativo ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.ativo ? 'bg-success' : 'bg-muted-foreground'}`} />
        {c.ativo ? 'Ativo' : 'Inativo'}
      </span>
    )},
  ];

  const openNew = () => {
    setEditing(null);
    setForm({ nome: '', email: '', telefone: '', cpfCnpj: '', endereco: '', cidade: '', estado: '' });
    setShowForm(true);
  };

  const openEdit = (c: Cliente) => {
    setEditing(c);
    setForm({ nome: c.nome, email: c.email, telefone: c.telefone, cpfCnpj: c.cpfCnpj, endereco: c.endereco, cidade: c.cidade, estado: c.estado });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.nome || !form.email) return;
    if (editing) {
      setClientes(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      const novo: Cliente = { id: Date.now(), ...form, dataCadastro: new Date().toISOString().split('T')[0], ativo: true };
      setClientes(prev => [...prev, novo]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">Gerenciamento de clientes cadastrados</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 gradient-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Novo Cliente
        </button>
      </div>

      <DataTable
        data={clientes} columns={columns}
        searchPlaceholder="Buscar por nome, e-mail ou cidade..."
        searchKeys={['nome', 'email', 'cidade']}
        actions={(c: Cliente) => (
          <div className="flex items-center gap-1 justify-end">
            <button onClick={() => openEdit(c)} className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition"><Trash2 className="w-4 h-4" /></button>
          </div>
        )}
      />

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-xl border border-border shadow-elevated w-full max-w-lg p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground">{editing ? 'Editar Cliente' : 'Novo Cliente'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-md hover:bg-muted transition"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'nome', label: 'Nome *', span: true },
                { key: 'email', label: 'E-mail *' },
                { key: 'telefone', label: 'Telefone' },
                { key: 'cpfCnpj', label: 'CPF/CNPJ' },
                { key: 'endereco', label: 'Endereço' },
                { key: 'cidade', label: 'Cidade' },
                { key: 'estado', label: 'Estado' },
              ].map(field => (
                <div key={field.key} className={field.span ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{field.label}</label>
                  <input
                    value={(form as any)[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm rounded-lg border border-border text-foreground hover:bg-muted transition">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm rounded-lg gradient-primary text-primary-foreground font-medium hover:opacity-90 transition">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
