const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'DOREGO Services GROUP'
  },
  slogan: {
    type: String,
    default: 'Chiffres, digital et créativité au service de votre croissance'
  },
  founderName: {
    type: String,
    default: 'DOREGO Mouhamed Nabil'
  },
  role: {
    type: String,
    default: 'Comptable senior & CEO'
  },
  email: {
    type: String,
    default: 'doregoservices@gmail.com'
  },
  phone: {
    type: String,
    default: '+225 05 02 65 73 92'
  },
  whatsapp: {
    type: String,
    default: '+225 05 02 65 73 92'
  },
  location: {
    type: String,
    default: 'Marcory, Zone 4, Abidjan'
  },
  website: {
    type: String,
    default: ''
  },
  logoPath: {
    type: String,
    default: 'images/logo-dorego.png'
  },
  darkLogoPath: {
    type: String,
    default: 'images/logo-dorego-dark.png'
  },
  faviconPath: {
    type: String,
    default: 'favicon.svg'
  },
  primaryColor: {
    type: String,
    default: '#D4AF37'
  },
  darkColor: {
    type: String,
    default: '#0A2540'
  },
  description: {
    type: String,
    default: 'Comptabilité, fiscalité, formations, outils de gestion automatisés, création de sites web, musique personnalisée et CV professionnels.'
  },
  aboutTitle: {
    type: String,
    default: 'À propos de DOREGO Services GROUP'
  },
  aboutText: {
    type: String,
    default: "DOREGO Services GROUP, c'est le croisement entre la rigueur comptable et l'innovation digitale. Sous la direction de DOREGO Mouhamed Nabil, comptable senior avec plus de 4 ans d'expérience, nous accompagnons entreprises et entrepreneurs dans la gestion de leurs comptes, la formation de leurs équipes et la digitalisation de leurs outils."
  },
  footerText: {
    type: String,
    default: 'Chiffres, digital et créativité au service de votre croissance.'
  },
  metaDescription: {
    type: String,
    default: 'DOREGO Services GROUP - comptabilité, fiscalité, formations, outils digitaux, sites web, musique et CV professionnels en Côte d\'Ivoire.'
  },
  metaKeywords: {
    type: String,
    default: 'comptable, fiscalité, formation, Excel, outils de gestion, site web, CV, musique, Abidjan, Côte d\'Ivoire'
  },
  heroTitle: {
    type: String,
    default: 'DOREGO Services GROUP'
  },
  heroSubtitle: {
    type: String,
    default: 'Votre croissance, notre expertise'
  },
  heroEyebrow: {
    type: String,
    default: 'Comptabilité · Digital · Créativité'
  },
  heroTags: {
    type: String,
    default: 'Comptabilité, Formations, Outils Excel, Sites Web, CV, Musique'
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
  productsTitle: {
    type: String,
    default: 'Nos outils et packs'
  },
  productsEyebrow: {
    type: String,
    default: 'Téléchargeables et sur mesure'
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
    default: 'Échange'
  },
  processStep1Desc: {
    type: String,
    default: 'Vous nous présentez votre besoin et vos objectifs.'
  },
  processStep2Title: {
    type: String,
    default: 'Réalisation'
  },
  processStep2Desc: {
    type: String,
    default: 'Nous travaillons sur votre solution avec rigueur et créativité.'
  },
  processStep3Title: {
    type: String,
    default: 'Livraison'
  },
  processStep3Desc: {
    type: String,
    default: 'Vous recevez un résultat clé en main, prêt à être utilisé.'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

configSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

module.exports = mongoose.model('Config', configSchema);
