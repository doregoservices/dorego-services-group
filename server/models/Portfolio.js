const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
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
  imagePath: {
    type: String,
    required: [true, 'L\'image est obligatoire'],
    trim: true
  },
  category: {
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
