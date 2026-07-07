const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendNewOrderNotification(order) {
  const to = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER;
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'contact@boostify.com';
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

  const subject = `🔔 Nouvelle commande Boostify - ${order.pack}`;
  const html = `
    <h2>Nouvelle commande reçue sur Boostify</h2>
    <p><strong>Client :</strong> ${order.name}</p>
    <p><strong>Email :</strong> ${order.email}</p>
    <p><strong>Téléphone :</strong> ${order.phone}</p>
    <p><strong>Entreprise :</strong> ${order.company || 'Non renseignée'}</p>
    <p><strong>Pack/Service :</strong> ${order.pack}</p>
    <p><strong>Langue :</strong> ${order.langue}</p>
    <p><strong>Message :</strong></p>
    <blockquote>${order.message}</blockquote>
    <p><strong>Date :</strong> ${new Date(order.createdAt).toLocaleString('fr-FR')}</p>
    <p><a href="${siteUrl}/admin" style="padding:10px 20px;background:#F5A623;color:#111;text-decoration:none;border-radius:5px;font-weight:bold;">Voir dans l'admin</a></p>
  `;

  try {
    await transporter.sendMail({
      from: `Boostify <${from}>`,
      to,
      subject,
      html
    });
    console.log('📧 Email de notification envoyé pour la commande', order._id);
  } catch (error) {
    console.error('Erreur envoi email:', error.message);
  }
}

async function sendOrderConfirmation(clientEmail, order) {
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'contact@boostify.com';
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

  const subject = '✅ Confirmation de votre demande - Boostify';
  const html = `
    <h2>Merci ${order.name} !</h2>
    <p>Votre demande a bien été reçue. Je vous réponds dans les 24 heures.</p>
    <h3>Récapitulatif de votre demande</h3>
    <p><strong>Pack/Service :</strong> ${order.pack}</p>
    <p><strong>Message :</strong></p>
    <blockquote>${order.message}</blockquote>
    <p>À très bientôt,<br><strong>Bello Shouaïb - Boostify</strong></p>
    <p><a href="${siteUrl}" style="padding:10px 20px;background:#F5A623;color:#111;text-decoration:none;border-radius:5px;font-weight:bold;">Visiter le site</a></p>
  `;

  try {
    await transporter.sendMail({
      from: `Boostify <${from}>`,
      to: clientEmail,
      subject,
      html
    });
    console.log('📧 Email de confirmation envoyé au client', clientEmail);
  } catch (error) {
    console.error('Erreur envoi email confirmation:', error.message);
  }
}

async function sendNewTestimonialNotification(testimonial) {
  const to = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER;
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'contact@boostify.com';
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

  const subject = `💬 Nouvel avis client en attente - ${testimonial.name}`;
  const html = `
    <h2>Nouvel avis client reçu</h2>
    <p><strong>Nom :</strong> ${testimonial.name}</p>
    <p><strong>Entreprise :</strong> ${testimonial.company || 'Non renseignée'}</p>
    <p><strong>Note :</strong> ${'⭐'.repeat(testimonial.rating)}</p>
    <p><strong>Commentaire :</strong></p>
    <blockquote>${testimonial.text}</blockquote>
    <p><a href="${siteUrl}/admin" style="padding:10px 20px;background:#F5A623;color:#111;text-decoration:none;border-radius:5px;font-weight:bold;">Approuver dans l'admin</a></p>
  `;

  try {
    await transporter.sendMail({
      from: `Boostify <${from}>`,
      to,
      subject,
      html
    });
    console.log('📧 Email de notification avis envoyé');
  } catch (error) {
    console.error('Erreur envoi email avis:', error.message);
  }
}

module.exports = {
  sendNewOrderNotification,
  sendOrderConfirmation,
  sendNewTestimonialNotification
};
