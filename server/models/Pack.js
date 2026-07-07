const mongoose = require('mongoose');

const packSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du pack est obligatoire'],
    trim: true
  },
  nameEn: {
    type: String,
    trim: true,
    default: ''
  },
  price: {
    type: String,
    required: [true, 'Le prix est obligatoire'],
    trim: true
  },
  features: {
    type: [String],
    default: []
  },
  featuresEn: {
    type: [String],
    default: []
  },
  popular: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Pack', packSchema);
