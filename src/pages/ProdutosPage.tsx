import { useState } from 'react';
import { AppLayout } from '@/components/erp/AppLayout';
import { DataTable } from '@/components/erp/DataTable';
import { produtos as initialProdutos } from '@/data/mockData';
import { Produto } from '@/types/erp';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState(initialProdutos);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', estoque: '', categoria: '', sku: '' });

  const columns = [
    { key: 'sku', label: 'SKU', render: (p: Produto) => <span className="font-mono text-xs text-muted-foreground">{p.sku}</span> },
    { key: 'nome', label: 'Produto' },
    { key: 'categoria', label: 'Categoria' },
    { key: 'preco', label: 'Preço', render: (p: Produto) => <span className="font-medium">{formatCurrency(p.preco)}</span> },
    { key: 'estoque', label: 'Estoque', render: (p: Produto) => (
      <span className={`font-medium ${p.estoque <= 5 ? 'text-destructive' : p.estoque <= 15 ? 'text-warning' : 'text-success'}`}>
        {p.estoque} un.
      </span>
    )},
    { key: 'ativo', label: 'Status', render: (p: Produto) => (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${p.ativo ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${p.ativo ? 'bg-success' : 'bg-muted-foreground'}`} />
        {p.ativo ? 'Ativo' : 'Inativo'}
      </span>
    )},
  ];

  const openNew = () => {
    setEditing(null);
    setForm({ nome: '', descricao: '', preco: '', estoque: '', categoria: '', sku: '' });
    setShowForm(true);
  };

  const openEdit = (p: Produto) => {
    setEditing(p);
    setForm({ nome: p.nome, descricao: p.descricao, preco: String(p.preco), estoque: String(p.estoque), categoria: p.categoria, sku: p.sku });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.nome || !form.preco) return;
    if (editing) {
      setProdutos(prev => prev.map(p => p.id === editing.id ? { ...p, ...form, preco: Number(form.preco), estoque: Number(form.estoque) } : p));
    } else {
      const novo: Produto = { id: Date.now(), ...form, preco: Number(form.preco), estoque: Number(form.estoque), ativo: true };
      setProdutos(prev => [...prev, novo]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: number) => setProdutos(prev => prev.filter(p => p.id !== id));

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
          <p className="text-sm text-muted-foreground">Catálogo de produtos e controle de estoque</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 gradient-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Novo Produto
        </button>
      </div>

      <DataTable
        data={produtos} columns={columns}
        searchPlaceholder="Buscar por nome, SKU ou categoria..."
        searchKeys={['nome', 'sku', 'categoria']}
        actions={(p: Produto) => (
          <div className="flex items-center gap-1 justify-end">
            <button onClick={() => openEdit(p)} className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition"><Trash2 className="w-4 h-4" /></button>
          </div>
        )}
      />

      {showForm && (
        <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-xl border border-border shadow-elevated w-full max-w-lg p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground">{editing ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-md hover:bg-muted transition"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'nome', label: 'Nome *', span: true },
                { key: 'descricao', label: 'Descrição', span: true },
                { key: 'preco', label: 'Preço *', type: 'number' },
                { key: 'estoque', label: 'Estoque', type: 'number' },
                { key: 'categoria', label: 'Categoria' },
                { key: 'sku', label: 'SKU' },
              ].map(field => (
                <div key={field.key} className={field.span ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{field.label}</label>
                  <input
                    type={field.type || 'text'}
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
