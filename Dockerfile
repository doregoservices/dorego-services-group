# Dockerfile professionnel pour Boostify
# Étape 1 : Image de base Node.js LTS
FROM node:20-alpine

# Étape 2 : Créer le dossier de l'application
WORKDIR /app

# Étape 3 : Copier les fichiers de dépendances
COPY package*.json ./

# Étape 4 : Installer les dépendances en production
RUN npm ci --only=production && npm cache clean --force

# Étape 5 : Copier le reste du projet
COPY . .

# Étape 6 : Créer les dossiers nécessaires
RUN mkdir -p public/images server/data

# Étape 7 : Exposer le port
EXPOSE 3000

# Étape 8 : Lancer l'application
CMD ["npm", "start"]
