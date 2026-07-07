const express = require('express');
const { body, validationResult } = require('express-validator');
const Service = require('../models/Service');
const { adminAuth } = require('../middleware/auth');
const { isMongoConnected, readJsonFile, writeJsonFile, generateId } = require('../utils/db');
const router = express.Router();

const SERVICES_FILE = 'services';

const defaultServices = [
  {
    _id: '1',
    icon: '🎨',
    title: 'Création graphique',
    titleEn: 'Graphic design',
    description: 'Logos, affiches, flyers, cartes de visite, bannières, menus et visuels réseaux sociaux.',
    descriptionEn: 'Logos, posters, flyers, business cards, banners, menus and social media visuals.',
    order: 1,
    active: true
  },
  {
    _id: '2',
    icon: '🖨️',
    title: 'Impression',
    titleEn: 'Printing',
    description: 'Cartes de visite, flyers, bâches, autocollants, T-shirts personnalisés, facturiers et carnets de reçus.',
    descriptionEn: 'Business cards, flyers, banners, stickers, custom T-shirts, invoices and receipt books.',
    order: 2,
    active: true
  },
  {
    _id: '3',
    icon: '📱',
    title: 'Réseaux sociaux',
    titleEn: 'Social media',
    description: 'Création de pages, contenus mensuels, publicités Facebook/Instagram et optimisation de profils.',
    descriptionEn: 'Page creation, monthly content, Facebook/Instagram ads and profile optimization.',
    order: 3,
    active: true
  },
  {
    _id: '4',
    icon: '🏢',
    title: 'Services entreprises',
    titleEn: 'Corporate services',
    description: 'Identité visuelle complète, présentations, brochures, catalogues et signatures e-mail.',
    descriptionEn: 'Complete visual identity, presentations, brochures, catalogs and email signatures.',
    order: 4,
    active: true
  },
  {
    _id: '5',
    icon: '💻',
    title: 'Services numériques',
    titleEn: 'Digital services',
    description: 'Sites vitrines, CV professionnels, portfolios, QR codes personnalisés et création de contenu.',
    descriptionEn: 'Showcase websites, professional CVs, portfolios, custom QR codes and content creation.',
    order: 5,
    active: true
  },
  {
    _id: '6',
    icon: '🚀',
    title: 'Accompagnement publicitaire',
    titleEn: 'Advertising support',
    description: 'Stratégie, création de campagnes, suivi et optimisation pour maximiser votre retour sur investissement.',
    descriptionEn: 'Strategy, campaign creation, monitoring and optimization to maximize your return on investment.',
    order: 6,
    active: true
  }
];

const serviceValidation = [
  body('title').trim().notEmpty().withMessage('Le titre est obligatoire'),
  body('description').trim().notEmpty().withMessage('La description est obligatoire')
];

router.get('/', async (req, res) => {
  try {
    let services;
    if (isMongoConnected()) {
      services = await Service.find({ active: true }).sort({ order: 1, createdAt: -1 });
    } else {
      services = readJsonFile(SERVICES_FILE, defaultServices)
        .filter(s => s.active)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    res.json({ success: true, count: services.length, services });
  } catch (error) {
    console.error('Erreur services:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.get('/all', adminAuth, async (req, res) => {
  try {
    let services;
    if (isMongoConnected()) {
      services = await Service.find().sort({ order: 1, createdAt: -1 });
    } else {
      services = readJsonFile(SERVICES_FILE, defaultServices)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    res.json({ success: true, count: services.length, services });
  } catch (error) {
    console.error('Erreur services admin:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.post('/', adminAuth, serviceValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Vérifiez les champs.', errors: errors.array() });
    }
    const { icon, title, titleEn, description, descriptionEn, order } = req.body;
    const data = {
      icon: icon || '🎨',
      title: title.trim(),
      titleEn: titleEn ? titleEn.trim() : '',
      description: description.trim(),
      descriptionEn: descriptionEn ? descriptionEn.trim() : '',
      order: parseInt(order) || 0,
      active: true
    };
    let service;
    if (isMongoConnected()) {
      service = new Service(data);
      await service.save();
    } else {
      const services = readJsonFile(SERVICES_FILE, defaultServices);
      data._id = generateId();
      services.push(data);
      writeJsonFile(SERVICES_FILE, services);
      service = data;
    }
    res.status(201).json({ success: true, message: 'Service ajouté.', service });
  } catch (error) {
    console.error('Erreur ajout service:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const { icon, title, titleEn, description, descriptionEn, order, active } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (titleEn !== undefined) updates.titleEn = titleEn.trim();
    if (description !== undefined) updates.description = description.trim();
    if (descriptionEn !== undefined) updates.descriptionEn = descriptionEn.trim();
    if (icon !== undefined) updates.icon = icon;
    if (order !== undefined) updates.order = parseInt(order) || 0;
    if (active !== undefined) updates.active = active;
    let service;
    if (isMongoConnected()) {
      service = await Service.findByIdAndUpdate(req.params.id, updates, { new: true });
    } else {
      const services = readJsonFile(SERVICES_FILE, defaultServices);
      const index = services.findIndex(s => s._id === req.params.id);
      if (index !== -1) {
        services[index] = { ...services[index], ...updates };
        writeJsonFile(SERVICES_FILE, services);
        service = services[index];
      }
    }
    if (!service) return res.status(404).json({ success: false, message: 'Service non trouvé.' });
    res.json({ success: true, message: 'Service mis à jour.', service });
  } catch (error) {
    console.error('Erreur mise à jour service:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    let deleted = false;
    if (isMongoConnected()) {
      const service = await Service.findByIdAndDelete(req.params.id);
      deleted = !!service;
    } else {
      const services = readJsonFile(SERVICES_FILE, defaultServices);
      const filtered = services.filter(s => s._id !== req.params.id);
      deleted = filtered.length !== services.length;
      writeJsonFile(SERVICES_FILE, filtered);
    }
    if (!deleted) return res.status(404).json({ success: false, message: 'Service non trouvé.' });
    res.json({ success: true, message: 'Service supprimé.' });
  } catch (error) {
    console.error('Erreur suppression service:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
