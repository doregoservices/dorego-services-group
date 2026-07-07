# 🔧 Dépanage MongoDB : Je n'arrive pas à me connecter

Si tu vois `"database": "disconnected"` ou une erreur, suis ces étapes.

---

## Étape 1 : Vérifier l'URI

Ton URI doit ressembler à ça :

```
mongodb+srv://NOM_UTILISATEUR:MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/boostify?retryWrites=true&w=majority
```

### ❌ Erreurs courantes

1. **Mot de passe avec caractères spéciaux**
   - Si ton mot de passe contient `@`, `#`, `/`, `+`, `&`, `%`, il faut l'encoder
   - Exemple : `Mon@Passe` devient `Mon%40Passe`
   - Solution : change ton mot de passe MongoDB pour un sans caractères spéciaux

2. **Mauvais nom de cluster**
   - Vérifie que `cluster0.xxxxx` correspond bien à ton cluster

3. **Espaces dans le mot de passe**
   - MongoDB Atlas génère parfois des mots de passe avec des espaces
   - Supprime les espaces dans l'URI

4. **Nom de base de données manquant**
   - Vérifie qu'il y a bien `/boostify?` avant `retryWrites`

---

## Étape 2 : Vérifier Network Access (IP)

1. Va sur MongoDB Atlas : https://cloud.mongodb.com
2. Clique sur **Network Access** dans le menu de gauche
3. Vérifie que tu as une règle : `0.0.0.0/0` (Allow Access from Anywhere)
4. Si ce n'est pas le cas, clique sur **+ Add IP Address** → **Allow Access from Anywhere** → **Confirm**

> ⚠️ Cette étape est la cause la plus fréquente des problèmes de connexion.

---

## Étape 3 : Vérifier l'utilisateur Database Access

1. Va sur **Database Access** dans le menu de gauche
2. Vérifie que ton utilisateur existe
3. Vérifie que les privilèges sont **Read and write to any database**
4. Si tu as un doute, supprime l'utilisateur et recréez-en un nouveau

---

## Étape 4 : Vérifier que le cluster est prêt

1. Va sur **Database** → **Clusters**
2. Vérifie que le statut est **Active** (vert)
3. Si ce n'est pas le cas, attends 1-2 minutes

---

## Étape 5 : Tester avec le script de diagnostic

Dans ton projet Boostify, exécute :

```bash
cd boostify-website
npm install
node scripts/test-config.js
```

Ce script te dira exactement ce qui ne va pas.

---

## Étape 6 : Solution ultime - Recréer un mot de passe simple

Si rien ne marche, fais ceci :

1. Sur MongoDB Atlas, va dans **Database Access**
2. Supprime ton utilisateur actuel
3. Crée un nouvel utilisateur avec :
   - Username : `boostify_user`
   - Password : un mot de passe simple sans caractères spéciaux
   - Exemple : `BoostifyDb2024`
4. Récupère la nouvelle URI
5. Mets-la dans `.env`
6. Relance le serveur

---

## Étape 7 : Vérifier les logs du serveur

Si le serveur est lancé, regarde les messages dans le terminal :

```bash
cd boostify-website
npm start
```

Tu verras des messages comme :
- `✅ Connecté à MongoDB` (connexion OK)
- `❌ Erreur connexion MongoDB` (problème)

Lisez le message d'erreur exact, il t'indiquera la cause.

---

## 🆘 Si vraiment ça ne marche pas

Supabase est plus simple à configurer. Je peux adapter le code de Boostify pour Supabase. Dis-moi si tu veux cette solution alternative.

---

## ✅ Checklist de dépannage

- [ ] L'URI est correcte et complète
- [ ] Le mot de passe ne contient pas de caractères spéciaux non encodés
- [ ] Network Access est sur `0.0.0.0/0`
- [ ] L'utilisateur a les droits Read/Write
- [ ] Le cluster est actif (vert)
- [ ] Le fichier `.env` est sauvegardé
- [ ] Le serveur a été relancé après modification du `.env`
