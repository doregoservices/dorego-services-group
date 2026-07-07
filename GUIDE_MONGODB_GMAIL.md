# 🛠️ Guide complet : MongoDB Atlas + Gmail pour Boostify

Ce guide te montre comment configurer gratuitement :
1. Une base de données MongoDB Atlas
2. Un compte Gmail pour envoyer/recevoir les emails automatiques

---

# PARTIE 1 : Créer MongoDB Atlas (Base de données gratuite)

## Étape 1 : Créer un compte MongoDB Atlas

1. Va sur https://www.mongodb.com/atlas
2. Clique sur **Try Free** ou **Start Free**
3. Crée un compte avec :
   - Ton email
   - Un mot de passe
   - Ou connecte-toi avec Google

## Étape 2 : Créer un cluster gratuit

1. Après connexion, MongoDB te propose de créer un cluster
2. Choisis **M0 Sandbox** (c'est gratuit à vie)
3. Choisis le fournisseur cloud : **AWS** ou **Google Cloud**
4. Choisis la région la plus proche : **Paris** ou **Frankfurt** (Europe)
5. Clique sur **Create Deployment**
6. Attends 1-3 minutes que le cluster soit créé

## Étape 3 : Créer un utilisateur de base de données

1. Dans le tableau de bord MongoDB, clique sur **Database Access** (dans le menu de gauche)
2. Clique sur **+ Add New Database User**
3. Remplis :
   - **Authentication Method** : Password
   - **Username** : `boostify_user` (par exemple)
   - **Password** : un mot de passe fort (note-le bien)
   - **Database User Privileges** : Read and write to any database
4. Clique sur **Add User**

## Étape 4 : Autoriser les connexions

1. Clique sur **Network Access** (menu de gauche)
2. Clique sur **+ Add IP Address**
3. Choisis **Allow Access from Anywhere**
4. Clique sur **Confirm**

> ⚠️ Cela permet à Render.com de se connecter. C'est acceptable pour commencer, mais en production avancée, limite aux IP de Render.

## Étape 5 : Récupérer l'URL de connexion

1. Retourne sur **Database** (menu de gauche)
2. Clique sur **Connect** à côté de ton cluster
3. Choisis **Drivers**
4. Choisis **Node.js** et la version **4.1 or later**
5. Tu vois une URL comme celle-ci :

```
mongodb+srv://boostify_user:<password>@cluster0.xxxxx.mongodb.net/boostify?retryWrites=true&w=majority
```

6. Remplace `<password>` par le mot de passe de l'utilisateur créé à l'étape 3
7. Remplace `boostify` à la fin par le nom de ta base (ex: `boostify`)

Exemple final :
```
mongodb+srv://boostify_user:MonSuperMotDePasse123@cluster0.abc123.mongodb.net/boostify?retryWrites=true&w=majority
```

## Étape 6 : Configurer dans Boostify

1. Ouvre le fichier `.env` de ton projet Boostify
2. Remplace la ligne vide par :

```env
MONGODB_URI=mongodb+srv://boostify_user:MonSuperMotDePasse123@cluster0.abc123.mongodb.net/boostify?retryWrites=true&w=majority
```

3. Sauvegarde le fichier

---

# PARTIE 2 : Configurer Gmail pour les emails automatiques

## Étape 1 : Activer l'authentification à 2 facteurs

1. Va sur https://myaccount.google.com
2. Connecte-toi avec le compte Gmail que tu veux utiliser
3. Clique sur **Sécurité** dans le menu de gauche
4. Cherche **Validation en 2 étapes**
5. Clique sur **Activer** et suis les étapes
6. Choisis une méthode : SMS, appel, ou application Google Authenticator

> ⚠️ Sans l'authentification à 2 facteurs, tu ne peux pas créer de mot de passe d'application.

## Étape 2 : Créer un mot de passe d'application

1. Toujours dans **Sécurité** de Google
2. Cherche **Mots de passe d'application** (ou va directement sur https://myaccount.google.com/apppasswords)
3. Clique sur **Sélectionner l'application** → choisis **Autre (nom personnalisé)**
4. Donne un nom : `Boostify Website`
5. Clique sur **Générer**
6. Google affiche un mot de passe de 16 caractères (ex: `abcd efgh ijkl mnop`)
7. **Note ce mot de passe** (copie-le sans les espaces)

## Étape 3 : Configurer dans Boostify

1. Ouvre le fichier `.env`
2. Remplace les valeurs suivantes :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tonemail@gmail.com
SMTP_PASS=abcdefghiklmnop  # le mot de passe d'application SANS espaces
NOTIFICATION_EMAIL=tonemail@gmail.com
FROM_EMAIL=tonemail@gmail.com
```

3. Sauvegarde le fichier

---

# PARTIE 3 : Tester en local

## Étape 1 : Lancer le serveur

```bash
cd boostify-website
npm install
npm start
```

## Étape 2 : Vérifier la connexion MongoDB

Ouvre dans le navigateur :
```
http://localhost:3000/api/health
```

Tu dois voir :
```json
{"success": true, "message": "Boostify API is running", "database": "connected"}
```

Si `database` est `disconnected`, vérifie ton `MONGODB_URI`.

## Étape 3 : Tester une commande

1. Va sur http://localhost:3000
2. Remplis le formulaire de commande avec ton vrai email
3. Clique sur **Envoyer la demande**
4. Vérifie que tu reçois :
   - Un email de notification sur Gmail (celui de `NOTIFICATION_EMAIL`)
   - Un email de confirmation sur l'adresse que tu as mise dans le formulaire

> 📧 L'email peut arriver dans les spams les premières fois. Vérifie le dossier Spam.

---

# PARTIE 4 : Variables .env finales pour le déploiement

Voici à quoi doit ressembler ton fichier `.env` complet avant de déployer sur Render :

```env
# Serveur
PORT=3000
SITE_URL=https://boostify-website.onrender.com

# Base de données MongoDB
MONGODB_URI=mongodb+srv://boostify_user:MonSuperMotDePasse123@cluster0.abc123.mongodb.net/boostify?retryWrites=true&w=majority

# Sécurité Admin
ADMIN_PASSWORD=MonMotDePasseAdminTresFort2024
SESSION_SECRET=UneChaineAleatoireTresLongue123456789

# Email Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tonemail@gmail.com
SMTP_PASS=abcdefghiklmnop
NOTIFICATION_EMAIL=tonemail@gmail.com
FROM_EMAIL=tonemail@gmail.com

# WhatsApp
WHATSAPP_NUMBER=2250161498523
```

---

# PARTIE 5 : Ajouter les variables sur Render.com

1. Va sur https://dashboard.render.com
2. Clique sur ton service Web
3. Va dans l'onglet **Environment**
4. Ajoute chaque variable du fichier `.env`
5. Pour `SMTP_PASS`, clique sur **Lock** pour la cacher
6. Clique sur **Save Changes**
7. Redéploie le service si nécessaire

---

# ❌ Problèmes fréquents

## "database": "disconnected"
- Vérifie que `MONGODB_URI` est correct
- Vérifie que l'utilisateur a les droits Read/Write
- Vérifie que Network Access est sur "Allow Access from Anywhere"
- Vérifie que le mot de passe ne contient pas de caractères spéciaux non encodés

## Les emails ne partent pas
- Vérifie que l'authentification 2FA est activée sur Gmail
- Vérifie que tu utilises un **mot de passe d'application**, pas ton mot de passe Gmail normal
- Vérifie dans le dossier Spam
- Vérifie que `SMTP_USER` et `NOTIFICATION_EMAIL` sont bien remplis

## Erreur "Less secure app access"
- Cette option n'existe plus sur Gmail
- Tu dois obligatoirement utiliser un **mot de passe d'application**

---

# ✅ Checklist finale

- [ ] Compte MongoDB Atlas créé
- [ ] Cluster M0 gratuit créé
- [ ] Utilisateur base de données créé
- [ ] Network Access configuré
- [ ] MONGODB_URI copiée dans `.env`
- [ ] Authentification 2FA activée sur Gmail
- [ ] Mot de passe d'application Gmail créé
- [ ] Variables SMTP dans `.env`
- [ ] Test local réussi (`database: connected`)
- [ ] Test d'email réussi
- [ ] Variables ajoutées sur Render.com

---

Tu as besoin d'aide pour une étape en particulier ? Dis-moi laquelle et je t'aide. 🚀
