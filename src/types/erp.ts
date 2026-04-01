export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  dataCadastro: string;
  ativo: boolean;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
  sku: string;
  ativo: boolean;
}

export interface ItemPedido {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  clienteNome: string;
  itens: ItemPedido[];
  valorTotal: number;
  status: 'pendente' | 'aprovado' | 'enviado' | 'entregue' | 'cancelado';
  dataPedido: string;
  observacoes: string;
}

export type ModuloSistema = 'clientes' | 'produtos' | 'pedidos' | 'usuarios' | 'perfis';
export type AcaoPermissao = 'visualizar' | 'criar' | 'editar' | 'excluir';

export interface Permissao {
  modulo: ModuloSistema;
  acoes: AcaoPermissao[];
}

export interface Perfil {
  id: number;
  nome: string;
  descricao: string;
  permissoes: Permissao[];
  ativo: boolean;
  dataCriacao: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfilId: number;
  perfilNome: string;
  ativo: boolean;
  dataCriacao: string;
  ultimoAcesso: string;
}

export interface DashboardMetrics {
  totalVendas: number;
  totalClientes: number;
  totalProdutos: number;
  totalPedidos: number;
  vendasMes: number;
  pedidosPendentes: number;
  produtosBaixoEstoque: number;
  vendasPorMes: { mes: string; valor: number }[];
  pedidosPorStatus: { status: string; quantidade: number }[];
  topProdutos: { nome: string; vendas: number }[];
}
