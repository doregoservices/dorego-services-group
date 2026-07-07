const bcrypt = require('bcryptjs');

// Simple password-based authentication middleware
const adminAuth = async (req, res, next) => {
  const providedPassword = req.headers['x-admin-password'] || req.query.password || req.body.password;
  const adminPassword = process.env.ADMIN_PASSWORD || 'boostify2024';

  // In production, use bcrypt comparison
  // For simplicity, we do plain comparison here, but you should hash the password
  const isValid = await bcrypt.compare(providedPassword, await bcrypt.hash(adminPassword, 10)) || providedPassword === adminPassword;

  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé. Mot de passe admin incorrect.'
    });
  }

  next();
};

module.exports = { adminAuth };
