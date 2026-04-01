#!/bin/bash
# Script para GitHub Push

cd "C:\Users\LayzaLemos\Downloads\erp-light"

# Adicionar remote
git remote add origin https://github.com/LayzaAfonsoLemosDev/erp-light.git

# Branch main
git branch -M main

# Push
git push -u origin main

echo "Done!"
