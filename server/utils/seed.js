const mongoose = require('mongoose');
const Config = require('../models/Config');
const Service = require('../models/Service');
const Pack = require('../models/Pack');
const Portfolio = require('../models/Portfolio');
const Testimonial = require('../models/Testimonial');
const { processImageFile } = require('./image');
const fs = require('fs');
const path = require('path');

// Les valeurs par défaut sont volontairement neutres pour servir de modèle universel.
const defaultConfig = {
  siteName: 'Mon Site',
  slogan: 'Votre slogan ici',
  founderName: 'Nom du fondateur',
  role: 'Votre activité',
  email: 'contact@example.com',
  phone: '+225 00 00 00 00',
  whatsapp: '+225 00 00 00 00',
  location: 'Votre localisation',
  website: '',
  logoPath: 'images/logo-boostify.svg',
  darkLogoPath: 'images/logo-boostify-dark.svg',
  faviconPath: 'favicon.svg',
  primaryColor: '#F5A623',
  darkColor: '#111111',
  description: 'Décrivez votre activité ici. Ce texte apparaît sur la page d\'accueil.',
  aboutTitle: 'À propos de nous',
  aboutText: "Présentez votre activité, votre expérience et ce qui vous différencie. Ce texte est modifiable dans l'admin.",
  footerText: 'Votre slogan ou message de footer.',
  metaDescription: 'Description de votre site pour Google et les réseaux sociaux.',
  metaKeywords: 'site, services, entreprise',
  heroTitle: 'Votre titre principal',
  heroSubtitle: '',
  heroEyebrow: 'Votre activité',
  heroTags: 'Service 1, Service 2, Service 3, Service 4',
  servicesTitle: 'Nos services',
  servicesEyebrow: 'Ce que nous proposons',
  packsTitle: 'Nos formules',
  packsEyebrow: 'Choisissez ce qui vous convient',
  portfolioTitle: 'Nos réalisations',
  portfolioEyebrow: 'Exemples de notre travail',
  testimonialsTitle: 'Ce que disent nos clients',
  testimonialsEyebrow: 'Ils nous ont fait confiance',
  productsTitle: 'Découvrez nos produits',
  productsEyebrow: 'Nos produits',
  processStep1Title: 'Contact',
  processStep1Desc: 'Vous nous expliquez votre besoin.',
  processStep2Title: 'Réalisation',
  processStep2Desc: 'Nous travaillons sur votre projet.',
  processStep3Title: 'Livraison',
  processStep3Desc: 'Vous recevez le résultat final.'
};

const defaultServices = [
  {
    icon: '🎯',
    title: 'Service exemple 1',
    titleEn: 'Example service 1',
    description: 'Description de votre premier service. Modifiez ou supprimez cet exemple dans l\'admin.',
    descriptionEn: 'Description of your first service. Edit or delete this example in the admin.',
    order: 1,
    active: true
  },
  {
    icon: '🛠️',
    title: 'Service exemple 2',
    titleEn: 'Example service 2',
    description: 'Description de votre deuxième service.',
    descriptionEn: 'Description of your second service.',
    order: 2,
    active: true
  },
  {
    icon: '⭐',
    title: 'Service exemple 3',
    titleEn: 'Example service 3',
    description: 'Description de votre troisième service.',
    descriptionEn: 'Description of your third service.',
    order: 3,
    active: true
  }
];

const defaultPacks = [
  {
    name: 'Formule de base',
    nameEn: 'Basic package',
    price: 'Prix sur demande',
    features: ['Prestation essentielle', 'Livraison rapide', 'Support par email'],
    featuresEn: ['Essential service', 'Fast delivery', 'Email support'],
    popular: false,
    order: 1,
    active: true
  },
  {
    name: 'Formule populaire',
    nameEn: 'Popular package',
    price: 'Prix sur demande',
    features: ['Prestation complète', 'Livraison prioritaire', 'Support téléphone', 'Bonus inclus'],
    featuresEn: ['Complete service', 'Priority delivery', 'Phone support', 'Included bonus'],
    popular: true,
    order: 2,
    active: true
  },
  {
    name: 'Formule premium',
    nameEn: 'Premium package',
    price: 'Prix sur demande',
    features: ['Prestation sur mesure', 'Livraison express', 'Support premium', 'Accompagnement complet'],
    featuresEn: ['Custom service', 'Express delivery', 'Premium support', 'Full support'],
    popular: false,
    order: 3,
    active: true
  }
];

const defaultPortfolio = [
  {
    title: 'Réalisation exemple 1',
    titleEn: 'Example work 1',
    imagePath: 'images/portfolio-boostify-work.jpg',
    category: 'autre',
    order: 1,
    active: true
  },
  {
    title: 'Réalisation exemple 2',
    titleEn: 'Example work 2',
    imagePath: 'images/portfolio-boostify-work.jpg',
    category: 'autre',
    order: 2,
    active: true
  }
];

const defaultTestimonials = [
  {
    name: 'Client A',
    company: 'Entreprise A',
    rating: 5,
    text: 'Excellent service, je recommande vivement.',
    lang: 'fr',
    approved: true
  },
  {
    name: 'Client B',
    company: 'Entreprise B',
    rating: 5,
    text: 'Très professionnel et à l\'écoute.',
    lang: 'fr',
    approved: true
  }
];

const defaultProducts = [
  {
    name: 'Produit exemple 1',
    nameEn: 'Example product 1',
    description: 'Description de votre premier produit.',
    descriptionEn: 'Description of your first product.',
    price: '5 000 FCFA',
    imagePath: 'images/portfolio-boostify-work.jpg',
    category: 'Exemple',
    order: 1,
    active: true
  },
  {
    name: 'Produit exemple 2',
    nameEn: 'Example product 2',
    description: 'Description de votre deuxième produit.',
    descriptionEn: 'Description of your second product.',
    price: '10 000 FCFA',
    imagePath: 'images/portfolio-boostify-work.jpg',
    category: 'Exemple',
    order: 2,
    active: true
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
    const processed = await processImageFile(filePath, 1200, 1200);
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
      config = await Config.create(defaultConfig);
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

async function seedProducts() {
  try {
    const Product = require('../models/Product');
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
