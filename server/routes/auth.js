const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// POST /api/auth/login - Verify admin password
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'boostify2024';

    // Simple password check (in production, hash the password)
    const isValid = password === adminPassword;

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe incorrect.'
      });
    }

    res.json({
      success: true,
      message: 'Authentification réussie.'
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur.'
    });
  }
});

module.exports = router;
