# Script para fazer Push no GitHub
Set-Location "C:\Users\LayzaLemos\Downloads\erp-light"

$gitPath = "C:\Program Files\Git\cmd\git.exe"

Write-Host "1. Adicionando remote..." -ForegroundColor Cyan
& $gitPath remote add origin https://github.com/LayzaAfonsoLemosDev/erp-light.git

Write-Host "2. Renomeando branch para main..." -ForegroundColor Cyan
& $gitPath branch -M main

Write-Host "3. Fazendo push..." -ForegroundColor Cyan
& $gitPath push -u origin main

Write-Host "`n✅ Feito!" -ForegroundColor Green
