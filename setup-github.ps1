# Script de Clone e Push para GitHub
# Uso: .\setup-github.ps1 "SEU_USUARIO_GITHUB" "SEU_EMAIL"

param(
    [string]$GitHubUser = "lazalemos",
    [string]$GitEmail = "layza@erp.com"
)

Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Setup GitHub - ERP Light                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ====== PASSO 1: CONFIGURAR GIT ======
Write-Host "📝 Configurando Git..." -ForegroundColor Yellow
git config --global user.name "Layza Lemos"
git config --global user.email $GitEmail
Write-Host "✓ Git configurado!" -ForegroundColor Green
Write-Host ""

# ====== PASSO 2: INICIALIZAR REPOSITÓRIO ======
Write-Host "🗂️  Inicializando repositório Git..." -ForegroundColor Yellow

# Se já existe .git, vai pular
if (Test-Path .git) {
    Write-Host "✓ Já existe repositório Git" -ForegroundColor Green
} else {
    git init
    Write-Host "✓ Repositório inicializado!" -ForegroundColor Green
}
Write-Host ""

# ====== PASSO 3: ADICIONAR ARQUIVOS ======
Write-Host "📦 Adicionando arquivos..." -ForegroundColor Yellow
git add .
Write-Host "✓ Arquivos adicionados!" -ForegroundColor Green
Write-Host ""

# ====== PASSO 4: FAZER COMMIT ======
Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
git commit -m "Initial commit: ERP Light project - React + TypeScript" -q
Write-Host "✓ Commit feito!" -ForegroundColor Green
Write-Host ""

# ====== PASSO 5: CONFIGURAR REMOTE ======
Write-Host "🌐 Configurando repositório remoto..." -ForegroundColor Yellow

# Seu usuário do GitHub
$repoUrl = "https://github.com/$GitHubUser/erp-light.git"
Write-Host "   URL: $repoUrl" -ForegroundColor Cyan

# Se já existe remote, vai pular
if (git remote | findstr "origin") {
    Write-Host "✓ Remote já existe" -ForegroundColor Green
    git remote set-url origin $repoUrl
} else {
    git remote add origin $repoUrl
    Write-Host "✓ Remote configurado!" -ForegroundColor Green
}
Write-Host ""

# ====== PASSO 6: MUDAR PARA MAIN E FAZER PUSH ======
Write-Host "📤 Preparando para enviar..." -ForegroundColor Yellow

# Renomear branch para main se estiver em master
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -eq "master") {
    git branch -M main
    Write-Host "✓ Branch renomeada para main" -ForegroundColor Green
} else {
    Write-Host "✓ Branch é: $currentBranch" -ForegroundColor Green
}

Write-Host ""
Write-Host "⚠️  IMPORTANTE: Você precisará fazer login no GitHub!" -ForegroundColor Yellow
Write-Host "   Uma janela do navegador vai abrir..." -ForegroundColor Yellow
Write-Host ""

# ====== FAZER PUSH ======
Write-Host "🚀 Enviando para GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ SUCESSO! Repositório no GitHub             ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host ""
Write-Host "📍 Seu repositório: https://github.com/$GitHubUser/erp-light" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Próximo passo: Deploy no Vercel" -ForegroundColor Cyan
Write-Host "   1. Acesse https://vercel.com" -ForegroundColor Gray
Write-Host "   2. Clique em New Project" -ForegroundColor Gray
Write-Host "   3. Selecione erp-light" -ForegroundColor Gray
Write-Host "   4. Deploy automático!" -ForegroundColor Gray
Write-Host ""
