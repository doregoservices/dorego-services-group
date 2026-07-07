#!/bin/bash
# Script d'installation locale professionnelle

set -e

echo "🚀 Installation locale de Boostify"
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Télécharge-le sur https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version : $(node -v)"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Créer le fichier .env si inexistant
if [ ! -f .env ]; then
    echo "⚙️  Création du fichier .env..."
    cp .env.example .env
    echo "✅ Fichier .env créé. Configure-le si nécessaire."
fi

# Créer les dossiers nécessaires
mkdir -p server/data public/images

echo ""
echo "✅ Installation terminée !"
echo ""
echo "Lance le serveur avec :"
echo "  npm start"
echo ""
echo "Accède au site :"
echo "  http://localhost:3000"
echo ""
echo "Accède à l'admin :"
echo "  http://localhost:3000/admin"
echo "  Mot de passe par défaut : boostify2024"
