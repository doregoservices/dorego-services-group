const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Mon Site'
  },
  slogan: {
    type: String,
    default: 'Votre slogan ici'
  },
  founderName: {
    type: String,
    default: 'Nom du fondateur'
  },
  role: {
    type: String,
    default: 'Votre activité'
  },
  email: {
    type: String,
    default: 'contact@example.com'
  },
  phone: {
    type: String,
    default: '+225 00 00 00 00'
  },
  whatsapp: {
    type: String,
    default: '+225 00 00 00 00'
  },
  location: {
    type: String,
    default: 'Votre localisation'
  },
  website: {
    type: String,
    default: ''
  },
  logoPath: {
    type: String,
    default: 'images/logo-boostify.svg'
  },
  darkLogoPath: {
    type: String,
    default: 'images/logo-boostify-dark.svg'
  },
  faviconPath: {
    type: String,
    default: 'favicon.svg'
  },
  primaryColor: {
    type: String,
    default: '#F5A623'
  },
  darkColor: {
    type: String,
    default: '#111111'
  },
  description: {
    type: String,
    default: 'Décrivez votre activité ici. Ce texte apparaît sur la page d\'accueil.'
  },
  aboutTitle: {
    type: String,
    default: "À propos de nous"
  },
  aboutText: {
    type: String,
    default: "Présentez votre activité, votre expérience et ce qui vous différencie. Ce texte est modifiable dans l'admin."
  },
  footerText: {
    type: String,
    default: "Votre slogan ou message de footer."
  },
  metaDescription: {
    type: String,
    default: 'Description de votre site pour Google et les réseaux sociaux.'
  },
  metaKeywords: {
    type: String,
    default: 'site, services, entreprise'
  },
  heroTitle: {
    type: String,
    default: "Votre titre principal"
  },
  heroSubtitle: {
    type: String,
    default: ''
  },
  heroEyebrow: {
    type: String,
    default: 'Votre activité'
  },
  heroTags: {
    type: String,
    default: 'Service 1, Service 2, Service 3, Service 4'
  },
  servicesTitle: {
    type: String,
    default: 'Nos services'
  },
  servicesEyebrow: {
    type: String,
    default: 'Ce que nous proposons'
  },
  packsTitle: {
    type: String,
    default: 'Nos formules'
  },
  packsEyebrow: {
    type: String,
    default: 'Choisissez ce qui vous convient'
  },
  portfolioTitle: {
    type: String,
    default: 'Nos réalisations'
  },
  portfolioEyebrow: {
    type: String,
    default: 'Exemples de notre travail'
  },
  testimonialsTitle: {
    type: String,
    default: 'Ce que disent nos clients'
  },
  testimonialsEyebrow: {
    type: String,
    default: 'Ils nous ont fait confiance'
  },
  processStep1Title: {
    type: String,
    default: 'Contact'
  },
  processStep1Desc: {
    type: String,
    default: 'Vous nous expliquez votre besoin.'
  },
  processStep2Title: {
    type: String,
    default: 'Réalisation'
  },
  processStep2Desc: {
    type: String,
    default: 'Nous travaillons sur votre projet.'
  },
  processStep3Title: {
    type: String,
    default: 'Livraison'
  },
  processStep3Desc: {
    type: String,
    default: 'Vous recevez le résultat final.'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure only one config document exists
configSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

module.exports = mongoose.model('Config', configSchema);
