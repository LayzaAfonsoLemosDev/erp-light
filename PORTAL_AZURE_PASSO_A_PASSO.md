# 📋 Guia Passo-a-Passo - Deploy no Azure Portal

**Status:** ✅ Arquivo de deploy já preparado: `erp-light-frontend.zip` (0.26 MB)

---

## 🔐 Passo 1: Fazer Login no Azure

1. Vá a https://portal.azure.com
2. Clique em **"Entrar"** ou use uma conta existente
3. Se não tiver conta, crie uma nova (gratuita)

---

## 📁 Passo 2: Criar Grupo de Recursos

1. No menu lateral, clique em **"Grupos de recursos"**
2. Clique em **"+ Criar"**
3. Preencha:
   - **Nome**: `erp-light-rg`
   - **Região**: `East US` (ou mais próxima de você)
4. Clique em **"Revisar + criar"** → **"Criar"**

---

## 🏗️ Passo 3: Criar App Service Plan

1. Pesquise por **"App Service Plans"** na barra de pesquisa
2. Clique em **"+ Criar"**
3. Preencha:
   - **Grupo de Recursos**: `erp-light-rg`
   - **Nome**: `erp-light-plan`
   - **Sistema Operacional**: `Linux`
   - **Preço**: `B1` (mais barato: ~$10/mês)
4. Clique em **"Criar"**

---

## 🌐 Passo 4: Criar App Service (Frontend)

1. Pesquise por **"App Services"** 
2. Clique em **"+ Criar"**
3. Preencha:
   - **Grupo de Recursos**: `erp-light-rg`
   - **Nome**: `erp-light-frontend` (seu app terá URL: https://erp-light-frontend.azurewebsites.net)
   - **Publicar**: `Código`
   - **Stack Runtime**: `Node 18 LTS`
   - **App Service Plan**: `erp-light-plan (Linux, B1)`
4. Clique em **"Criar"**

---

## 🚀 Passo 5: Deploy do Frontend (ZIP)

Quando o App Service estiver criado:

1. Entre no App Service `erp-light-frontend`
2. No menu lateral, vá a **"Deployment Center"**
3. Escolha **"Local Git"** ou **"ZIP Deploy"**
4. Clique em **"Authorize"** se pedido
5. Você verá uma URL como:
   ```
   https://erp-light-frontend.scm.azurewebsites.net/api/zipdeploy
   ```

### Fazer Upload do ZIP (PowerShell)

No VS Code terminal, execute:

```powershell
$resourceGroup = "erp-light-rg"
$appName = "erp-light-frontend"

# Obter credenciais de publish
$publishProfile = az webapp deployment list-publishing-credentials `
  --resource-group $resourceGroup `
  --name $appName `
  --query "{username:publishingUserName, password:publishingPassword}" -o json | ConvertFrom-Json

# Upload do arquivo ZIP
$auth = [Convert]::ToBase64String(
  [System.Text.Encoding]::ASCII.GetBytes(
    "$($publishProfile.username):$($publishProfile.password)"
  )
)

$zipPath = "erp-light-frontend.zip"
$uri = "https://$appName.scm.azurewebsites.net/api/zipdeploy"

Invoke-WebRequest -Uri $uri `
  -Headers @{Authorization = "Basic $auth"} `
  -InFile $zipPath `
  -ContentType "application/zip" `
  -Method Post

Write-Host "✓ Deploy concluído!" -ForegroundColor Green
```

**OU** no Portal do Azure:
1. Vá a **"Deployment Center"**
2. Clique em **"Upload"** (se disponível)
3. Selecione `erp-light-frontend.zip`
4. Aguarde conclusão

---

## 🗄️ Passo 6: Criar SQL Database (Backend - Opcional por agora)

Se quiser banco de dados:

1. Pesquise **"SQL Databases"**
2. Clique em **"+ Criar"**
3. Preencha:
   - **Grupo de Recursos**: `erp-light-rg`
   - **Nome do Banco**: `ERPLightDB`
   - **Servidor**: Clique em criar novo
     - **Nome do servidor**: `erp-light-server` 
     - **Admin**: `sqladmin`
     - **Senha**: `SenhaForte123!@` (salve em lugar seguro!)
4. Preço: Free tier (primeiros 12 meses) ou `Standard` (~$20/mês)
5. Clique em **"Revisar + criar"** → **"Criar"**

---

## ✅ Verificar Deploy

Após o deploy, acesse:
```
https://erp-light-frontend.azurewebsites.net
```

Se tudo estiver funcionando, você verá a aplicação ERP!

---

## 📊 Monitorar

No App Service:
1. **Application Insights**: Ver logs e performance
2. **Diagnose and solve problems**: Se houver erro
3. **Metrics**: CPU, memória, requisições

---

## 💡 Opcional - Configurar Domínio Customizado

1. No App Service, vá a **"Custom domains"**
2. Clique em **"Add custom domain"**
3. Digite seu domínio (ex: `erp.exemplo.com`)
4. Configure o DNS do seu provedor de domínio
5. Clique em **"Validate"** → **"Add"**

---

## 💰 Verificar Custos

No Portal do Azure:
1. Pesquise **"Cost Management"**
2. Veja estimativa mensal de gastos

**Estimativa:**
- App Service (B1): ~$10-15/mês
- SQL Database (se criado): ~$20-30/mês

---

## 🆘 Se algo der errado

### Erro 500 no site
1. Vá ao App Service
2. **"App Service Logs"** → Enable
3. **"Log Stream"** para ver o erro em tempo real

### Deploy não aparece
1. Vá a **"Deployment Center"**
2. Verifique o histórico de deploys
3. Clique no deploy para ver logs

### Precisa fazer logout
1. No App Service, vá a **"SSH"**
2. Conecte e execute: `rm -rf /home/site/wwwroot/*`
3. Faça novo upload do ZIP

---

## 🎯 Próximos Passos

1. ✅ **Hoje**: Deploy do Frontend
2. ⬜ **Depois**: Deploy Backend .NET (se aplicável)
3. ⬜ **Depois**: Configurar SQL Database
4. ⬜ **Depois**: Certificado SSL (já vem com .azurewebsites.net)

---

## 📞 Precisa de ajuda?

- **Documentação Azure**: https://learn.microsoft.com/pt-br/azure/
- **Suporte do Azure**: https://azure.microsoft.com/pt-br/support/

---

**Status do seu projeto:**
```
✅ npm install  - Dependências instaladas
✅ npm run build - Frontend compilado
✅ web.config adicionado - React Router configurado
✅ erp-light-frontend.zip - Pronto para deploy

Próximo passo: Fazer Upload do ZIP no Azure Portal
```
