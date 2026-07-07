const express = require('express');
const { body, validationResult } = require('express-validator');
const Testimonial = require('../models/Testimonial');
const { adminAuth } = require('../middleware/auth');
const { sendNewTestimonialNotification } = require('../utils/email');
const { isMongoConnected, readJsonFile, writeJsonFile, generateId } = require('../utils/db');
const router = express.Router();

const TESTIMONIALS_FILE = 'testimonials';

const defaultTestimonials = [
  {
    _id: '1',
    name: 'Kouassi Jean',
    company: 'Boulangerie La Mie Dorée',
    rating: 5,
    text: 'Boostify a transformé l\'image de ma boulangerie. Le logo et les flyers sont magnifiques. Merci Bello !',
    lang: 'fr',
    approved: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Amina Diallo',
    company: 'Boutique Élégance',
    rating: 5,
    text: 'Très professionnel, réactif et créatif. Je recommande Boostify à tous les entrepreneurs.',
    lang: 'fr',
    approved: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Yao Marcel',
    company: 'Restaurant Chez Kofi',
    rating: 4,
    text: 'Les menus et les visuels Instagram ont vraiment boosté ma présence en ligne. Excellent travail.',
    lang: 'fr',
    approved: true,
    createdAt: new Date().toISOString()
  }
];

const testimonialValidation = [
  body('name').trim().notEmpty().withMessage('Le nom est obligatoire'),
  body('text').trim().notEmpty().withMessage('Le commentaire est obligatoire'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5')
];

// GET /api/testimonials - Public approved testimonials
router.get('/', async (req, res) => {
  try {
    let testimonials;
    if (isMongoConnected()) {
      testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
    } else {
      testimonials = readJsonFile(TESTIMONIALS_FILE, defaultTestimonials)
        .filter(t => t.approved)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    res.json({ success: true, count: testimonials.length, testimonials });
  } catch (error) {
    console.error('Erreur liste témoignages:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// GET /api/testimonials/all - All testimonials (admin)
router.get('/all', adminAuth, async (req, res) => {
  try {
    let testimonials;
    if (isMongoConnected()) {
      testimonials = await Testimonial.find().sort({ createdAt: -1 });
    } else {
      testimonials = readJsonFile(TESTIMONIALS_FILE, defaultTestimonials)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    res.json({ success: true, count: testimonials.length, testimonials });
  } catch (error) {
    console.error('Erreur liste témoignages admin:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// POST /api/testimonials - Add new testimonial
router.post('/', testimonialValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez vérifier les champs du formulaire.',
        errors: errors.array()
      });
    }

    const { name, company, rating, text, lang } = req.body;
    const testimonialData = {
      name: name.trim(),
      company: company ? company.trim() : '',
      rating: parseInt(rating) || 5,
      text: text.trim(),
      lang: lang || 'fr',
      approved: false,
      createdAt: new Date().toISOString()
    };

    let testimonial;

    if (isMongoConnected()) {
      testimonial = new Testimonial(testimonialData);
      await testimonial.save();
    } else {
      const testimonials = readJsonFile(TESTIMONIALS_FILE, defaultTestimonials);
      testimonialData._id = generateId();
      testimonials.unshift(testimonialData);
      writeJsonFile(TESTIMONIALS_FILE, testimonials);
      testimonial = testimonialData;
    }

    sendNewTestimonialNotification(testimonial);

    res.status(201).json({
      success: true,
      message: 'Merci ! Votre avis sera publié après validation.',
      testimonial: { id: testimonial._id }
    });
  } catch (error) {
    console.error('Erreur création témoignage:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// PATCH /api/testimonials/:id/approve
router.patch('/:id/approve', adminAuth, async (req, res) => {
  try {
    let testimonial;
    if (isMongoConnected()) {
      testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    } else {
      const testimonials = readJsonFile(TESTIMONIALS_FILE, defaultTestimonials);
      const index = testimonials.findIndex(t => t._id === req.params.id);
      if (index !== -1) {
        testimonials[index].approved = true;
        writeJsonFile(TESTIMONIALS_FILE, testimonials);
        testimonial = testimonials[index];
      }
    }

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Avis non trouvé.' });
    }
    res.json({ success: true, message: 'Avis approuvé.', testimonial });
  } catch (error) {
    console.error('Erreur approbation témoignage:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// DELETE /api/testimonials/:id
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    let deleted = false;
    if (isMongoConnected()) {
      const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
      deleted = !!testimonial;
    } else {
      const testimonials = readJsonFile(TESTIMONIALS_FILE, defaultTestimonials);
      const filtered = testimonials.filter(t => t._id !== req.params.id);
      deleted = filtered.length !== testimonials.length;
      writeJsonFile(TESTIMONIALS_FILE, filtered);
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Avis non trouvé.' });
    }
    res.json({ success: true, message: 'Avis supprimé.' });
  } catch (error) {
    console.error('Erreur suppression témoignage:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
