-- =============================================
-- ERP Light - RBAC (Role-Based Access Control)
-- SQL Server - Tabelas de Usuários, Perfis e Permissões
-- =============================================

-- Tabela de Perfis (Roles)
CREATE TABLE Perfis (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    Nome            NVARCHAR(100)     NOT NULL UNIQUE,
    Descricao       NVARCHAR(500)     NULL,
    Ativo           BIT               NOT NULL DEFAULT 1,
    DataCriacao     DATETIME2         NOT NULL DEFAULT GETDATE(),
    DataAtualizacao DATETIME2         NULL
);

-- Tabela de Módulos do Sistema
CREATE TABLE Modulos (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    Nome            NVARCHAR(100)     NOT NULL UNIQUE,  -- ex: 'clientes', 'produtos'
    Descricao       NVARCHAR(500)     NULL,
    Ativo           BIT               NOT NULL DEFAULT 1
);

-- Tabela de Ações disponíveis
CREATE TABLE Acoes (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    Nome            NVARCHAR(50)      NOT NULL UNIQUE,  -- ex: 'visualizar', 'criar', 'editar', 'excluir'
    Descricao       NVARCHAR(200)     NULL
);

-- Tabela de Permissões (relaciona Perfil + Módulo + Ação)
CREATE TABLE Permissoes (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    PerfilId        INT               NOT NULL REFERENCES Perfis(Id) ON DELETE CASCADE,
    ModuloId        INT               NOT NULL REFERENCES Modulos(Id) ON DELETE CASCADE,
    AcaoId          INT               NOT NULL REFERENCES Acoes(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_Permissao UNIQUE (PerfilId, ModuloId, AcaoId)
);

-- Tabela de Usuários
CREATE TABLE Usuarios (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    Nome            NVARCHAR(200)     NOT NULL,
    Email           NVARCHAR(255)     NOT NULL UNIQUE,
    SenhaHash       NVARCHAR(500)     NOT NULL,  -- BCrypt hash
    PerfilId        INT               NOT NULL REFERENCES Perfis(Id),
    Ativo           BIT               NOT NULL DEFAULT 1,
    DataCriacao     DATETIME2         NOT NULL DEFAULT GETDATE(),
    UltimoAcesso    DATETIME2         NULL,
    TokenResetSenha NVARCHAR(500)     NULL,
    DataExpiracaoToken DATETIME2      NULL
);

-- Índices
CREATE INDEX IX_Usuarios_Email ON Usuarios(Email);
CREATE INDEX IX_Usuarios_PerfilId ON Usuarios(PerfilId);
CREATE INDEX IX_Permissoes_PerfilId ON Permissoes(PerfilId);

-- =============================================
-- Procedures de RBAC
-- =============================================

-- Verificar se usuário tem permissão
CREATE PROCEDURE sp_VerificarPermissao
    @UsuarioId INT,
    @ModuloNome NVARCHAR(100),
    @AcaoNome NVARCHAR(50),
    @TemPermissao BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    SET @TemPermissao = CASE WHEN EXISTS (
        SELECT 1 
        FROM Usuarios u
        INNER JOIN Permissoes p ON p.PerfilId = u.PerfilId
        INNER JOIN Modulos m ON m.Id = p.ModuloId
        INNER JOIN Acoes a ON a.Id = p.AcaoId
        WHERE u.Id = @UsuarioId 
          AND u.Ativo = 1
          AND m.Nome = @ModuloNome
          AND a.Nome = @AcaoNome
    ) THEN 1 ELSE 0 END;
END;
GO

-- Listar permissões de um perfil
CREATE PROCEDURE sp_ListarPermissoesPerfil
    @PerfilId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT m.Nome AS Modulo, a.Nome AS Acao
    FROM Permissoes p
    INNER JOIN Modulos m ON m.Id = p.ModuloId
    INNER JOIN Acoes a ON a.Id = p.AcaoId
    WHERE p.PerfilId = @PerfilId
    ORDER BY m.Nome, a.Nome;
END;
GO

-- Criar usuário com senha criptografada (chamado pelo backend)
CREATE PROCEDURE sp_CriarUsuario
    @Nome NVARCHAR(200),
    @Email NVARCHAR(255),
    @SenhaHash NVARCHAR(500),
    @PerfilId INT,
    @NovoId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM Usuarios WHERE Email = @Email)
    BEGIN
        RAISERROR('E-mail já cadastrado no sistema.', 16, 1);
        RETURN;
    END
    
    INSERT INTO Usuarios (Nome, Email, SenhaHash, PerfilId)
    VALUES (@Nome, @Email, @SenhaHash, @PerfilId);
    
    SET @NovoId = SCOPE_IDENTITY();
END;
GO

-- Seed data
INSERT INTO Acoes (Nome, Descricao) VALUES
('visualizar', 'Permissão de leitura'),
('criar', 'Permissão de criação'),
('editar', 'Permissão de edição'),
('excluir', 'Permissão de exclusão');

INSERT INTO Modulos (Nome, Descricao) VALUES
('clientes', 'Módulo de Clientes'),
('produtos', 'Módulo de Produtos'),
('pedidos', 'Módulo de Pedidos'),
('usuarios', 'Módulo de Usuários'),
('perfis', 'Módulo de Perfis');

INSERT INTO Perfis (Nome, Descricao) VALUES
('Administrador', 'Acesso total ao sistema'),
('Vendedor', 'Gerencia clientes e pedidos'),
('Estoque', 'Gerencia produtos e estoque');

-- Admin: todas as permissões
INSERT INTO Permissoes (PerfilId, ModuloId, AcaoId)
SELECT 1, m.Id, a.Id FROM Modulos m CROSS JOIN Acoes a;

-- Vendedor: clientes (VCRE), produtos (V), pedidos (VCE)
INSERT INTO Permissoes (PerfilId, ModuloId, AcaoId)
SELECT 2, m.Id, a.Id FROM Modulos m, Acoes a
WHERE (m.Nome = 'clientes' AND a.Nome IN ('visualizar','criar','editar'))
   OR (m.Nome = 'produtos' AND a.Nome = 'visualizar')
   OR (m.Nome = 'pedidos' AND a.Nome IN ('visualizar','criar','editar'));

-- Estoque: produtos (VCE), pedidos (V)
INSERT INTO Permissoes (PerfilId, ModuloId, AcaoId)
SELECT 3, m.Id, a.Id FROM Modulos m, Acoes a
WHERE (m.Nome = 'produtos' AND a.Nome IN ('visualizar','criar','editar'))
   OR (m.Nome = 'pedidos' AND a.Nome = 'visualizar');
