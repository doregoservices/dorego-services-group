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
  description: 'Comptabilité, fiscalité, formations, outils de gestion automatisés, création de sites web, musique personnalisée et CV professionnels.',
  aboutTitle: 'À propos de DOREGO Services GROUP',
  aboutText: 'DOREGO Services GROUP, c\'est le croisement entre la rigueur comptable et l\'innovation digitale. Sous la direction de DOREGO Mouhamed Nabil, comptable senior avec plus de 4 ans d\'expérience, nous accompagnons entreprises et entrepreneurs dans la gestion de leurs comptes, la formation de leurs équipes et la digitalisation de leurs outils.',
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

const allowedFields = [
  'siteName', 'slogan', 'founderName', 'role', 'email', 'phone',
  'whatsapp', 'location', 'website', 'logoPath', 'darkLogoPath',
  'faviconPath', 'primaryColor', 'darkColor', 'description', 'aboutTitle', 'aboutText',
  'footerText', 'metaDescription', 'metaKeywords', 'heroTitle', 'heroSubtitle',
  'heroEyebrow', 'heroTags', 'servicesTitle', 'servicesEyebrow', 'packsTitle', 'packsEyebrow',
  'portfolioTitle', 'portfolioEyebrow', 'productsTitle', 'productsEyebrow',
  'testimonialsTitle', 'testimonialsEyebrow',
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

router.get('/', async (req, res) => {
  try {
    const config = await getConfig();
    res.json({ success: true, config });
  } catch (error) {
    console.error('Erreur config:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.put('/', adminAuth, async (req, res) => {
  try {
    const config = await saveConfig(req.body);
    res.json({ success: true, message: 'Configuration mise à jour.', config });
  } catch (error) {
    console.error('Erreur mise à jour config:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

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
