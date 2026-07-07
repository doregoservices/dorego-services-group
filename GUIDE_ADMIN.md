# 📊 Guide d'utilisation du Dashboard Admin Boostify

## Connexion

1. Ouvrez : `https://votre-site.com/admin`
2. Entrez le mot de passe administrateur défini dans `.env` (par défaut : `boostify2024`)
3. Cliquez sur **Se connecter**

## Tableau de bord

Le dashboard affiche 5 statistiques en temps réel :
- **Commandes totales**
- **Nouvelles commandes**
- **Commandes en cours**
- **Commandes terminées**
- **Avis clients**

## Gestion des commandes

### Voir une commande
- Allez dans l'onglet **📦 Commandes**
- Vous voyez la date, le client, le contact, le pack choisi et le message

### Modifier le statut
- Sélectionnez un nouveau statut dans le menu déroulant
- Les statuts disponibles sont : **Nouveau**, **En cours**, **Terminé**, **Annulé**

### Supprimer une commande
- Cliquez sur le bouton rouge **Supprimer**
- Confirmez la suppression

## Gestion des avis clients

### Approuver un avis
- Allez dans l'onglet **💬 Avis clients**
- Les avis en attente sont surlignés en orange
- Cliquez sur **Approuver**
- L'avis apparaît maintenant sur le site public

### Supprimer un avis
- Cliquez sur **Supprimer**
- Confirmez la suppression

## Configuration du site

### Modifier les informations
1. Allez dans l'onglet **⚙️ Configuration**
2. Modifiez les champs :
   - Nom du site
   - Slogan
   - Nom du fondateur
   - Rôle
   - Email
   - Téléphone
   - WhatsApp
   - Localisation
   - Site web
   - Couleur principale
3. Cliquez sur **💾 Enregistrer la configuration**

### Changer le logo
1. Dans l'onglet **Configuration**, allez dans **🖼️ Changer le logo**
2. Cliquez sur la zone d'upload ou déposez un fichier
3. Formats acceptés : JPG, PNG, SVG, WebP, GIF
4. Taille maximale : 5 MB
5. Le logo est automatiquement mis à jour sur tout le site

### Modifier le logo manuellement
1. Téléversez votre image dans le dossier `public/images/`
2. Dans le champ **Chemin du logo**, entrez : `images/nom-de-votre-image.png`
3. Enregistrez la configuration

## Notifications email

Quand tout est configuré dans le fichier `.env` :
- Vous recevez un email à chaque nouvelle commande
- Le client reçoit un email de confirmation
- Vous recevez un email quand un avis est soumis

## Bonnes pratiques

1. **Changez le mot de passe admin** immédiatement après le déploiement
2. **Connectez une base MongoDB** pour ne pas perdre les données
3. **Configurez les emails** pour recevoir les notifications
4. **Approuvez les avis** régulièrement pour maintenir le site à jour
5. **Mettez à jour le statut** des commandes pour suivre votre travail

## Sécurité

- Ne partagez jamais le mot de passe admin
- Utilisez un mot de passe fort (12+ caractères)
- Changez le mot de passe régulièrement
- Gardez le fichier `.env` secret (ne le poussez pas sur GitHub)
