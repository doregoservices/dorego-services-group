require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');

const ordersRouter = require('./routes/orders');
const configRouter = require('./routes/config');
const testimonialsRouter = require('./routes/testimonials');
const authRouter = require('./routes/auth');
const portfolioRouter = require('./routes/portfolio');
const servicesRouter = require('./routes/services');
const packsRouter = require('./routes/packs');
const { seedAll } = require('./utils/seed');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log('✅ Connecté à MongoDB');
      await seedAll();
      configRouter.migrateLogo();
      portfolioRouter.migratePortfolioImages();
    })
    .catch(err => {
      console.error('❌ Erreur connexion MongoDB:', err.message);
      console.log('⚠️  Le serveur fonctionne sans base de données (mode fichier temporaire).');
    });
} else {
  console.log('⚠️  MONGODB_URI non défini. Le serveur démarre sans base de données.');
  console.log('💡 Crée une base MongoDB gratuite sur https://www.mongodb.com/atlas');
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/config', configRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/services', servicesRouter);
app.use('/api/packs', packsRouter);

// Admin dashboard route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    success: true,
    message: 'Boostify API is running',
    database: dbStatus
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Erreur:', err.message);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de l\'upload du fichier.'
    });
  }
  res.status(500).json({
    success: false,
    message: 'Erreur serveur interne.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Boostify server running on http://localhost:${PORT}`);
  console.log(`📊 Admin dashboard: http://localhost:${PORT}/admin`);
  console.log(`📧 Notifications email: ${process.env.SMTP_USER ? 'activées' : 'désactivées'}`);
});
