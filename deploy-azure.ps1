# Script de Deploy Automático para Azure
# Uso: .\deploy-azure.ps1

param(
    [string]$Environment = "production",
    [string]$ResourceGroup = "erp-light-rg",
    [string]$FrontendAppName = "erp-light-frontend",
    [string]$BackendAppName = "erp-light-backend"
)

Write-Host "🚀 Iniciando deploy ERP Light para Azure..." -ForegroundColor Cyan

# Verificar se estamos logado no Azure
$azureAccount = az account show 2>$null
if (-not $azureAccount) {
    Write-Host "❌ Você não está logado no Azure. Execute: az login" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Conta Azure verificada" -ForegroundColor Green

# ====== BUILD DO FRONTEND ======
Write-Host "`n📦 Compilando Frontend React..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao compilar" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend compilado com sucesso" -ForegroundColor Green

# ====== PREPARAR ARQUIVO DE DEPLOY ======
Write-Host "`n📦 Preparando arquivo de deploy..." -ForegroundColor Cyan

# Copiar web.config para dist/
Copy-Item -Path ".\web.config" -Destination ".\dist\web.config" -Force
Write-Host "✓ web.config adicionado ao dist/" -ForegroundColor Green

# Criar ZIP do frontend
$zipPath = "./frontend-deploy.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath }

Compress-Archive -Path "dist/*" -DestinationPath $zipPath -Force
Write-Host "✓ Frontend compactado: $zipPath" -ForegroundColor Green

# ====== DEPLOY DO FRONTEND ======
Write-Host "`n🚀 Fazendo deploy do Frontend..." -ForegroundColor Cyan
az webapp deployment source config-zip `
    --resource-group $ResourceGroup `
    --name $FrontendAppName `
    --src $zipPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend deployado com sucesso!" -ForegroundColor Green
    Write-Host "   URL: https://$FrontendAppName.azurewebsites.net" -ForegroundColor Yellow
} else {
    Write-Host "❌ Erro ao fazer deploy do frontend" -ForegroundColor Red
    exit 1
}

# ====== VERIFICAR STATUS ======
Write-Host "`n🔍 Verificando status das aplicações..." -ForegroundColor Cyan

$frontendState = az webapp show `
    --resource-group $ResourceGroup `
    --name $FrontendAppName `
    --query "state" `
    -o tsv

Write-Host "Frontend State: $frontendState" -ForegroundColor Cyan

# ====== LIMPEZA ======
Write-Host "`n🧹 Limpando arquivos temporários..." -ForegroundColor Cyan
Remove-Item $zipPath -Force
Write-Host "✓ Arquivos temporários removidos" -ForegroundColor Green

# ====== RESUMO FINAL ======
Write-Host "`n" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs de Acesso:" -ForegroundColor Cyan
Write-Host "   Frontend: https://$FrontendAppName.azurewebsites.net" -ForegroundColor Yellow
Write-Host "   Backend:  https://$BackendAppName.azurewebsites.net" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Testar a aplicação em produção" -ForegroundColor Gray
Write-Host "   2. Verificar logs: az webapp log tail -g $ResourceGroup -n $FrontendAppName" -ForegroundColor Gray
Write-Host "   3. Configurar domínio customizado (opcional)" -ForegroundColor Gray
Write-Host ""
