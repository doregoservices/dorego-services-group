const express = require('express');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { processImageFile } = require('../utils/image');
const { isMongoConnected, readJsonFile, writeJsonFile, generateId } = require('../utils/db');
const router = express.Router();

const PRODUCTS_FILE = 'products';

const productValidation = [
  body('name').trim().notEmpty().withMessage('Le nom est obligatoire'),
  body('price').trim().notEmpty().withMessage('Le prix est obligatoire')
];

router.get('/', async (req, res) => {
  try {
    let products;
    if (isMongoConnected()) {
      products = await Product.find({ active: true }).sort({ order: 1, createdAt: -1 });
    } else {
      products = readJsonFile(PRODUCTS_FILE, [])
        .filter(p => p.active)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Erreur products:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.get('/all', adminAuth, async (req, res) => {
  try {
    let products;
    if (isMongoConnected()) {
      products = await Product.find().sort({ order: 1, createdAt: -1 });
    } else {
      products = readJsonFile(PRODUCTS_FILE, [])
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Erreur products admin:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.post('/', adminAuth, productValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Vérifiez les champs.', errors: errors.array() });
    }
    const { name, nameEn, description, descriptionEn, price, imagePath, category, order } = req.body;
    const data = {
      name: name.trim(),
      nameEn: nameEn ? nameEn.trim() : '',
      description: description ? description.trim() : '',
      descriptionEn: descriptionEn ? descriptionEn.trim() : '',
      price: price.trim(),
      imagePath: imagePath ? imagePath.trim() : '',
      category: category ? category.trim() : '',
      order: parseInt(order) || 0,
      active: true
    };
    let product;
    if (isMongoConnected()) {
      product = new Product(data);
      await product.save();
    } else {
      const products = readJsonFile(PRODUCTS_FILE, []);
      data._id = generateId();
      products.push(data);
      writeJsonFile(PRODUCTS_FILE, products);
      product = data;
    }
    res.status(201).json({ success: true, message: 'Produit ajouté.', product });
  } catch (error) {
    console.error('Erreur ajout product:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.post('/upload', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucune image uploadée.' });
    }
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let imagePath;
    if (ext === '.svg') {
      const base64 = fs.readFileSync(filePath).toString('base64');
      imagePath = `data:image/svg+xml;base64,${base64}`;
    } else {
      const processed = await processImageFile(filePath, 800, 800);
      if (!processed) {
        fs.unlinkSync(filePath);
        return res.status(500).json({ success: false, message: 'Erreur traitement image.' });
      }
      imagePath = `data:${processed.mime};base64,${processed.buffer.toString('base64')}`;
    }
    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'Image uploadée.', imagePath });
  } catch (error) {
    console.error('Erreur upload product:', error);
    res.status(500).json({ success: false, message: 'Erreur upload.' });
  }
});

router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const { name, nameEn, description, descriptionEn, price, imagePath, category, order, active } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (nameEn !== undefined) updates.nameEn = nameEn.trim();
    if (description !== undefined) updates.description = description.trim();
    if (descriptionEn !== undefined) updates.descriptionEn = descriptionEn.trim();
    if (price !== undefined) updates.price = price.trim();
    if (imagePath !== undefined) updates.imagePath = imagePath.trim();
    if (category !== undefined) updates.category = category.trim();
    if (order !== undefined) updates.order = parseInt(order) || 0;
    if (active !== undefined) updates.active = active;
    let product;
    if (isMongoConnected()) {
      product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    } else {
      const products = readJsonFile(PRODUCTS_FILE, []);
      const index = products.findIndex(p => p._id === req.params.id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updates };
        writeJsonFile(PRODUCTS_FILE, products);
        product = products[index];
      }
    }
    if (!product) return res.status(404).json({ success: false, message: 'Produit non trouvé.' });
    res.json({ success: true, message: 'Produit mis à jour.', product });
  } catch (error) {
    console.error('Erreur mise à jour product:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.patch('/:id/toggle', adminAuth, async (req, res) => {
  try {
    let product;
    if (isMongoConnected()) {
      const existing = await Product.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'Produit non trouvé.' });
      product = await Product.findByIdAndUpdate(req.params.id, { active: !existing.active }, { new: true });
    } else {
      const products = readJsonFile(PRODUCTS_FILE, []);
      const index = products.findIndex(p => p._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Produit non trouvé.' });
      products[index].active = !products[index].active;
      writeJsonFile(PRODUCTS_FILE, products);
      product = products[index];
    }
    res.json({ success: true, message: 'Statut mis à jour.', product });
  } catch (error) {
    console.error('Erreur toggle product:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    let deleted = false;
    if (isMongoConnected()) {
      const product = await Product.findByIdAndDelete(req.params.id);
      deleted = !!product;
    } else {
      const products = readJsonFile(PRODUCTS_FILE, []);
      const filtered = products.filter(p => p._id !== req.params.id);
      deleted = filtered.length !== products.length;
      writeJsonFile(PRODUCTS_FILE, filtered);
    }
    if (!deleted) return res.status(404).json({ success: false, message: 'Produit non trouvé.' });
    res.json({ success: true, message: 'Produit supprimé.' });
  } catch (error) {
    console.error('Erreur suppression product:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
