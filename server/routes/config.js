const express = require('express');
const fs = require('fs');
const path = require('path');
const Config = require('../models/Config');
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { processImageFile, processBase64Image } = require('../utils/image');
const { isMongoConnected, readJsonFile, writeJsonFile } = require('../utils/db');
const router = express.Router();

const CONFIG_FILE = 'config';

// Fallback minimal en mode fichier (sans MongoDB)
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
  description: 'Décrivez votre activité ici.',
  aboutTitle: 'À propos de nous',
  aboutText: "Présentez votre activité. Ce texte est modifiable dans l'admin.",
  footerText: 'Votre slogan ou message de footer.',
  metaDescription: 'Description de votre site.',
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

const allowedFields = [
  'siteName', 'slogan', 'founderName', 'role', 'email', 'phone',
  'whatsapp', 'location', 'website', 'logoPath', 'darkLogoPath',
  'faviconPath', 'primaryColor', 'darkColor', 'description', 'aboutTitle', 'aboutText',
  'footerText', 'metaDescription', 'metaKeywords', 'heroTitle', 'heroSubtitle',
  'heroEyebrow', 'heroTags', 'servicesTitle', 'servicesEyebrow', 'packsTitle', 'packsEyebrow',
  'portfolioTitle', 'portfolioEyebrow', 'testimonialsTitle', 'testimonialsEyebrow',
  'productsTitle', 'productsEyebrow',
  'processStep1Title', 'processStep1Desc', 'processStep2Title', 'processStep2Desc',
  'processStep3Title', 'processStep3Desc'
];

async function getConfig() {
  if (isMongoConnected()) {
    return await Config.getConfig();
  }
  return readJsonFile(CONFIG_FILE, defaultConfig);
}

async function saveConfig(updates) {
  if (isMongoConnected()) {
    const config = await Config.getConfig();
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        config[field] = updates[field];
      }
    });
    config.updatedAt = Date.now();
    await config.save();
    return config;
  } else {
    const config = readJsonFile(CONFIG_FILE, defaultConfig);
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        config[field] = updates[field];
      }
    });
    config.updatedAt = new Date().toISOString();
    writeJsonFile(CONFIG_FILE, config);
    return config;
  }
}

// GET /api/config - Public config
router.get('/', async (req, res) => {
  try {
    const config = await getConfig();
    res.json({ success: true, config });
  } catch (error) {
    console.error('Erreur config:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// PUT /api/config - Update config (admin)
router.put('/', adminAuth, async (req, res) => {
  try {
    const config = await saveConfig(req.body);
    res.json({ success: true, message: 'Configuration mise à jour.', config });
  } catch (error) {
    console.error('Erreur mise à jour config:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// POST /api/config/upload-logo - Upload logo (admin)
router.post('/upload-logo', adminAuth, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier uploadé.' });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let logoPath;
    if (ext === '.svg') {
      const base64 = fs.readFileSync(filePath).toString('base64');
      logoPath = `data:image/svg+xml;base64,${base64}`;
    } else {
      const processed = await processImageFile(filePath, 800, 800);
      if (!processed) {
        fs.unlinkSync(filePath);
        return res.status(500).json({ success: false, message: 'Erreur traitement logo.' });
      }
      logoPath = `data:${processed.mime};base64,${processed.buffer.toString('base64')}`;
    }

    fs.unlinkSync(filePath);
    const config = await saveConfig({ logoPath, darkLogoPath: logoPath });

    res.json({ success: true, message: 'Logo uploadé avec succès.', logoPath, config });
  } catch (error) {
    console.error('Erreur upload logo:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'upload du logo.' });
  }
});

async function migrateLogo() {
  if (!isMongoConnected()) return;
  try {
    const config = await Config.getConfig();
    if (config.logoPath && config.logoPath.startsWith('data:') && config.logoPath.length > 200000) {
      const resized = await processBase64Image(config.logoPath, 800, 800);
      if (resized && resized !== config.logoPath) {
        config.logoPath = resized;
        config.darkLogoPath = resized;
        await config.save();
        console.log('🎨 Logo redimensionné et optimisé.');
      }
    }
  } catch (error) {
    console.error('Erreur migration logo:', error.message);
  }
}

router.migrateLogo = migrateLogo;

module.exports = router;
