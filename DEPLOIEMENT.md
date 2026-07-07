# 🚀 Déploiement professionnel de Boostify

Ce guide explique comment mettre le site Boostify en ligne de manière professionnelle et stable.

---

## 📋 Prérequis

Avant de commencer, tu as besoin de :

1. **Compte GitHub** (gratuit) : https://github.com
2. **Compte Render** (gratuit) : https://render.com *(recommandé)*
3. **Base de données MongoDB** (gratuite) : https://www.mongodb.com/atlas
4. (Optionnel) **Nom de domaine** : Namecheap, OVH, GoDaddy, etc.

---

## 🎯 Options de déploiement

| Option | Difficulté | Coût | Recommandé pour |
|--------|-----------|------|-----------------|
| **Render.com** | Facile | Gratuit | Démarrage rapide, tests, petit trafic |
| **Docker + VPS** | Moyen | 5-10$/mois | Production, haute disponibilité |
| **Alwaysdata** | Facile | Gratuit | Hébergement français |

---

## 🛠️ Option 1 : Déploiement rapide sur Render.com (recommandé)

### Étape 1 : Préparer le projet

1. Modifie le fichier `.env` avec tes vraies informations :
```bash
cp .env.example .env
nano .env
```

2. Remplis au minimum :
- `MONGODB_URI`
- `ADMIN_PASSWORD` (change-le !)
- `SMTP_USER` et `SMTP_PASS` (pour Gmail, utilise un mot de passe d'application)
- `NOTIFICATION_EMAIL`
- `FROM_EMAIL`
- `SITE_URL` (URL que Render te donnera)

### Étape 2 : Pousser sur GitHub

```bash
git init
git add .
git commit -m "Boostify v2.0 - Déploiement production"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/boostify-website.git
git push -u origin main
```

Ou utilise le script automatique :
```bash
./scripts/deploy-render.sh
```

### Étape 3 : Créer le service sur Render

1. Va sur https://dashboard.render.com
2. Clique sur **New +** → **Web Service**
3. Connecte ton compte GitHub et choisis le dépôt `boostify-website`
4. Remplis :
   - **Name** : `boostify-website`
   - **Region** : `Frankfurt (EU Central)` ou la plus proche
   - **Branch** : `main`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : `Free`
5. Dans l'onglet **Environment**, ajoute les variables du fichier `.env`
6. Clique sur **Create Web Service**

### Étape 4 : Attendre le déploiement

Render va automatiquement :
- Installer les dépendances
- Lancer le serveur
- Vérifier la santé avec `/api/health`
- Te donner une URL : `https://boostify-website.onrender.com`

### Étape 5 : Vérifier

- Ouvre l'URL dans ton navigateur
- Teste le formulaire de commande
- Connecte-toi à l'admin : `/admin`
- Vérifie que tu reçois les emails

---

## 🐳 Option 2 : Déploiement avec Docker (professionnel)

### Prérequis

- Docker et Docker Compose installés

### Lancer en local avec Docker

```bash
cd boostify-website
cp .env.example .env
# Modifie .env avec tes informations
docker-compose up -d
```

Le site sera accessible sur `http://localhost:3000` avec MongoDB intégrée.

### Déployer sur un VPS avec Docker

1. Loue un VPS (DigitalOcean, AWS Lightsail, OVH, etc.)
2. Installe Docker et Docker Compose
3. Clone le projet :
```bash
git clone https://github.com/TON_USERNAME/boostify-website.git
cd boostify-website
```
4. Configure le fichier `.env`
5. Lance :
```bash
docker-compose up -d
```
6. Installe Nginx avec SSL (Certbot) pour rediriger le domaine vers le port 3000

---

## 🌐 Option 3 : Ajouter un nom de domaine personnalisé

### Sur Render

1. Dans le dashboard Render, clique sur ton service
2. Va dans **Settings** → **Custom Domains**
3. Ajoute ton domaine : `www.boostify.com`
4. Render te donnera une URL CNAME

### Chez ton registraire de domaine

1. Va dans la gestion DNS
2. Ajoute un enregistrement **CNAME** :
   - **Nom** : `www`
   - **Valeur** : `boostify-website.onrender.com`
3. Pour le domaine racine, redirige `boostify.com` vers `www.boostify.com`

### Attendre

La propagation DNS prend de 5 minutes à 48 heures.

---

## 🗄️ Créer une base MongoDB gratuite (MongoDB Atlas)

1. Va sur https://www.mongodb.com/atlas
2. Crée un compte gratuit
3. Crée un nouveau cluster (M0 Sandbox - gratuit)
4. Crée un utilisateur de base de données
5. Autorise l'accès depuis n'importe où (IP : `0.0.0.0/0`) pour Render
6. Récupère l'URL de connexion et remplace `<username>`, `<password>`, `<cluster>`
7. Colle l'URL dans `MONGODB_URI`

Exemple :
```
mongodb+srv://bello:password@cluster0.xxxxx.mongodb.net/boostify?retryWrites=true&w=majority
```

---

## 📧 Configurer les emails avec Gmail

1. Active l'authentification à 2 facteurs sur ton compte Gmail
2. Va sur https://myaccount.google.com/apppasswords
3. Crée un mot de passe d'application pour "Mail"
4. Utilise ce mot de passe dans `SMTP_PASS`
5. Mets ton adresse Gmail dans `SMTP_USER` et `NOTIFICATION_EMAIL`

---

## 🔒 Sécurité après déploiement

1. Change immédiatement le mot de passe admin (`ADMIN_PASSWORD`)
2. N'envoie jamais `.env` sur GitHub (il est dans `.gitignore`)
3. Utilise HTTPS (Render le fait automatiquement)
4. Limite l'accès admin par IP si possible

---

## ✅ Checklist avant lancement public

- [ ] MongoDB connectée
- [ ] Emails configurés
- [ ] Mot de passe admin changé
- [ ] Logo uploadé
- [ ] Informations de contact vérifiées
- [ ] WhatsApp testé
- [ ] Formulaire de commande testé
- [ ] Avis clients testés
- [ ] Site responsive vérifié sur mobile
- [ ] Nom de domaine configuré (optionnel)

---

## 🆘 Support

Si tu as un problème :
1. Vérifie les logs sur Render : **Logs** dans le dashboard
2. Vérifie que toutes les variables d'environnement sont remplies
3. Vérifie que MongoDB est accessible depuis Render
4. Consulte le fichier `README.md` pour l'installation locale

Tu peux aussi demander de l'aide à Bello Shouaïb ou l'administrateur du projet.
