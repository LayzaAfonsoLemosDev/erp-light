import { AppLayout } from '@/components/erp/AppLayout';
import { DataTable } from '@/components/erp/DataTable';
import { StatusBadge } from '@/components/erp/StatusBadge';
import { pedidos } from '@/data/mockData';
import { Pedido } from '@/types/erp';
import { Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function PedidosPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const columns = [
    { key: 'id', label: 'Pedido', render: (p: Pedido) => <span className="font-mono font-medium text-primary">#{p.id}</span> },
    { key: 'clienteNome', label: 'Cliente' },
    { key: 'dataPedido', label: 'Data', render: (p: Pedido) => new Date(p.dataPedido).toLocaleDateString('pt-BR') },
    { key: 'itens', label: 'Itens', render: (p: Pedido) => `${p.itens.length} item(ns)` },
    { key: 'valorTotal', label: 'Valor Total', render: (p: Pedido) => <span className="font-semibold">{formatCurrency(p.valorTotal)}</span> },
    { key: 'status', label: 'Status', render: (p: Pedido) => <StatusBadge status={p.status} /> },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>
        <p className="text-sm text-muted-foreground">Acompanhamento de pedidos realizados</p>
      </div>

      <DataTable
        data={pedidos} columns={columns}
        searchPlaceholder="Buscar por número, cliente ou status..."
        searchKeys={['id', 'clienteNome', 'status']}
        actions={(p: Pedido) => (
          <button
            onClick={() => setExpanded(expanded === p.id ? null : p.id)}
            className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition"
          >
            {expanded === p.id ? <ChevronUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      />

      {/* Expanded Order Detail */}
      {expanded && (() => {
        const pedido = pedidos.find(p => p.id === expanded);
        if (!pedido) return null;
        return (
          <div className="mt-4 bg-card rounded-xl border border-border p-5 shadow-card animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Detalhes do Pedido #{pedido.id}</h3>
              <StatusBadge status={pedido.status} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">Cliente</span>
                <p className="font-medium text-foreground">{pedido.clienteNome}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Data</span>
                <p className="font-medium text-foreground">{new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Total</span>
                <p className="font-bold text-primary">{formatCurrency(pedido.valorTotal)}</p>
              </div>
              {pedido.observacoes && (
                <div>
                  <span className="text-xs text-muted-foreground">Observações</span>
                  <p className="font-medium text-foreground">{pedido.observacoes}</p>
                </div>
              )}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs font-semibold text-muted-foreground uppercase">Produto</th>
                  <th className="text-right py-2 text-xs font-semibold text-muted-foreground uppercase">Qtd</th>
                  <th className="text-right py-2 text-xs font-semibold text-muted-foreground uppercase">Preço Unit.</th>
                  <th className="text-right py-2 text-xs font-semibold text-muted-foreground uppercase">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pedido.itens.map(item => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="py-2 text-foreground">{item.produtoNome}</td>
                    <td className="py-2 text-right text-foreground">{item.quantidade}</td>
                    <td className="py-2 text-right text-muted-foreground">{formatCurrency(item.precoUnitario)}</td>
                    <td className="py-2 text-right font-medium text-foreground">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}
    </AppLayout>
  );
}
