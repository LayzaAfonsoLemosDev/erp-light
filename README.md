# 🏢 ERP Light - Sistema de Gestão Comercial

> Projeto de portfólio demonstrando modernização de sistema legado para arquitetura moderna.

## 📌 Descrição

Sistema empresarial fullstack que simula um ERP real com módulos de **Clientes**, **Produtos**, **Pedidos** e **Dashboard analítico**. O projeto demonstra a migração de um sistema legado (código acoplado, SQL direto) para uma arquitetura moderna usando Clean Architecture.

## 🛠️ Tecnologias

### Frontend (React)
- **React 18** + TypeScript
- **Tailwind CSS** - Design system customizado
- **Recharts** - Gráficos e visualizações
- **React Router** - Navegação SPA
- **Lucide React** - Ícones

### Backend (.NET) - Documentação em `/docs/backend/`
- **C# / .NET 8** - Clean Architecture
- **Entity Framework Core** + **Dapper** (ORM híbrido)
- **FluentValidation** - Validação de dados
- **JWT** - Autenticação
- **Swagger** - Documentação API

### Banco de Dados - Scripts em `/docs/sql/`
- **SQL Server** - Tabelas, Procedures, Triggers, Jobs

## 📊 Funcionalidades

| Módulo | Funcionalidades |
|--------|----------------|
| **Auth** | Login JWT, controle de acesso |
| **Clientes** | CRUD completo, busca, paginação |
| **Produtos** | CRUD, controle de estoque |
| **Pedidos** | Multi-itens, cálculo automático |
| **Dashboard** | Métricas, gráficos, top produtos |

## 🔄 Migração Legado → Moderno

Documentação completa em [`docs/backend/migration-legacy.md`](docs/backend/migration-legacy.md)

## 🚀 Como Rodar

```bash
npm install
npm run dev
```

### 🌍 Deploy em Produção (Azure)

Para colocar o projeto em produção:

1. **Guia Completo**: Veja [DEPLOYMENT_AZURE.md](DEPLOYMENT_AZURE.md) para instruções passo a passo
2. **Deploy Automático**: Execute `.\deploy-azure.ps1` (PowerShell com Azure CLI)

**Resumo rápido:**
```bash
# 1. Build da aplicação
npm run build

# 2. Deploy para Azure
az webapp deployment source config-zip \
  --resource-group erp-light-rg \
  --name erp-light-frontend \
  --src ./dist

# Resultado: https://erp-light-frontend.azurewebsites.net
```

**Stack de Deployment:**
- Frontend: Azure App Service (Node.js)
- Backend: Azure App Service (.NET 8)
- BD: Azure SQL Database

## 🔐 Credenciais de Teste

| Usuário | E-mail | Senha |
|---------|--------|-------|
| Admin | admin@erp.com | admin123 |
| Operador | usuario@erp.com | user123 |

## 🎯 Competências Demonstradas

- ✅ Trabalho com sistemas legados e modernização
- ✅ Clean Architecture e SOLID
- ✅ React + TypeScript profissional
- ✅ SQL Server avançado (Procedures, Triggers)
- ✅ API REST com boas práticas
- ✅ Design System enterprise
