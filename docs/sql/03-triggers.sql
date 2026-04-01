-- =============================================
-- ERP Light - Triggers e Jobs
-- 03 - Triggers
-- =============================================

-- Trigger: Auditoria de alterações em Clientes
CREATE OR ALTER TRIGGER trg_Clientes_Auditoria
ON Clientes
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- INSERT
    IF EXISTS (SELECT 1 FROM inserted) AND NOT EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO LogsAuditoria (Tabela, Operacao, RegistroId, DadosNovos)
        SELECT 'Clientes', 'INSERT', i.Id,
            (SELECT i.* FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
        FROM inserted i;
    END
    
    -- UPDATE
    IF EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO LogsAuditoria (Tabela, Operacao, RegistroId, DadosAntigos, DadosNovos)
        SELECT 'Clientes', 'UPDATE', i.Id,
            (SELECT d.* FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
            (SELECT i.* FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
        FROM inserted i
        INNER JOIN deleted d ON d.Id = i.Id;
        
        -- Atualizar data de modificação
        UPDATE c SET DataAtualizacao = GETDATE()
        FROM Clientes c
        INNER JOIN inserted i ON c.Id = i.Id;
    END
    
    -- DELETE
    IF NOT EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO LogsAuditoria (Tabela, Operacao, RegistroId, DadosAntigos)
        SELECT 'Clientes', 'DELETE', d.Id,
            (SELECT d.* FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
        FROM deleted d;
    END
END;
GO

-- Trigger: Atualizar valor total do pedido ao alterar itens
CREATE OR ALTER TRIGGER trg_ItensPedido_AtualizarTotal
ON ItensPedido
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @PedidoIds TABLE (PedidoId INT);
    
    INSERT INTO @PedidoIds
    SELECT DISTINCT PedidoId FROM inserted
    UNION
    SELECT DISTINCT PedidoId FROM deleted;
    
    UPDATE p
    SET p.ValorTotal = ISNULL((
        SELECT SUM(ip.Subtotal) 
        FROM ItensPedido ip 
        WHERE ip.PedidoId = p.Id
    ), 0),
    p.DataAtualizacao = GETDATE()
    FROM Pedidos p
    INNER JOIN @PedidoIds ids ON ids.PedidoId = p.Id;
END;
GO

-- Trigger: Validar estoque antes de inserir item no pedido
CREATE OR ALTER TRIGGER trg_ItensPedido_ValidarEstoque
ON ItensPedido
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Verificar estoque suficiente
    IF EXISTS (
        SELECT 1 
        FROM inserted i
        INNER JOIN Produtos p ON p.Id = i.ProdutoId
        WHERE p.Estoque < i.Quantidade
    )
    BEGIN
        RAISERROR('Estoque insuficiente para um ou mais produtos.', 16, 1);
        RETURN;
    END
    
    -- Inserir itens
    INSERT INTO ItensPedido (PedidoId, ProdutoId, Quantidade, PrecoUnitario)
    SELECT PedidoId, ProdutoId, Quantidade, PrecoUnitario
    FROM inserted;
END;
GO

-- =============================================
-- Job Simulado: Limpeza de dados antigos
-- (Em produção, seria configurado via SQL Server Agent)
-- =============================================
CREATE OR ALTER PROCEDURE sp_Job_LimpezaDadosAntigos
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @DataLimite DATETIME2 = DATEADD(YEAR, -2, GETDATE());
    
    -- Limpar logs de auditoria antigos
    DELETE FROM LogsAuditoria 
    WHERE DataOperacao < @DataLimite;
    
    -- Arquivar pedidos antigos cancelados
    -- (Em produção, mover para tabela de arquivo)
    UPDATE Pedidos 
    SET Observacoes = ISNULL(Observacoes, '') + ' [ARQUIVADO]'
    WHERE DataPedido < @DataLimite 
      AND Status = 'cancelado'
      AND Observacoes NOT LIKE '%ARQUIVADO%';
    
    PRINT 'Limpeza concluída em ' + CONVERT(NVARCHAR, GETDATE(), 120);
END;
GO

PRINT 'Triggers e Jobs criados com sucesso!';
