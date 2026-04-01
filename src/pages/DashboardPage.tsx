import { AppLayout } from '@/components/erp/AppLayout';
import { MetricCard } from '@/components/erp/MetricCard';
import { dashboardMetrics } from '@/data/mockData';
import { DollarSign, Users, Package, ShoppingCart, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(38, 92%, 50%)', 'hsl(215, 80%, 45%)', 'hsl(200, 80%, 45%)', 'hsl(142, 72%, 40%)', 'hsl(0, 72%, 51%)'];

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function DashboardPage() {
  const m = dashboardMetrics;

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do sistema de gestão comercial</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total de Vendas" value={formatCurrency(m.totalVendas)} icon={DollarSign} trend="+12.5% este mês" trendUp />
        <MetricCard title="Clientes Cadastrados" value={m.totalClientes} icon={Users} trend="+2 novos" trendUp />
        <MetricCard title="Pedidos Pendentes" value={m.pedidosPendentes} icon={Clock} />
        <MetricCard title="Baixo Estoque" value={m.produtosBaixoEstoque} icon={AlertTriangle} trend="Atenção" trendUp={false} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl p-5 border border-border shadow-card animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Vendas por Mês</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={m.vendasPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="valor" fill="hsl(215, 80%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card rounded-xl p-5 border border-border shadow-card animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Pedidos por Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={m.pedidosPorStatus} dataKey="quantidade" nameKey="status" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                {m.pedidosPorStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {m.pedidosPorStatus.map((item, i) => (
              <div key={item.status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground">{item.status}</span>
                </div>
                <span className="font-medium text-foreground">{item.quantidade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-6 bg-card rounded-xl p-5 border border-border shadow-card animate-slide-up">
        <h3 className="text-sm font-semibold text-foreground mb-4">Top Produtos Vendidos</h3>
        <div className="space-y-3">
          {m.topProdutos.map((p, i) => (
            <div key={p.nome} className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}.</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{p.nome}</span>
                  <span className="text-xs font-medium text-muted-foreground">{p.vendas} un.</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${(p.vendas / 30) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
