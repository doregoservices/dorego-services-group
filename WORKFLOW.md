# 🔄 Workflow d'une commande sur Boostify

Ce document explique étape par étape ce qui se passe quand un client passe une commande sur le site.

---

## 1. Le client visite le site

- Le client arrive sur `http://localhost:3000` (ou le site en ligne plus tard).
- Il voit les services, les packs et les réalisations.
- Il peut naviguer en français ou en anglais.

## 2. Le client choisit un pack ou un service

**Option A :** Il clique sur un bouton **"Choisir ce pack"** dans la section Packs.  
→ Le site le redirige automatiquement vers le formulaire avec le pack déjà sélectionné.

**Option B :** Il remplit directement le formulaire dans la section **Commander** et choisit :
- Un pack (Starter, Business, Premium)
- Ou un service personnalisé (identité visuelle, site web, publicités, etc.)

## 3. Le client remplit le formulaire

Il doit indiquer :
- Nom complet
- Email
- Téléphone
- Entreprise (optionnel)
- Pack ou service choisi
- Description du projet
- Langue de préférence

## 4. Envoi de la commande

- Le client clique sur **"Envoyer la demande"**.
- Le formulaire envoie les informations au serveur via l'API : `POST /api/orders`.
- La commande est enregistrée dans le fichier `server/data/orders.json`.
- Un message de confirmation s'affiche au client :  
  ✅ *"Demande envoyée avec succès ! Je vous réponds dans les 24 heures."*

## 5. Bello reçoit la commande dans le dashboard admin

- Bello se connecte à l'admin : `http://localhost:3000/admin`.
- Dans l'onglet **📦 Commandes**, il voit la nouvelle commande avec le statut **"Nouveau"**.
- Il peut voir toutes les informations du client.

## 6. Bello contacte le client

- Par email, téléphone ou WhatsApp (les coordonnées sont dans la commande).
- Il discute des détails du projet avec le client.
- Il peut demander des précisions, des inspirations ou des exemples.

## 7. Création et conception

- Bello travaille sur le design selon le pack choisi.
- Exemples selon le pack :
  - **Pack Starter** : logo + carte de visite + visuel Facebook
  - **Pack Business** : logo + carte de visite + flyer + couverture Facebook
  - **Pack Premium** : identité visuelle complète + 10 visuels + flyer + carte de visite + accompagnement publicitaire

## 8. Aperçu et validation

- Bello envoie un ou plusieurs aperçus au client.
- Le client donne son avis et demande des modifications si nécessaire.
- Bello ajuste le design jusqu'à validation finale.

## 9. Paiement

- Le client paie le montant du pack choisi :
  - Pack Starter : 15 000 FCFA
  - Pack Business : 35 000 FCFA
  - Pack Premium : 75 000 FCFA
- Paiement possible par Orange Money, MTN Money, Wave, virement ou espèces selon l'accord.

## 10. Livraison des fichiers

- Bello prépare les fichiers finaux (PNG, JPG, PDF, AI, PSD, etc.).
- Il les envoie au client par email, WhatsApp ou un lien de téléchargement.
- Les fichiers sont prêts pour l'impression et le web.

## 11. Mise à jour du statut dans l'admin

- Bello retourne dans le dashboard admin.
- Il change le statut de la commande :
  - **Nouveau** → **En cours** → **Terminé**
- Si la commande est annulée, il met **"Annulé"**.

## 12. Demande d'avis client (optionnel)

- Après la livraison, Bello peut inviter le client à laisser un avis sur le site.
- Le client clique sur **"Laisser un avis"**, écrit son commentaire et le soumet.
- L'avis reste en attente jusqu'à ce que Bello l'approuve dans l'admin.
- Une fois approuvé, l'avis apparaît sur le site dans la section **Avis clients**.

---

## 📊 Récapitulatif du parcours

```
Client visite le site
    ↓
Client choisit un pack/service
    ↓
Client remplit le formulaire
    ↓
Commande enregistrée sur le serveur
    ↓
Bello voit la commande dans l'admin
    ↓
Bello contacte le client
    ↓
Création et aperçus
    ↓
Validation par le client
    ↓
Paiement
    ↓
Livraison des fichiers
    ↓
Statut mis à jour : Terminé
    ↓
Demande d'avis client (optionnel)
```

---

## 🔔 Notifications possibles à ajouter

Pour aller plus loin, on peut ajouter :
- Envoi automatique d'email à Bello quand une commande arrive.
- Notification WhatsApp à Bello.
- Email de confirmation au client.
- Intégration d'un paiement en ligne.

Tu veux que j'ajoute l'une de ces fonctionnalités ?
