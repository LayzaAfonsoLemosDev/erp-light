-- =============================================
-- ERP Light - Stored Procedures
-- 02 - Procedures
-- =============================================

-- SP: Buscar clientes com paginação e filtro
CREATE OR ALTER PROCEDURE sp_BuscarClientes
    @Termo NVARCHAR(200) = NULL,
    @Pagina INT = 1,
    @TamanhoPagina INT = 10,
    @ApenasAtivos BIT = 1
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@Pagina - 1) * @TamanhoPagina;
    
    SELECT 
        c.Id, c.Nome, c.Email, c.Telefone, c.CpfCnpj,
        c.Cidade, c.Estado, c.Ativo, c.DataCadastro,
        COUNT(*) OVER() AS TotalRegistros
    FROM Clientes c
    WHERE (@ApenasAtivos = 0 OR c.Ativo = 1)
      AND (@Termo IS NULL 
           OR c.Nome LIKE '%' + @Termo + '%'
           OR c.Email LIKE '%' + @Termo + '%'
           OR c.CpfCnpj LIKE '%' + @Termo + '%')
    ORDER BY c.Nome
    OFFSET @Offset ROWS
    FETCH NEXT @TamanhoPagina ROWS ONLY;
END;
GO

-- SP: Criar pedido com itens (transação)
CREATE OR ALTER PROCEDURE sp_CriarPedido
    @ClienteId INT,
    @Observacoes NVARCHAR(500) = NULL,
    @UsuarioId INT = NULL,
    @ItensJson NVARCHAR(MAX), -- JSON: [{produtoId, quantidade}]
    @PedidoId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validar cliente
        IF NOT EXISTS (SELECT 1 FROM Clientes WHERE Id = @ClienteId AND Ativo = 1)
        BEGIN
            RAISERROR('Cliente não encontrado ou inativo.', 16, 1);
            RETURN;
        END
        
        -- Criar pedido
        INSERT INTO Pedidos (ClienteId, Observacoes, UsuarioCriacao)
        VALUES (@ClienteId, @Observacoes, @UsuarioId);
        
        SET @PedidoId = SCOPE_IDENTITY();
        
        -- Inserir itens a partir do JSON
        INSERT INTO ItensPedido (PedidoId, ProdutoId, Quantidade, PrecoUnitario)
        SELECT 
            @PedidoId,
            j.ProdutoId,
            j.Quantidade,
            p.Preco
        FROM OPENJSON(@ItensJson)
        WITH (
            ProdutoId INT '$.produtoId',
            Quantidade INT '$.quantidade'
        ) j
        INNER JOIN Produtos p ON p.Id = j.ProdutoId
        WHERE p.Ativo = 1 AND p.Estoque >= j.Quantidade;
        
        -- Atualizar estoque
        UPDATE p
        SET p.Estoque = p.Estoque - j.Quantidade
        FROM Produtos p
        INNER JOIN OPENJSON(@ItensJson)
        WITH (ProdutoId INT '$.produtoId', Quantidade INT '$.quantidade') j
            ON p.Id = j.ProdutoId;
        
        -- Calcular valor total
        UPDATE Pedidos 
        SET ValorTotal = (SELECT SUM(Subtotal) FROM ItensPedido WHERE PedidoId = @PedidoId)
        WHERE Id = @PedidoId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- SP: Dashboard - Métricas gerais
CREATE OR ALTER PROCEDURE sp_ObterMetricasDashboard
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Métricas gerais
    SELECT 
        (SELECT ISNULL(SUM(ValorTotal), 0) FROM Pedidos WHERE Status != 'cancelado') AS TotalVendas,
        (SELECT COUNT(*) FROM Clientes WHERE Ativo = 1) AS TotalClientes,
        (SELECT COUNT(*) FROM Produtos WHERE Ativo = 1) AS TotalProdutos,
        (SELECT COUNT(*) FROM Pedidos) AS TotalPedidos,
        (SELECT COUNT(*) FROM Pedidos WHERE Status = 'pendente') AS PedidosPendentes,
        (SELECT COUNT(*) FROM Produtos WHERE Estoque <= 5 AND Ativo = 1) AS ProdutosBaixoEstoque;
    
    -- Vendas por mês (últimos 6 meses)
    SELECT 
        FORMAT(DataPedido, 'MMM', 'pt-BR') AS Mes,
        SUM(ValorTotal) AS Valor
    FROM Pedidos
    WHERE DataPedido >= DATEADD(MONTH, -6, GETDATE())
      AND Status != 'cancelado'
    GROUP BY FORMAT(DataPedido, 'MMM', 'pt-BR'), MONTH(DataPedido)
    ORDER BY MONTH(DataPedido);
    
    -- Top 5 produtos mais vendidos
    SELECT TOP 5
        p.Nome,
        SUM(ip.Quantidade) AS TotalVendido
    FROM ItensPedido ip
    INNER JOIN Produtos p ON p.Id = ip.ProdutoId
    INNER JOIN Pedidos pe ON pe.Id = ip.PedidoId
    WHERE pe.Status != 'cancelado'
    GROUP BY p.Nome
    ORDER BY TotalVendido DESC;
END;
GO

-- SP: Relatório de vendas por período
CREATE OR ALTER PROCEDURE sp_RelatorioVendas
    @DataInicio DATETIME2,
    @DataFim DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        pe.Id AS PedidoId,
        c.Nome AS Cliente,
        pe.DataPedido,
        pe.ValorTotal,
        pe.Status,
        STRING_AGG(p.Nome + ' (x' + CAST(ip.Quantidade AS NVARCHAR) + ')', ', ') AS Produtos
    FROM Pedidos pe
    INNER JOIN Clientes c ON c.Id = pe.ClienteId
    INNER JOIN ItensPedido ip ON ip.PedidoId = pe.Id
    INNER JOIN Produtos p ON p.Id = ip.ProdutoId
    WHERE pe.DataPedido BETWEEN @DataInicio AND @DataFim
    GROUP BY pe.Id, c.Nome, pe.DataPedido, pe.ValorTotal, pe.Status
    ORDER BY pe.DataPedido DESC;
END;
GO

PRINT 'Stored Procedures criadas com sucesso!';
