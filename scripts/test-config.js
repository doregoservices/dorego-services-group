#!/usr/bin/env node
/**
 * Script de test pour vérifier MongoDB et Gmail
 * Usage : node scripts/test-config.js
 */

require('dotenv').config();

const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

async function testMongoDB() {
  console.log('🗄️  Test de connexion MongoDB...');
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MONGODB_URI non défini. Mode fichier local activé.');
      return false;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté avec succès !');
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
    return false;
  }
}

async function testEmail() {
  console.log('\n📧 Test d\'envoi d\'email...');
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('⚠️  SMTP_USER ou SMTP_PASS non défini. Emails désactivés.');
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.verify();
    console.log('✅ Connexion SMTP OK');

    const to = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER;
    await transporter.sendMail({
      from: `Boostify Test <${process.env.SMTP_USER}>`,
      to,
      subject: '✅ Test Boostify - Configuration email réussie',
      html: `
        <h2>Test de configuration Boostify</h2>
        <p>Si vous recevez cet email, la configuration email fonctionne correctement.</p>
        <p>Date : ${new Date().toLocaleString('fr-FR')}</p>
      `
    });

    console.log(`✅ Email de test envoyé à ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur email:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Test de configuration Boostify\n');
  const mongoOk = await testMongoDB();
  const emailOk = await testEmail();

  console.log('\n--- RÉSULTAT ---');
  console.log(`MongoDB : ${mongoOk ? '✅ OK' : '❌ ÉCHEC ou non configuré'}`);
  console.log(`Email   : ${emailOk ? '✅ OK' : '❌ ÉCHEC ou non configuré'}`);

  if (!mongoOk || !emailOk) {
    console.log('\n💡 Consulte le fichier GUIDE_MONGODB_GMAIL.md pour la configuration.');
    process.exit(1);
  }
}

main();
