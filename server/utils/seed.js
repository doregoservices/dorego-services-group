const mongoose = require('mongoose');
const Config = require('../models/Config');
const Service = require('../models/Service');
const Pack = require('../models/Pack');
const Portfolio = require('../models/Portfolio');
const Testimonial = require('../models/Testimonial');
const Product = require('../models/Product');
const { processImageFile } = require('./image');
const fs = require('fs');
const path = require('path');

const defaultConfig = {
  siteName: 'DOREGO Services GROUP',
  slogan: 'Chiffres, digital et créativité au service de votre croissance',
  founderName: 'DOREGO Mouhamed Nabil',
  role: 'Comptable senior & CEO',
  email: 'doregoservices@gmail.com',
  phone: '+225 05 02 65 73 92',
  whatsapp: '+225 05 02 65 73 92',
  location: 'Marcory, Zone 4, Abidjan',
  website: '',
  logoPath: 'images/logo-dorego.png',
  darkLogoPath: 'images/logo-dorego-dark.png',
  faviconPath: 'favicon.svg',
  primaryColor: '#D4AF37',
  darkColor: '#0A2540',
  description: 'Comptabilité, fiscalité, formations, outils de gestion automatisés, création de sites web, musique personnalisée et CV professionnels. Un seul interlocuteur pour transformer vos projets.',
  aboutTitle: 'À propos de DOREGO Services GROUP',
  aboutText: 'DOREGO Services GROUP, c\'est le croisement entre la rigueur comptable et l\'innovation digitale. Sous la direction de DOREGO Mouhamed Nabil, comptable senior avec plus de 4 ans d\'expérience, nous accompagnons entreprises et entrepreneurs dans la gestion de leurs comptes, la formation de leurs équipes et la digitalisation de leurs outils. Nous concevons également des sites web, des applications, des fichiers Excel automatisés, des musiques personnalisées et des CV professionnels qui valorisent votre image.',
  footerText: 'Chiffres, digital et créativité au service de votre croissance.',
  metaDescription: 'DOREGO Services GROUP - comptabilité, fiscalité, formations, outils digitaux, sites web, musique et CV professionnels en Côte d\'Ivoire.',
  metaKeywords: 'comptable, fiscalité, formation, Excel, outils de gestion, site web, CV, musique, Abidjan, Côte d\'Ivoire',
  heroTitle: 'DOREGO Services GROUP',
  heroSubtitle: 'Votre croissance, notre expertise',
  heroEyebrow: 'Comptabilité · Digital · Créativité',
  heroTags: 'Comptabilité, Formations, Outils Excel, Sites Web, CV, Musique',
  servicesTitle: 'Nos services',
  servicesEyebrow: 'Ce que nous proposons',
  packsTitle: 'Nos formules',
  packsEyebrow: 'Choisissez ce qui vous convient',
  portfolioTitle: 'Nos réalisations',
  portfolioEyebrow: 'Exemples de notre travail',
  productsTitle: 'Nos outils et packs',
  productsEyebrow: 'Téléchargeables et sur mesure',
  testimonialsTitle: 'Ce que disent nos clients',
  testimonialsEyebrow: 'Ils nous ont fait confiance',
  processStep1Title: 'Échange',
  processStep1Desc: 'Vous nous présentez votre besoin et vos objectifs.',
  processStep2Title: 'Réalisation',
  processStep2Desc: 'Nous travaillons sur votre solution avec rigueur et créativité.',
  processStep3Title: 'Livraison',
  processStep3Desc: 'Vous recevez un résultat clé en main, prêt à être utilisé.'
};

const defaultServices = [
  {
    icon: '📊',
    title: 'Assistance comptable et fiscale',
    titleEn: 'Accounting and tax assistance',
    description: 'Tenue de comptes, déclarations fiscales, bilan, TVA, paie et conseil en gestion financière.',
    descriptionEn: 'Bookkeeping, tax returns, balance sheet, VAT, payroll and financial management advice.',
    order: 1,
    active: true
  },
  {
    icon: '🎓',
    title: 'Formations',
    titleEn: 'Training',
    description: 'Formations en comptabilité, informatique, bureautique, Excel avancé et outils de gestion.',
    descriptionEn: 'Training in accounting, IT, office automation, advanced Excel and management tools.',
    order: 2,
    active: true
  },
  {
    icon: '🛠️',
    title: 'Outils de gestion automatisés',
    titleEn: 'Automated management tools',
    description: 'Fichiers Excel automatisés, tableaux de bord, applications web et mobiles sur mesure.',
    descriptionEn: 'Automated Excel files, dashboards, custom web and mobile applications.',
    order: 3,
    active: true
  },
  {
    icon: '💻',
    title: 'Création de sites web',
    titleEn: 'Website creation',
    description: 'Sites vitrines, e-commerce, portfolios et applications web modernes et professionnels.',
    descriptionEn: 'Showcase websites, e-commerce, portfolios and modern professional web applications.',
    order: 4,
    active: true
  },
  {
    icon: '🎨',
    title: 'Infographie et impressions',
    titleEn: 'Graphic design and printing',
    description: 'Logos, flyers, affiches, cartes de visite, CV professionnels et supports imprimés.',
    descriptionEn: 'Logos, flyers, posters, business cards, professional CVs and printed materials.',
    order: 5,
    active: true
  },
  {
    icon: '🎵',
    title: 'Musique personnalisée',
    titleEn: 'Custom music',
    description: 'Création de musiques personnalisées pour événements, publicités, entreprises et projets.',
    descriptionEn: 'Custom music creation for events, advertising, companies and projects.',
    order: 6,
    active: true
  }
];

const defaultPacks = [
  {
    name: 'Pack Comptabilité Start',
    nameEn: 'Accounting Start Pack',
    price: 'Prix sur demande',
    features: ['Tenue mensuelle des comptes', 'Déclarations fiscales', 'Tableau de bord simple', 'Support email'],
    featuresEn: ['Monthly bookkeeping', 'Tax returns', 'Simple dashboard', 'Email support'],
    popular: false,
    order: 1,
    active: true
  },
  {
    name: 'Pack Formation Excel',
    nameEn: 'Excel Training Pack',
    price: 'Prix sur demande',
    features: ['Formation Excel avancé', 'Fichiers pratiques', 'Certificat de formation', 'Support 30 jours'],
    featuresEn: ['Advanced Excel training', 'Practice files', 'Certificate', '30-day support'],
    popular: true,
    order: 2,
    active: true
  },
  {
    name: 'Pack Digital Complet',
    nameEn: 'Complete Digital Pack',
    price: 'Prix sur demande',
    features: ['Site web vitrine', 'Outils Excel automatisés', 'Logo et carte de visite', 'CV professionnel', 'Accompagnement'],
    featuresEn: ['Showcase website', 'Automated Excel tools', 'Logo and business card', 'Professional CV', 'Support'],
    popular: false,
    order: 3,
    active: true
  }
];

const defaultProducts = [
  {
    name: 'Pack Excel Comptabilité Auto',
    nameEn: 'Auto Accounting Excel Pack',
    description: 'Fichier Excel complet pour tenue comptable automatisée : bilan, résultat, journal, grand livre.',
    descriptionEn: 'Complete Excel file for automated bookkeeping: balance sheet, income statement, journal, ledger.',
    price: '25 000 FCFA',
    imagePath: 'images/portfolio-boostify-work.jpg',
    category: 'Outils Excel',
    order: 1,
    active: true
  },
  {
    name: 'Pack Excel Gestion de Stock',
    nameEn: 'Stock Management Excel Pack',
    description: 'Suivi automatique des entrées, sorties, alertes de seuil et valorisation du stock.',
    descriptionEn: 'Automatic tracking of entries, exits, threshold alerts and stock valuation.',
    price: '20 000 FCFA',
    imagePath: 'images/portfolio-boostify-work.jpg',
    category: 'Outils Excel',
    order: 2,
    active: true
  },
  {
    name: 'Modèle CV Premium',
    nameEn: 'Premium CV Template',
    description: '5 modèles de CV professionnels modifiables, modernes et adaptés à tous les secteurs.',
    descriptionEn: '5 editable professional CV templates, modern and suitable for all sectors.',
    price: '5 000 FCFA',
    imagePath: 'images/portfolio-boostify-work.jpg',
    category: 'CV & Carrière',
    order: 3,
    active: true
  }
];

const defaultPortfolio = [
  {
    title: 'Tableau de bord Excel',
    titleEn: 'Excel dashboard',
    imagePath: 'images/portfolio-boostify-work.jpg',
    category: 'outils',
    order: 1,
    active: true
  },
  {
    title: 'Site web professionnel',
    titleEn: 'Professional website',
    imagePath: 'images/portfolio-boostify-work.jpg',
    category: 'web',
    order: 2,
    active: true
  },
  {
    title: 'Identité visuelle complète',
    titleEn: 'Complete visual identity',
    imagePath: 'images/portfolio-boostify-work.jpg',
    category: 'branding',
    order: 3,
    active: true
  },
  {
    title: 'CV professionnel',
    titleEn: 'Professional CV',
    imagePath: 'images/portfolio-boostify-work.jpg',
    category: 'autre',
    order: 4,
    active: true
  }
];

const defaultTestimonials = [
  {
    name: 'Kouassi A.',
    company: 'PME Abidjan',
    rating: 5,
    text: 'Grâce à DOREGO, ma comptabilité est enfin claire et mes déclarations sont à jour. Un service professionnel et patient.',
    lang: 'fr',
    approved: true
  },
  {
    name: 'Fatou B.',
    company: 'Boutique en ligne',
    rating: 5,
    text: 'Les fichiers Excel automatisés ont changé ma gestion de stock. Je gagne un temps fou.',
    lang: 'fr',
    approved: true
  },
  {
    name: 'Jean M.',
    company: 'Consultant',
    rating: 4,
    text: 'Mon site web et mon CV ont été réalisés rapidement. Résultat pro et moderne.',
    lang: 'fr',
    approved: true
  }
];

async function imageToBase64(relativePath) {
  try {
    const filePath = path.join(__dirname, '../../public', relativePath);
    if (!fs.existsSync(filePath)) return relativePath;
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.svg') {
      const base64 = fs.readFileSync(filePath).toString('base64');
      return `data:image/svg+xml;base64,${base64}`;
    }
    const processed = await processImageFile(filePath, 800, 800);
    if (processed) {
      return `data:${processed.mime};base64,${processed.buffer.toString('base64')}`;
    }
  } catch (err) {
    console.error('Erreur conversion image en base64:', relativePath, err.message);
  }
  return relativePath;
}

async function seedConfig() {
  try {
    let config = await Config.findOne();
    if (!config) {
      const configData = { ...defaultConfig };
      configData.logoPath = await imageToBase64(configData.logoPath);
      configData.darkLogoPath = configData.logoPath;
      config = await Config.create(configData);
      console.log('✅ Configuration par défaut créée.');
    }
  } catch (err) {
    console.error('Erreur seed config:', err.message);
  }
}

async function seedServices() {
  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      await Service.insertMany(defaultServices);
      console.log('✅ Services par défaut créés.');
    }
  } catch (err) {
    console.error('Erreur seed services:', err.message);
  }
}

async function seedPacks() {
  try {
    const count = await Pack.countDocuments();
    if (count === 0) {
      await Pack.insertMany(defaultPacks);
      console.log('✅ Packs par défaut créés.');
    }
  } catch (err) {
    console.error('Erreur seed packs:', err.message);
  }
}

async function seedProducts() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const items = [];
      for (const item of defaultProducts) {
        items.push({
          ...item,
          imagePath: await imageToBase64(item.imagePath)
        });
      }
      await Product.insertMany(items);
      console.log('✅ Produits par défaut créés.');
    }
  } catch (err) {
    console.error('Erreur seed products:', err.message);
  }
}

async function seedPortfolio() {
  try {
    const count = await Portfolio.countDocuments();
    if (count === 0) {
      const items = [];
      for (const item of defaultPortfolio) {
        items.push({
          ...item,
          imagePath: await imageToBase64(item.imagePath)
        });
      }
      await Portfolio.insertMany(items);
      console.log('✅ Portfolio par défaut créé.');
    }
  } catch (err) {
    console.error('Erreur seed portfolio:', err.message);
  }
}

async function seedTestimonials() {
  try {
    const count = await Testimonial.countDocuments();
    if (count === 0) {
      await Testimonial.insertMany(defaultTestimonials);
      console.log('✅ Témoignages par défaut créés.');
    }
  } catch (err) {
    console.error('Erreur seed testimonials:', err.message);
  }
}

async function seedAll() {
  if (mongoose.connection.readyState !== 1) {
    console.log('⚠️ MongoDB non connecté. Seed ignoré.');
    return;
  }
  console.log('🌱 Vérification des données par défaut...');
  await seedConfig();
  await seedServices();
  await seedPacks();
  await seedProducts();
  await seedPortfolio();
  await seedTestimonials();
  console.log('🌱 Seed terminé.');
}

module.exports = { seedAll };
