-- =============================================
-- ERP Light - Dados de Exemplo (Seed)
-- 04 - Seed Data
-- =============================================

-- Categorias
INSERT INTO Categorias (Nome, Descricao) VALUES
('Informática', 'Computadores, notebooks e acessórios'),
('Periféricos', 'Teclados, mouses, headsets'),
('Mobiliário', 'Cadeiras, mesas e estações de trabalho');

-- Clientes
SET IDENTITY_INSERT Clientes ON;
INSERT INTO Clientes (Id, Nome, Email, Telefone, CpfCnpj, Endereco, Cidade, Estado) VALUES
(1, 'Tech Solutions Ltda', 'contato@techsolutions.com.br', '(11) 3456-7890', '12.345.678/0001-90', 'Av. Paulista, 1000', 'São Paulo', 'SP'),
(2, 'Maria Silva', 'maria@email.com', '(21) 98765-4321', '123.456.789-00', 'Rua das Flores, 250', 'Rio de Janeiro', 'RJ'),
(3, 'Indústria ABC S.A.', 'vendas@industriaabc.com.br', '(31) 3333-4444', '98.765.432/0001-10', 'Distrito Industrial, Lote 5', 'Belo Horizonte', 'MG'),
(4, 'João Pereira', 'joao.pereira@gmail.com', '(41) 99876-5432', '987.654.321-00', 'Rua XV de Novembro, 500', 'Curitiba', 'PR'),
(5, 'Distribuidora Norte', 'contato@distnorte.com.br', '(92) 3222-1111', '11.222.333/0001-44', 'Av. Brasil, 3000', 'Manaus', 'AM'),
(6, 'Ana Costa', 'ana.costa@outlook.com', '(51) 98888-7777', '456.789.123-00', 'Rua Farroupilha, 120', 'Porto Alegre', 'RS');
SET IDENTITY_INSERT Clientes OFF;

-- Produtos
SET IDENTITY_INSERT Produtos ON;
INSERT INTO Produtos (Id, Nome, Descricao, Preco, Estoque, CategoriaId, SKU) VALUES
(1, 'Notebook ProBook 450', 'Notebook empresarial i7 16GB RAM', 4599.90, 25, 1, 'NB-PB450'),
(2, 'Monitor UltraWide 34"', 'Monitor curvo 34 polegadas WQHD', 2899.00, 12, 1, 'MN-UW34'),
(3, 'Teclado Mecânico K95', 'Teclado mecânico RGB switches brown', 699.90, 45, 2, 'TC-K95'),
(4, 'Mouse Wireless MX', 'Mouse ergonômico sem fio', 349.90, 3, 2, 'MS-MX01'),
(5, 'Cadeira Ergonômica Pro', 'Cadeira escritório ergonômica ajustável', 1899.00, 8, 3, 'CD-EP01'),
(6, 'Headset Gamer 7.1', 'Headset surround virtual 7.1', 299.90, 0, 2, 'HS-G71'),
(7, 'SSD NVMe 1TB', 'SSD M.2 NVMe Gen4 leitura 7000MB/s', 549.90, 60, 1, 'SD-NV1T'),
(8, 'Webcam HD 1080p', 'Webcam Full HD com microfone', 199.90, 2, 2, 'WC-HD10');
SET IDENTITY_INSERT Produtos OFF;

-- Usuário admin
INSERT INTO Usuarios (Nome, Email, SenhaHash, Cargo)
VALUES ('Administrador', 'admin@erp.com', 'hash_simulado_bcrypt', 'Gerente de TI');

PRINT 'Dados de exemplo inseridos com sucesso!';
