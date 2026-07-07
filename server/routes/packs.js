const express = require('express');
const { body, validationResult } = require('express-validator');
const Pack = require('../models/Pack');
const { adminAuth } = require('../middleware/auth');
const { isMongoConnected, readJsonFile, writeJsonFile, generateId } = require('../utils/db');
const router = express.Router();

const PACKS_FILE = 'packs';

const defaultPacks = [
  {
    _id: '1',
    name: 'Pack Starter',
    nameEn: 'Starter Pack',
    price: '15 000 FCFA',
    features: ['1 logo professionnel', 'Carte de visite', 'Visuel Facebook'],
    featuresEn: ['1 professional logo', 'Business card', 'Facebook visual'],
    popular: false,
    order: 1,
    active: true
  },
  {
    _id: '2',
    name: 'Pack Business',
    nameEn: 'Business Pack',
    price: '35 000 FCFA',
    features: ['1 logo professionnel', 'Carte de visite', 'Flyer', 'Couverture Facebook'],
    featuresEn: ['1 professional logo', 'Business card', 'Flyer', 'Facebook cover'],
    popular: true,
    order: 2,
    active: true
  },
  {
    _id: '3',
    name: 'Pack Premium',
    nameEn: 'Premium Pack',
    price: '75 000 FCFA',
    features: ['Identité visuelle complète', '10 visuels réseaux sociaux', 'Flyer', 'Carte de visite', 'Accompagnement publicitaire'],
    featuresEn: ['Complete visual identity', '10 social media visuals', 'Flyer', 'Business card', 'Advertising support'],
    popular: false,
    order: 3,
    active: true
  }
];

const packValidation = [
  body('name').trim().notEmpty().withMessage('Le nom est obligatoire'),
  body('price').trim().notEmpty().withMessage('Le prix est obligatoire')
];

router.get('/', async (req, res) => {
  try {
    let packs;
    if (isMongoConnected()) {
      packs = await Pack.find({ active: true }).sort({ order: 1, createdAt: -1 });
    } else {
      packs = readJsonFile(PACKS_FILE, defaultPacks)
        .filter(p => p.active)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    res.json({ success: true, count: packs.length, packs });
  } catch (error) {
    console.error('Erreur packs:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.get('/all', adminAuth, async (req, res) => {
  try {
    let packs;
    if (isMongoConnected()) {
      packs = await Pack.find().sort({ order: 1, createdAt: -1 });
    } else {
      packs = readJsonFile(PACKS_FILE, defaultPacks)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    res.json({ success: true, count: packs.length, packs });
  } catch (error) {
    console.error('Erreur packs admin:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.post('/', adminAuth, packValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Vérifiez les champs.', errors: errors.array() });
    }
    const { name, nameEn, price, features, featuresEn, popular, order } = req.body;
    const data = {
      name: name.trim(),
      nameEn: nameEn ? nameEn.trim() : '',
      price: price.trim(),
      features: Array.isArray(features) ? features.filter(Boolean) : [],
      featuresEn: Array.isArray(featuresEn) ? featuresEn.filter(Boolean) : [],
      popular: popular === true || popular === 'true',
      order: parseInt(order) || 0,
      active: true
    };
    let pack;
    if (isMongoConnected()) {
      pack = new Pack(data);
      await pack.save();
    } else {
      const packs = readJsonFile(PACKS_FILE, defaultPacks);
      data._id = generateId();
      packs.push(data);
      writeJsonFile(PACKS_FILE, packs);
      pack = data;
    }
    res.status(201).json({ success: true, message: 'Pack ajouté.', pack });
  } catch (error) {
    console.error('Erreur ajout pack:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const { name, nameEn, price, features, featuresEn, popular, order, active } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (nameEn !== undefined) updates.nameEn = nameEn.trim();
    if (price !== undefined) updates.price = price.trim();
    if (features !== undefined) updates.features = Array.isArray(features) ? features.filter(Boolean) : [];
    if (featuresEn !== undefined) updates.featuresEn = Array.isArray(featuresEn) ? featuresEn.filter(Boolean) : [];
    if (popular !== undefined) updates.popular = popular === true || popular === 'true';
    if (order !== undefined) updates.order = parseInt(order) || 0;
    if (active !== undefined) updates.active = active;
    let pack;
    if (isMongoConnected()) {
      pack = await Pack.findByIdAndUpdate(req.params.id, updates, { new: true });
    } else {
      const packs = readJsonFile(PACKS_FILE, defaultPacks);
      const index = packs.findIndex(p => p._id === req.params.id);
      if (index !== -1) {
        packs[index] = { ...packs[index], ...updates };
        writeJsonFile(PACKS_FILE, packs);
        pack = packs[index];
      }
    }
    if (!pack) return res.status(404).json({ success: false, message: 'Pack non trouvé.' });
    res.json({ success: true, message: 'Pack mis à jour.', pack });
  } catch (error) {
    console.error('Erreur mise à jour pack:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    let deleted = false;
    if (isMongoConnected()) {
      const pack = await Pack.findByIdAndDelete(req.params.id);
      deleted = !!pack;
    } else {
      const packs = readJsonFile(PACKS_FILE, defaultPacks);
      const filtered = packs.filter(p => p._id !== req.params.id);
      deleted = filtered.length !== packs.length;
      writeJsonFile(PACKS_FILE, filtered);
    }
    if (!deleted) return res.status(404).json({ success: false, message: 'Pack non trouvé.' });
    res.json({ success: true, message: 'Pack supprimé.' });
  } catch (error) {
    console.error('Erreur suppression pack:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
