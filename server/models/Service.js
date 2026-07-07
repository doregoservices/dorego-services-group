const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  icon: {
    type: String,
    default: '🎨'
  },
  title: {
    type: String,
    required: [true, 'Le titre est obligatoire'],
    trim: true
  },
  titleEn: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'La description est obligatoire'],
    trim: true
  },
  descriptionEn: {
    type: String,
    trim: true,
    default: ''
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

module.exports = mongoose.model('Service', serviceSchema);
