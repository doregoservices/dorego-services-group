#!/bin/bash
# Script de déploiement professionnel sur Render.com

set -e

echo "🚀 Déploiement de Boostify sur Render.com"
echo ""

# Vérifications
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé. Installe-le d'abord."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm n'est pas installé."
    exit 1
fi

# Vérifier le fichier .env
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env non trouvé. Copie .env.example en .env et configure-le."
    cp .env.example .env
    echo "✅ Fichier .env créé. Modifie-le avant de continuer."
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Tests basiques
echo "🧪 Vérification des fichiers..."
if [ ! -f server/server.js ]; then
    echo "❌ Fichier server/server.js manquant."
    exit 1
fi

if [ ! -f public/index.html ]; then
    echo "❌ Fichier public/index.html manquant."
    exit 1
fi

echo "✅ Vérifications OK"

# Demander les infos GitHub si non configurées
read -p "Entrez votre nom d'utilisateur GitHub : " GITHUB_USER
read -p "Entrez le nom du dépôt (ex: boostify-website) : " REPO_NAME

# Initialiser git si nécessaire
if [ ! -d .git ]; then
    git init
    git branch -M main
fi

# Ajouter le remote
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

# Commit et push
git add .
git commit -m "Déploiement Boostify v2.0 - $(date '+%Y-%m-%d %H:%M')" || true
git push -u origin main

echo ""
echo "✅ Projet poussé sur GitHub !"
echo ""
echo "Prochaines étapes sur Render.com :"
echo "1. Va sur https://dashboard.render.com"
echo "2. New + → Web Service"
echo "3. Choisis le dépôt ${REPO_NAME}"
echo "4. Configure les variables d'environnement dans l'onglet Environment"
echo "5. Clique sur Create Web Service"
echo ""
echo "Variables d'environnement à ajouter :"
grep -E '^[A-Z_]+=' .env | sed 's/^/  - /'
