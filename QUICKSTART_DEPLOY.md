# ⚡ Deploy Rápido - Azure ERP Light

## ✅ Checklist Inicial

- [ ] Conta Azure criada (https://azure.microsoft.com/)
- [ ] Azure CLI instalado (`az --version`)
- [ ] Git instalado
- [ ] Node.js 18+ instalado

---

## 🔐 Passo 1: Login no Azure

```powershell
az login
```

Isso abrirá uma aba no navegador. Faça login com sua conta Microsoft/Azure.

---

## 📁 Passo 2: Criar Infraestrutura

```powershell
# Definir variáveis
$resourceGroup = "erp-light-rg"
$location = "eastus"  # ou brazilsouth, westeurope, etc

# 1. Criar grupo de recursos
az group create `
  --name $resourceGroup `
  --location $location

# 2. Criar plano App Service
az appservice plan create `
  --name erp-light-plan `
  --resource-group $resourceGroup `
  --sku B1 `
  --is-linux

# 3. Criar App Service para Frontend
az webapp create `
  --resource-group $resourceGroup `
  --plan erp-light-plan `
  --name erp-light-frontend `
  --runtime "node|18-lts"

# 4. Criar App Service para Backend (se tiver .NET)
az webapp create `
  --resource-group $resourceGroup `
  --plan erp-light-plan `
  --name erp-light-backend `
  --runtime "DOTNET|8.0"

# 5. Criar SQL Server
az sql server create `
  --resource-group $resourceGroup `
  --name erp-light-server `
  --admin-user sqladmin `
  --admin-password "SenhaForte123!@"

# 6. Criar Banco de Dados
az sql db create `
  --resource-group $resourceGroup `
  --server erp-light-server `
  --name ERPLightDB `
  --edition Standard `
  --capacity 10
```

---

## 🏗️ Passo 3: Build da Aplicação

```powershell
# Instalar dependências
npm install

# Compilar para produção
npm run build

# Resultado: /dist com arquivos estáticos prontos
```

---

## 🚀 Passo 4: Deploy do Frontend

```powershell
# Copiar web.config para dist/
Copy-Item -Path ".\web.config" -Destination ".\dist\web.config" -Force

# Compactar
Compress-Archive -Path "dist/*" -DestinationPath "frontend.zip" -Force

# Deploy
az webapp deployment source config-zip `
  --resource-group erp-light-rg `
  --name erp-light-frontend `
  --src ./frontend.zip

# ✅ Resultado: https://erp-light-frontend.azurewebsites.net
```

---

## 🔗 Passo 5: Configurar CORS (Backend)

Se tiver backend, configure no Portal Azure:

1. Vá em **App Service > erp-light-backend > Configuração > Configurações da Aplicação**
2. Adicione:
   ```
   Cors__AllowedOrigins = https://erp-light-frontend.azurewebsites.net
   ```

---

## 🗄️ Passo 6: SQL Server - Abrir Firewall

```powershell
# Obter seu IP público
(Invoke-WebRequest -Uri "https://ifconfig.me").Content

# Liberar seu IP (no SQL Server)
az sql server firewall-rule create `
  --resource-group erp-light-rg `
  --server erp-light-server `
  --name AllowMyIP `
  --start-ip-address SEU_IP_AQUI `
  --end-ip-address SEU_IP_AQUI

# Liberar serviços Azure (recomendado)
az sql server firewall-rule create `
  --resource-group erp-light-rg `
  --server erp-light-server `
  --name AllowAzureServices `
  --start-ip-address 0.0.0.0 `
  --end-ip-address 0.0.0.0
```

---

## 📊 Passo 7: Executar Scripts SQL

Connection String para conectar ao banco:
```
Server=tcp:erp-light-server.database.windows.net,1433;
Initial Catalog=ERPLightDB;
Persist Security Info=False;
User ID=sqladmin;
Password=SenhaForte123!@;
Encrypt=True;
TrustServerCertificate=False;
```

Execute em ordem os scripts SQL:
1. `docs/sql/01-create-tables.sql`
2. `docs/sql/02-procedures.sql`
3. `docs/sql/03-triggers.sql`
4. `docs/sql/04-seed-data.sql`
5. `docs/sql/05-rbac-tables.sql`

---

## 🧪 Passo 8: Testar

```powershell
# Acessar frontend
Start-Process "https://erp-light-frontend.azurewebsites.net"

# Ver logs em tempo real
az webapp log tail `
  --resource-group erp-light-rg `
  --name erp-light-frontend
```

---

## 📈 Monitorar Custos

```powershell
# Ver estimativa de custo mensal
az cost management query create `
  --scope "/subscriptions/{subscription-id}" `
  --timeframe MonthToDate `
  --granularity Monthly
```

**Custos típicos:**
- App Service B1 (2x): ~$15-20/mês cada
- SQL Database Standard: ~$20-30/mês
- **Total: ~$50-70/mês**

Para **economizar**: use **Free tier** em desenvolvimento!

---

## 🆘 Troubleshooting

### Frontend não carrega
```powershell
# Verificar logs
az webapp log tail -g erp-light-rg -n erp-light-frontend

# Reiniciar app
az webapp restart -g erp-light-rg -n erp-light-frontend
```

### Banco não conecta
```powershell
# Verificar regras de firewall
az sql server firewall-rule list -g erp-light-rg -n erp-light-server

# Liberar todos os serviços Azure
az sql server firewall-rule create `
  --resource-group erp-light-rg `
  --server erp-light-server `
  --name AzureServices `
  --start-ip-address 0.0.0.0 `
  --end-ip-address 0.0.0.0
```

### CORS error 403
Backend precisa configurar:
```
Access-Control-Allow-Origin: https://erp-light-frontend.azurewebsites.net
```

---

## 📚 Referências
- [Documentação Completa](./DEPLOYMENT_AZURE.md)
- [Azure App Service](https://learn.microsoft.com/pt-br/azure/app-service/)
- [Azure SQL Database](https://learn.microsoft.com/pt-br/azure/azure-sql/)
- [Azure CLI Reference](https://learn.microsoft.com/pt-br/cli/azure/)

---

## 🎯 Próximas Etapas

1. ✅ Infraestrutura criada
2. ✅ Frontend deployado
3. ⬜ Backend deployado (se aplicável)
4. ⬜ Configurar domínio customizado
5. ⬜ Configurar backup automático
6. ⬜ Setup monitoramento e alertas

---

**Dúvidas?** Veja o guia completo em [DEPLOYMENT_AZURE.md](./DEPLOYMENT_AZURE.md)
