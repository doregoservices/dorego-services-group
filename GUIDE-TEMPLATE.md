# Guide : Créer un nouveau site client à partir de Boostify

> Ce guide explique comment transformer le projet Boostify en un modèle réutilisable pour créer un site par client, sans toucher au site Boostify original.

## Résumé (Option A : un site par client)

Pour chaque nouveau client, tu vas :

1. Créer un nouveau dépôt GitHub à partir du modèle Boostify.
2. Modifier les variables d'environnement sur Render pour ce nouveau dépôt.
3. Créer une nouvelle base de données MongoDB (gratuit).
4. Déployer le nouveau site sur Render.
5. Personnaliser le site depuis le panneau admin (`/admin`).

Chaque client a donc son propre site, sa propre base de données et ses propres fichiers.

---

## Étape 1 : Transformer le dépôt Boostify en "modèle GitHub"

1. Va sur GitHub : `https://github.com/doregoservices/boostify-website`
2. Clique sur **Settings** (Paramètres, en haut à droite).
3. Dans le menu de gauche, clique sur **Template repository** (ou "Dépôt modèle").
4. Coche la case **Template repository**.
5. Clique sur **Save** (Enregistrer).

Maintenant, n'importe qui peut créer un nouveau site en cliquant sur **Use this template** (Utiliser ce modèle).

---

## Étape 2 : Créer un nouveau dépôt pour un client

1. Sur la page GitHub de Boostify, clique sur le bouton vert **Use this template** → **Create a new repository**.
2. Choisis un nom pour le client, par exemple : `boostify-client-marie`.
3. Choisis si le dépôt est **Public** (visible par tout le monde) ou **Private** (visible seulement par toi).
4. Clique sur **Create repository**.

GitHub crée une copie complète du projet Boostify pour ce client.

---

## Étape 3 : Créer une base de données MongoDB pour le client

1. Va sur MongoDB Atlas : `https://www.mongodb.com/atlas`
2. Connecte-toi avec ton compte Google ou email.
3. Clique sur **New Project** → donne un nom (ex: `boostify-client-marie`) → **Next** → **Create Project**.
4. Clique sur **Build a Database**.
5. Choisis le plan gratuit **M0 Sandbox**.
6. Choisis la région la plus proche du client (pour l'Afrique, souvent **Frankfurt** ou **Paris**).
7. Clique sur **Create**.
8. Crée un utilisateur de base de données :
   - Username : `admin` (ou un autre nom)
   - Password : génère un mot de passe fort et note-le bien
9. Clique sur **Create User**.
10. Dans **Where would you like to connect from?**, clique sur **Allow Access from Anywhere** (ou ajoute l'IP de Render).
11. Clique sur **Finish and Close**.
12. Retourne sur la page du cluster, clique sur **Connect** → **Drivers** → **Node.js**.
13. Copie l'URL qui ressemble à :
    ```
    mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/boostify?retryWrites=true&w=majority
    ```
14. Remplace `PASSWORD` par le vrai mot de passe et `boostify` par le nom de la base de données client (ex: `clientmarie`).

---

## Étape 4 : Créer un nouveau service sur Render

1. Va sur Render : `https://render.com`
2. Connecte-toi avec ton compte GitHub.
3. Clique sur **New +** → **Web Service**.
4. Cherche le nouveau dépôt GitHub créé à l'étape 2 (ex: `boostify-client-marie`).
5. Clique sur **Connect**.
6. Remplis les informations :
   - **Name** : un nom pour le site, ex: `boostify-client-marie`
   - **Region** : choisis une région proche (ex: `Frankfurt`)
   - **Branch** : `main`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `node server/server.js`
7. Clique sur **Advanced** pour ajouter les variables d'environnement :

   | Clé | Valeur | Explication |
   |-----|--------|-------------|
   | `MONGODB_URI` | l'URL MongoDB copiée à l'étape 3 | Base de données du client |
   | `ADMIN_PASSWORD` | un mot de passe fort | Mot de passe pour accéder à `/admin` |
   | `SMTP_HOST` | `smtp.gmail.com` | Serveur d'envoi d'emails |
   | `SMTP_PORT` | `587` | Port SMTP |
   | `SMTP_USER` | l'email du client | Ex: `client@gmail.com` |
   | `SMTP_PASS` | mot de passe d'application Gmail | Voir étape 5 |
   | `NOTIFICATION_EMAIL` | l'email qui reçoit les commandes | Ex: `client@gmail.com` |
   | `FROM_EMAIL` | l'email d'envoi | Ex: `client@gmail.com` |
   | `SITE_URL` | l'URL du site Render | Ex: `https://boostify-client-marie.onrender.com` |

8. Clique sur **Create Web Service**.

Render va télécharger le code, installer les dépendances et démarrer le serveur. Cela prend 3 à 5 minutes.

---

## Étape 5 : Créer un mot de passe d'application Gmail (si le client utilise Gmail)

Pour que les emails de commande fonctionnent, le client doit avoir un mot de passe d'application Gmail (pas son mot de passe normal).

1. Le client se connecte à son compte Google : `https://myaccount.google.com`
2. Va dans **Sécurité** → **Vérification en deux étapes** (il faut l'activer).
3. Une fois activée, cherche **Mots de passe d'application**.
4. Choisis **Autre** → donne un nom, ex: `Boostify` → **Générer**.
5. Google affiche un mot de passe de 16 caractères (ex: `abcd efgh ijkl mnop`).
6. Copie ce mot de passe **sans les espaces** dans la variable `SMTP_PASS` sur Render.

---

## Étape 6 : Personnaliser le site du client

Une fois le déploiement terminé :

1. Ouvre le site : `https://boostify-client-marie.onrender.com`
2. Va dans l'admin : `https://boostify-client-marie.onrender.com/admin`
3. Entre le mot de passe `ADMIN_PASSWORD` que tu as choisi.
4. Dans l'onglet **Configuration**, modifie :
   - Nom du site
   - Slogan
   - Email
   - Téléphone
   - WhatsApp
   - Localisation
   - Logo
   - Couleurs
   - Texte "À propos"
   - Titre principal (héro)
5. Dans les onglets **Services**, **Packs**, **Portfolio**, ajoute/modifie/supprime ce que tu veux.

Le site du client est maintenant indépendant du site Boostify original.

---

## Étape 7 : Mettre à jour un site client plus tard

Pour modifier le code du client (ex: ajouter une nouvelle fonctionnalité) :

1. Va sur le dépôt GitHub du client.
2. Fais tes modifications (comme pour Boostify).
3. Pousse sur la branche `main`.
4. Render redéploie automatiquement.

Le site Boostify original n'est pas touché.

---

## Conseils importants

- **Garde le dépôt Boostify original intact.** Ne fais jamais de modifications directement sur le dépôt client pour toucher Boostify.
- **Chaque client a sa propre base de données MongoDB.** Les données ne se mélangent pas.
- **Note bien les mots de passe** (MongoDB, Gmail, admin) dans un endroit sûr.
- **Le plan gratuit de Render** met le site en veille après 15 minutes d'inactivité. Le premier visiteur après une longue pause attend 30 secondes que le site se réveille. C'est normal.

---

## Coût estimé (plan gratuit)

| Service | Coût |
|---------|------|
| GitHub | Gratuit |
| Render (plan gratuit) | Gratuit |
| MongoDB Atlas (M0) | Gratuit |
| Gmail | Gratuit (avec mot de passe d'application) |

Le client n'a rien à payer pour un site basique.

---

## Si tu veux le faire maintenant

Dis-moi :
1. Le **nom du client** (ex: Marie, ABC Entreprise).
2. Son **email Gmail** (pour recevoir les commandes).
3. Le **mot de passe d'application Gmail** (si tu l'as déjà).
4. Si tu veux un dépôt **Public** ou **Private**.

Je peux t'aider à créer le dépôt, la base de données et le déploiement Render étape par étape.
