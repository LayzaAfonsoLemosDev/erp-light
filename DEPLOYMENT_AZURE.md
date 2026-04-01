# 🚀 Guia de Deployment - Azure

## Visão Geral do Deploy

```
┌─────────────────────────────────────────┐
│  Seu Projeto ERP Light no Azure         │
├─────────────────────────────────────────┤
│  Frontend (React)  → Azure App Service  │
│  Backend (.NET)    → Azure App Service  │
│  BD (SQL Server)   → Azure SQL Database │
└─────────────────────────────────────────┘
```

## 📋 Pré-requisitos

1. **Conta Azure** - https://azure.microsoft.com/ (crie ou acesse sua conta)
2. **Git instalado** - https://git-scm.com/
3. **Azure CLI** - https://learn.microsoft.com/pt-br/cli/azure/install-azure-cli
4. **.NET 8 SDK** - https://dotnet.microsoft.com/download/dotnet/8.0
5. **Node.js 18+** - https://nodejs.org/

## 🔧 Passo 1: Preparar o Frontend React

### 1.1 Build da aplicação
```bash
npm install
npm run build
```

Isso gera a pasta `dist/` com arquivos estáticos prontos para produção.

### 1.2 Criar arquivo `web.config` (para Azure App Service)

Crie o arquivo `web.config` na raiz do projeto:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchList" trackAllCaptures="false">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
  </system.webServer>
</configuration>
```

## 🗄️ Passo 2: Preparar o Banco de Dados SQL Server

### 2.1 Criar SQL Database no Azure

```bash
# Fazer login no Azure
az login

# Criar grupo de recursos
az group create --name erp-light-rg --location eastus

# Criar servidor SQL
az sql server create \
  --resource-group erp-light-rg \
  --name erp-light-server \
  --admin-user sqladmin \
  --admin-password "SenhaForte123!@#"

# Criar banco de dados
az sql db create \
  --resource-group erp-light-rg \
  --server erp-light-server \
  --name ERPLightDB \
  --edition Standard \
  --capacity 10
```

### 2.2 Executar scripts SQL

Conecte-se ao banco via Azure Portal e execute os scripts em ordem:
1. `docs/sql/01-create-tables.sql`
2. `docs/sql/02-procedures.sql`
3. `docs/sql/03-triggers.sql`
4. `docs/sql/04-seed-data.sql`
5. `docs/sql/05-rbac-tables.sql`

### 2.3 Permitir acesso ao seu IP

```bash
# Obter seu IP público
curl https://ifconfig.me

# Adicionar firewall rule no Azure
az sql server firewall-rule create \
  --resource-group erp-light-rg \
  --server erp-light-server \
  --name AllowMyIP \
  --start-ip-address SEU_IP \
  --end-ip-address SEU_IP
```

## 💻 Passo 3: Preparar Backend .NET

### 3.1 Atualizar Connection String

Crie/edite o arquivo `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:erp-light-server.database.windows.net,1433;Initial Catalog=ERPLightDB;Persist Security Info=False;User ID=sqladmin;Password=SenhaForte123!@#;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

### 3.2 Publicar Backend

```bash
# Ir para pasta do backend (se existir)
cd backend

# Publicar
dotnet publish -c Release -o ./publish

# Ou gerar arquivo de deployment
dotnet publish -c Release
```

## 🚀 Passo 4: Deploy no Azure App Service

### 4.1 Criar App Service para Frontend

```bash
# Criar plano App Service
az appservice plan create \
  --name erp-light-plan \
  --resource-group erp-light-rg \
  --sku B1 \
  --is-linux

# Criar app para React Frontend
az webapp create \
  --resource-group erp-light-rg \
  --plan erp-light-plan \
  --name erp-light-frontend \
  --runtime "node|18-lts"
```

### 4.2 Deploy do Frontend

```bash
# Opção 1: Via ZIP
cd dist
Compress-Archive -Path * -DestinationPath app.zip
az webapp deployment source config-zip \
  --resource-group erp-light-rg \
  --name erp-light-frontend \
  --src app.zip

# Opção 2: Via GitHub (recomendado)
# Conecte seu repositório GitHub diretamente no Portal Azure
```

### 4.3 Criar App Service para Backend .NET

```bash
# Criar app para .NET Backend
az webapp create \
  --resource-group erp-light-rg \
  --plan erp-light-plan \
  --name erp-light-backend \
  --runtime "DOTNET|8.0"
```

### 4.4 Deploy do Backend

```bash
# Via ZIP (pasta publish)
Compress-Archive -Path ./publish/* -DestinationPath backend.zip
az webapp deployment source config-zip \
  --resource-group erp-light-rg \
  --name erp-light-backend \
  --src backend.zip
```

## 🔌 Passo 5: Configurar Variáveis de Ambiente e CORS

### 5.1 No Frontend React

Crie arquivo `.env.production`:

```
VITE_API_URL=https://erp-light-backend.azurewebsites.net
VITE_ENVIRONMENT=production
```

### 5.2 No Backend .NET

Configure no Portal Azure (Configuração > Configurações da Aplicação):

```
ConnectionStrings__DefaultConnection = [sua connection string]
Cors__AllowedOrigins = https://erp-light-frontend.azurewebsites.net
JWT__Secret = [gerar uma chave segura]
JWT__Issuer = erp-light-api
JWT__Audience = erp-light-app
```

### 5.3 Gerar JWT Secret Seguro

```bash
# PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes(((1..32 | ForEach-Object {[byte](Get-Random -Minimum 0 -Maximum 256)}))) | Write-Host
```

## 🔐 Passo 6: Configurar SSL/HTTPS

```bash
# Criar certificado SSL gratuito
az webapp config ssl bind \
  --resource-group erp-light-rg \
  --name erp-light-frontend \
  --certificate-thumbprint {thumbprint}

# Redirecionar HTTP para HTTPS
az webapp config set \
  --resource-group erp-light-rg \
  --name erp-light-frontend \
  --https-only true
```

## 📊 Passo 7: Monitorar e Manutenção

### Verificar logs
```bash
az webapp log tail \
  --resource-group erp-light-rg \
  --name erp-light-frontend

az webapp log tail \
  --resource-group erp-light-rg \
  --name erp-light-backend
```

### Ver status da aplicação
```bash
az webapp show \
  --resource-group erp-light-rg \
  --name erp-light-frontend \
  --query "state"
```

## 🔄 Passo 8: Setup CI/CD (Opcional - Recomendado)

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy Frontend
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'erp-light-frontend'
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: ./dist
```

## ✅ Checklist de Deployment

- [ ] Conta Azure criada
- [ ] Grupo de recursos criado
- [ ] SQL Server e banco de dados configurados
- [ ] Scripts SQL executados
- [ ] App Service para Frontend criado
- [ ] App Service para Backend criado
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado
- [ ] SSL/HTTPS ativado
- [ ] Testes funcionando em produção
- [ ] Logs monitorados

## 🆘 Troubleshooting

| Problema | Solução |
|----------|---------|
| CORS error 403 | Verificar configuração de CORS no backend |
| Banco não conecta | Verificar IP na firewall rule do SQL |
| React routes não funcionam | Verificar se web.config está no dist/ |
| Backend timeout | Aumentar capacity do plano App Service |
| Credenciais JWT inválidas | Regenerar chaves em Configuration |

## 📚 Custos Estimados (Azure)

- **App Service** (B1): ~$10-15/mês cada (2x)
- **SQL Database** (Standard): ~$15-25/mês
- **Total**: ~$40-55/mês

Para reduzir custos, use tier **Free** durante desenvolvimento.

## 🎯 Próximos Passos

1. Fazer login na conta Azure
2. Seguir os passos 1-7 em ordem
3. Testar as URLs:
   - Frontend: https://erp-light-frontend.azurewebsites.net
   - Backend: https://erp-light-backend.azurewebsites.net/api/status

---

**Precisa de ajuda?** Verifique a documentação Azure: https://learn.microsoft.com/pt-br/azure/
