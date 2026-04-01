import { Cliente, Produto, Pedido, DashboardMetrics, Perfil, Usuario } from '@/types/erp';

export const clientes: Cliente[] = [
  { id: 1, nome: 'Tech Solutions Ltda', email: 'contato@techsolutions.com.br', telefone: '(11) 3456-7890', cpfCnpj: '12.345.678/0001-90', endereco: 'Av. Paulista, 1000', cidade: 'São Paulo', estado: 'SP', dataCadastro: '2024-01-15', ativo: true },
  { id: 2, nome: 'Maria Silva', email: 'maria@email.com', telefone: '(21) 98765-4321', cpfCnpj: '123.456.789-00', endereco: 'Rua das Flores, 250', cidade: 'Rio de Janeiro', estado: 'RJ', dataCadastro: '2024-02-20', ativo: true },
  { id: 3, nome: 'Indústria ABC S.A.', email: 'vendas@industriaabc.com.br', telefone: '(31) 3333-4444', cpfCnpj: '98.765.432/0001-10', endereco: 'Distrito Industrial, Lote 5', cidade: 'Belo Horizonte', estado: 'MG', dataCadastro: '2024-03-10', ativo: true },
  { id: 4, nome: 'João Pereira', email: 'joao.pereira@gmail.com', telefone: '(41) 99876-5432', cpfCnpj: '987.654.321-00', endereco: 'Rua XV de Novembro, 500', cidade: 'Curitiba', estado: 'PR', dataCadastro: '2024-04-05', ativo: false },
  { id: 5, nome: 'Distribuidora Norte', email: 'contato@distnorte.com.br', telefone: '(92) 3222-1111', cpfCnpj: '11.222.333/0001-44', endereco: 'Av. Brasil, 3000', cidade: 'Manaus', estado: 'AM', dataCadastro: '2024-05-12', ativo: true },
  { id: 6, nome: 'Ana Costa', email: 'ana.costa@outlook.com', telefone: '(51) 98888-7777', cpfCnpj: '456.789.123-00', endereco: 'Rua Farroupilha, 120', cidade: 'Porto Alegre', estado: 'RS', dataCadastro: '2024-06-01', ativo: true },
];

export const produtos: Produto[] = [
  { id: 1, nome: 'Notebook ProBook 450', descricao: 'Notebook empresarial i7 16GB RAM', preco: 4599.90, estoque: 25, categoria: 'Informática', sku: 'NB-PB450', ativo: true },
  { id: 2, nome: 'Monitor UltraWide 34"', descricao: 'Monitor curvo 34 polegadas WQHD', preco: 2899.00, estoque: 12, categoria: 'Informática', sku: 'MN-UW34', ativo: true },
  { id: 3, nome: 'Teclado Mecânico K95', descricao: 'Teclado mecânico RGB switches brown', preco: 699.90, estoque: 45, categoria: 'Periféricos', sku: 'TC-K95', ativo: true },
  { id: 4, nome: 'Mouse Wireless MX', descricao: 'Mouse ergonômico sem fio', preco: 349.90, estoque: 3, categoria: 'Periféricos', sku: 'MS-MX01', ativo: true },
  { id: 5, nome: 'Cadeira Ergonômica Pro', descricao: 'Cadeira escritório ergonômica ajustável', preco: 1899.00, estoque: 8, categoria: 'Mobiliário', sku: 'CD-EP01', ativo: true },
  { id: 6, nome: 'Headset Gamer 7.1', descricao: 'Headset surround virtual 7.1', preco: 299.90, estoque: 0, categoria: 'Periféricos', sku: 'HS-G71', ativo: false },
  { id: 7, nome: 'SSD NVMe 1TB', descricao: 'SSD M.2 NVMe Gen4 leitura 7000MB/s', preco: 549.90, estoque: 60, categoria: 'Informática', sku: 'SD-NV1T', ativo: true },
  { id: 8, nome: 'Webcam HD 1080p', descricao: 'Webcam Full HD com microfone', preco: 199.90, estoque: 2, categoria: 'Periféricos', sku: 'WC-HD10', ativo: true },
];

export const pedidos: Pedido[] = [
  { id: 1001, clienteId: 1, clienteNome: 'Tech Solutions Ltda', itens: [
    { id: 1, produtoId: 1, produtoNome: 'Notebook ProBook 450', quantidade: 5, precoUnitario: 4599.90, subtotal: 22999.50 },
    { id: 2, produtoId: 3, produtoNome: 'Teclado Mecânico K95', quantidade: 5, precoUnitario: 699.90, subtotal: 3499.50 },
  ], valorTotal: 26499.00, status: 'entregue', dataPedido: '2024-01-20', observacoes: 'Entrega urgente' },
  { id: 1002, clienteId: 2, clienteNome: 'Maria Silva', itens: [
    { id: 3, produtoId: 2, produtoNome: 'Monitor UltraWide 34"', quantidade: 1, precoUnitario: 2899.00, subtotal: 2899.00 },
  ], valorTotal: 2899.00, status: 'enviado', dataPedido: '2024-02-15', observacoes: '' },
  { id: 1003, clienteId: 3, clienteNome: 'Indústria ABC S.A.', itens: [
    { id: 4, produtoId: 5, produtoNome: 'Cadeira Ergonômica Pro', quantidade: 20, precoUnitario: 1899.00, subtotal: 37980.00 },
    { id: 5, produtoId: 1, produtoNome: 'Notebook ProBook 450', quantidade: 10, precoUnitario: 4599.90, subtotal: 45999.00 },
    { id: 6, produtoId: 2, produtoNome: 'Monitor UltraWide 34"', quantidade: 10, precoUnitario: 2899.00, subtotal: 28990.00 },
  ], valorTotal: 112969.00, status: 'aprovado', dataPedido: '2024-03-01', observacoes: 'Projeto novo escritório' },
  { id: 1004, clienteId: 5, clienteNome: 'Distribuidora Norte', itens: [
    { id: 7, produtoId: 7, produtoNome: 'SSD NVMe 1TB', quantidade: 30, precoUnitario: 549.90, subtotal: 16497.00 },
    { id: 8, produtoId: 4, produtoNome: 'Mouse Wireless MX', quantidade: 30, precoUnitario: 349.90, subtotal: 10497.00 },
  ], valorTotal: 26994.00, status: 'pendente', dataPedido: '2024-03-15', observacoes: 'Aguardando aprovação gerência' },
  { id: 1005, clienteId: 6, clienteNome: 'Ana Costa', itens: [
    { id: 9, produtoId: 8, produtoNome: 'Webcam HD 1080p', quantidade: 1, precoUnitario: 199.90, subtotal: 199.90 },
    { id: 10, produtoId: 3, produtoNome: 'Teclado Mecânico K95', quantidade: 1, precoUnitario: 699.90, subtotal: 699.90 },
  ], valorTotal: 899.80, status: 'cancelado', dataPedido: '2024-03-20', observacoes: 'Cliente desistiu' },
];

export const dashboardMetrics: DashboardMetrics = {
  totalVendas: 170260.80,
  totalClientes: 6,
  totalProdutos: 8,
  totalPedidos: 5,
  vendasMes: 27893.80,
  pedidosPendentes: 1,
  produtosBaixoEstoque: 3,
  vendasPorMes: [
    { mes: 'Jan', valor: 26499 },
    { mes: 'Fev', valor: 2899 },
    { mes: 'Mar', valor: 140862.80 },
    { mes: 'Abr', valor: 18500 },
    { mes: 'Mai', valor: 32100 },
    { mes: 'Jun', valor: 27893.80 },
  ],
  pedidosPorStatus: [
    { status: 'Pendente', quantidade: 1 },
    { status: 'Aprovado', quantidade: 1 },
    { status: 'Enviado', quantidade: 1 },
    { status: 'Entregue', quantidade: 1 },
    { status: 'Cancelado', quantidade: 1 },
  ],
  topProdutos: [
    { nome: 'Notebook ProBook 450', vendas: 15 },
    { nome: 'Cadeira Ergonômica Pro', vendas: 20 },
    { nome: 'SSD NVMe 1TB', vendas: 30 },
    { nome: 'Monitor UltraWide 34"', vendas: 11 },
    { nome: 'Mouse Wireless MX', vendas: 30 },
  ],
};

export const MODULOS_SISTEMA = [
  { id: 'clientes' as const, label: 'Clientes' },
  { id: 'produtos' as const, label: 'Produtos' },
  { id: 'pedidos' as const, label: 'Pedidos' },
  { id: 'usuarios' as const, label: 'Usuários' },
  { id: 'perfis' as const, label: 'Perfis' },
];

export const ACOES_DISPONIVEIS = [
  { id: 'visualizar' as const, label: 'Visualizar' },
  { id: 'criar' as const, label: 'Criar' },
  { id: 'editar' as const, label: 'Editar' },
  { id: 'excluir' as const, label: 'Excluir' },
];

export const perfis: Perfil[] = [
  {
    id: 1, nome: 'Administrador', descricao: 'Acesso total ao sistema', ativo: true, dataCriacao: '2024-01-01',
    permissoes: MODULOS_SISTEMA.map(m => ({ modulo: m.id, acoes: ['visualizar', 'criar', 'editar', 'excluir'] })),
  },
  {
    id: 2, nome: 'Vendedor', descricao: 'Gerencia clientes e pedidos', ativo: true, dataCriacao: '2024-01-01',
    permissoes: [
      { modulo: 'clientes', acoes: ['visualizar', 'criar', 'editar'] },
      { modulo: 'produtos', acoes: ['visualizar'] },
      { modulo: 'pedidos', acoes: ['visualizar', 'criar', 'editar'] },
    ],
  },
  {
    id: 3, nome: 'Estoque', descricao: 'Gerencia produtos e estoque', ativo: true, dataCriacao: '2024-01-15',
    permissoes: [
      { modulo: 'produtos', acoes: ['visualizar', 'criar', 'editar'] },
      { modulo: 'pedidos', acoes: ['visualizar'] },
    ],
  },
];

export const usuarios: Usuario[] = [
  { id: 1, nome: 'Administrador', email: 'admin@erp.com', perfilId: 1, perfilNome: 'Administrador', ativo: true, dataCriacao: '2024-01-01', ultimoAcesso: '2026-03-31' },
  { id: 2, nome: 'Operador', email: 'usuario@erp.com', perfilId: 2, perfilNome: 'Vendedor', ativo: true, dataCriacao: '2024-01-10', ultimoAcesso: '2026-03-30' },
  { id: 3, nome: 'Carlos Oliveira', email: 'carlos@erp.com', perfilId: 3, perfilNome: 'Estoque', ativo: true, dataCriacao: '2024-02-01', ultimoAcesso: '2026-03-28' },
  { id: 4, nome: 'Juliana Santos', email: 'juliana@erp.com', perfilId: 2, perfilNome: 'Vendedor', ativo: false, dataCriacao: '2024-03-15', ultimoAcesso: '2026-01-10' },
];
