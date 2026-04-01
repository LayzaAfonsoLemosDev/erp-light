-- =============================================
-- ERP Light - Scripts SQL Server
-- 01 - Criação de Tabelas
-- =============================================

-- Tabela de Usuários do Sistema
CREATE TABLE Usuarios (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    SenhaHash NVARCHAR(500) NOT NULL,
    Cargo NVARCHAR(100),
    Ativo BIT DEFAULT 1,
    DataCriacao DATETIME2 DEFAULT GETDATE(),
    UltimoAcesso DATETIME2
);

-- Tabela de Clientes
CREATE TABLE Clientes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(200) NOT NULL,
    Email NVARCHAR(255),
    Telefone NVARCHAR(20),
    CpfCnpj NVARCHAR(18) NOT NULL UNIQUE,
    Endereco NVARCHAR(300),
    Cidade NVARCHAR(100),
    Estado CHAR(2),
    CEP NVARCHAR(10),
    DataCadastro DATETIME2 DEFAULT GETDATE(),
    DataAtualizacao DATETIME2,
    Ativo BIT DEFAULT 1,
    
    CONSTRAINT CK_Estado CHECK (LEN(Estado) = 2)
);

-- Tabela de Categorias
CREATE TABLE Categorias (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(100) NOT NULL UNIQUE,
    Descricao NVARCHAR(300)
);

-- Tabela de Produtos
CREATE TABLE Produtos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(200) NOT NULL,
    Descricao NVARCHAR(500),
    Preco DECIMAL(18,2) NOT NULL CHECK (Preco >= 0),
    Estoque INT NOT NULL DEFAULT 0 CHECK (Estoque >= 0),
    CategoriaId INT FOREIGN KEY REFERENCES Categorias(Id),
    SKU NVARCHAR(20) NOT NULL UNIQUE,
    Ativo BIT DEFAULT 1,
    DataCriacao DATETIME2 DEFAULT GETDATE(),
    DataAtualizacao DATETIME2
);

-- Tabela de Pedidos
CREATE TABLE Pedidos (
    Id INT IDENTITY(1001,1) PRIMARY KEY,
    ClienteId INT NOT NULL FOREIGN KEY REFERENCES Clientes(Id),
    ValorTotal DECIMAL(18,2) NOT NULL DEFAULT 0,
    Status NVARCHAR(20) NOT NULL DEFAULT 'pendente'
        CHECK (Status IN ('pendente','aprovado','enviado','entregue','cancelado')),
    DataPedido DATETIME2 DEFAULT GETDATE(),
    DataAtualizacao DATETIME2,
    Observacoes NVARCHAR(500),
    UsuarioCriacao INT FOREIGN KEY REFERENCES Usuarios(Id)
);

-- Tabela de Itens do Pedido
CREATE TABLE ItensPedido (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PedidoId INT NOT NULL FOREIGN KEY REFERENCES Pedidos(Id) ON DELETE CASCADE,
    ProdutoId INT NOT NULL FOREIGN KEY REFERENCES Produtos(Id),
    Quantidade INT NOT NULL CHECK (Quantidade > 0),
    PrecoUnitario DECIMAL(18,2) NOT NULL,
    Subtotal AS (Quantidade * PrecoUnitario) PERSISTED,
    
    CONSTRAINT UQ_PedidoProduto UNIQUE (PedidoId, ProdutoId)
);

-- Tabela de Logs de Auditoria
CREATE TABLE LogsAuditoria (
    Id BIGINT IDENTITY(1,1) PRIMARY KEY,
    Tabela NVARCHAR(100) NOT NULL,
    Operacao NVARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    RegistroId INT,
    DadosAntigos NVARCHAR(MAX), -- JSON
    DadosNovos NVARCHAR(MAX),   -- JSON
    UsuarioId INT,
    DataOperacao DATETIME2 DEFAULT GETDATE()
);

-- Índices para performance
CREATE INDEX IX_Clientes_Nome ON Clientes(Nome);
CREATE INDEX IX_Clientes_CpfCnpj ON Clientes(CpfCnpj);
CREATE INDEX IX_Produtos_SKU ON Produtos(SKU);
CREATE INDEX IX_Produtos_CategoriaId ON Produtos(CategoriaId);
CREATE INDEX IX_Pedidos_ClienteId ON Pedidos(ClienteId);
CREATE INDEX IX_Pedidos_Status ON Pedidos(Status);
CREATE INDEX IX_Pedidos_DataPedido ON Pedidos(DataPedido);
CREATE INDEX IX_ItensPedido_PedidoId ON ItensPedido(PedidoId);

PRINT 'Tabelas criadas com sucesso!';
