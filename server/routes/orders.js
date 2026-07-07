const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { adminAuth } = require('../middleware/auth');
const { sendNewOrderNotification, sendOrderConfirmation } = require('../utils/email');
const { isMongoConnected, readJsonFile, writeJsonFile, generateId } = require('../utils/db');
const router = express.Router();

const ORDERS_FILE = 'orders';

const orderValidation = [
  body('name').trim().notEmpty().withMessage('Le nom est obligatoire'),
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('phone').trim().notEmpty().withMessage('Le téléphone est obligatoire'),
  body('pack').trim().notEmpty().withMessage('Le pack ou service est obligatoire'),
  body('message').trim().notEmpty().withMessage('Le message est obligatoire')
];

// POST /api/orders - Create new order
router.post('/', orderValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez vérifier les champs du formulaire.',
        errors: errors.array()
      });
    }

    const { name, email, phone, company, pack, message, langue } = req.body;
    const orderData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      company: company ? company.trim() : '',
      pack,
      message: message.trim(),
      langue: langue || 'Français',
      status: 'Nouveau',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let order;

    if (isMongoConnected()) {
      order = new Order(orderData);
      await order.save();
    } else {
      const orders = readJsonFile(ORDERS_FILE);
      orderData._id = generateId();
      orders.unshift(orderData);
      writeJsonFile(ORDERS_FILE, orders);
      order = orderData;
    }

    sendNewOrderNotification(order);
    sendOrderConfirmation(order.email, order);

    res.status(201).json({
      success: true,
      message: 'Commande enregistrée avec succès.',
      order: { id: order._id }
    });
  } catch (error) {
    console.error('Erreur création commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement de la commande.'
    });
  }
});

// GET /api/orders - List all orders
router.get('/', adminAuth, async (req, res) => {
  try {
    let orders;
    if (isMongoConnected()) {
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      orders = readJsonFile(ORDERS_FILE).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Erreur liste commandes:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', adminAuth, async (req, res) => {
  try {
    let order;
    if (isMongoConnected()) {
      order = await Order.findById(req.params.id);
    } else {
      const orders = readJsonFile(ORDERS_FILE);
      order = orders.find(o => o._id === req.params.id);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande non trouvée.' });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error('Erreur récupération commande:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// PATCH /api/orders/:id - Update order status
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    let order;

    if (isMongoConnected()) {
      order = await Order.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true });
    } else {
      const orders = readJsonFile(ORDERS_FILE);
      const index = orders.findIndex(o => o._id === req.params.id);
      if (index !== -1) {
        orders[index].status = status;
        orders[index].updatedAt = new Date().toISOString();
        writeJsonFile(ORDERS_FILE, orders);
        order = orders[index];
      }
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande non trouvée.' });
    }
    res.json({ success: true, message: 'Statut mis à jour.', order });
  } catch (error) {
    console.error('Erreur mise à jour commande:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// DELETE /api/orders/:id
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    let deleted = false;
    if (isMongoConnected()) {
      const order = await Order.findByIdAndDelete(req.params.id);
      deleted = !!order;
    } else {
      const orders = readJsonFile(ORDERS_FILE);
      const filtered = orders.filter(o => o._id !== req.params.id);
      deleted = filtered.length !== orders.length;
      writeJsonFile(ORDERS_FILE, filtered);
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Commande non trouvée.' });
    }
    res.json({ success: true, message: 'Commande supprimée.' });
  } catch (error) {
    console.error('Erreur suppression commande:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
