const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Le téléphone est obligatoire'],
    trim: true
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  pack: {
    type: String,
    required: [true, 'Le pack ou service est obligatoire'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Le message est obligatoire'],
    trim: true
  },
  langue: {
    type: String,
    default: 'Français'
  },
  status: {
    type: String,
    enum: ['Nouveau', 'En cours', 'Terminé', 'Annulé'],
    default: 'Nouveau'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
