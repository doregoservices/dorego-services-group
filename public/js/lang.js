// Language management
const langData = {
  fr: {
    // Page title
    title: "Mon Site | Votre activité",
    // Navigation
    nav: {
      services: "Services",
      packs: "Packs",
      portfolio: "Portfolio",
      about: "À propos",
      order: "Commander"
    },
    // Hero
    hero: {
      eyebrow: "Votre activité",
      title1: "Votre",
      title2: "titre principal",
      desc: "Décrivez votre activité ici. Ce texte est modifiable dans l'admin.",
      cta1: "Demander un devis",
      cta2: "Voir nos réalisations",
      stat1: "projets réalisés",
      stat2: "clients satisfaits",
      stat3: "années d'expérience"
    },
    // Sections
    sections: {
      servicesTitle: "Nos services",
      servicesEyebrow: "Ce que nous proposons",
      packsTitle: "Nos formules",
      packsEyebrow: "Choisissez ce qui vous convient",
      processTitle: "Comment nous travaillons",
      processEyebrow: "Notre méthode",
      portfolioTitle: "Nos réalisations",
      portfolioEyebrow: "Exemples de notre travail",
      aboutTitle: "À propos de nous",
      aboutEyebrow: "À propos",
      contactTitle: "Lancez votre projet dès maintenant",
      contactEyebrow: "Commander"
    },
    // Services
    services: {
      graphicTitle: "Création graphique",
      graphicDesc: "Logos, affiches, flyers, cartes de visite, bannières, menus et visuels réseaux sociaux.",
      printTitle: "Impression",
      printDesc: "Cartes de visite, flyers, bâches, autocollants, T-shirts personnalisés, facturiers et carnets de reçus.",
      socialTitle: "Réseaux sociaux",
      socialDesc: "Création de pages, contenus mensuels, publicités Facebook/Instagram et optimisation de profils.",
      businessTitle: "Services entreprises",
      businessDesc: "Identité visuelle complète, présentations, brochures, catalogues et signatures e-mail.",
      digitalTitle: "Services numériques",
      digitalDesc: "Sites vitrines, CV professionnels, portfolios, QR codes personnalisés et création de contenu.",
      adsTitle: "Accompagnement publicitaire",
      adsDesc: "Stratégie, création de campagnes, suivi et optimisation pour maximiser votre retour sur investissement."
    },
    // Packs
    packs: {
      starterBadge: "Idéal démarrage",
      businessBadge: "Le plus populaire",
      premiumBadge: "Tout inclus",
      starterBtn: "Choisir ce pack",
      businessBtn: "Choisir ce pack",
      premiumBtn: "Choisir ce pack",
      logo: "1 logo professionnel",
      card: "Carte de visite",
      fbVisual: "Visuel Facebook",
      flyer: "Flyer",
      fbCover: "Couverture Facebook",
      identity: "Identité visuelle complète",
      social10: "10 visuels réseaux sociaux",
      support: "Accompagnement publicitaire"
    },
    // Process
    process: {
      briefTitle: "Brief",
      briefDesc: "Vous décrivez votre projet, vos objectifs et vos inspirations.",
      designTitle: "Conception",
      designDesc: "Nous créons des propositions créatives et affinons ensemble.",
      deliveryTitle: "Livraison",
      deliveryDesc: "Vous recevez vos fichiers prêts à l'impression et au web."
    },
    // Portfolio
    portfolio: {
      card1: "Carte de visite premium",
      card2: "Sacs & packaging",
      card3: "T-shirt personnalisé",
      card4: "Logo & identité visuelle"
    },
    // About
    about: {
      role: "Votre activité",
      p1: "Présentez votre activité, votre expérience et ce qui vous différencie. Ce texte est modifiable dans l'admin.",
      p2: "Votre localisation et zone d'intervention."
    },
    // Testimonials
    testimonials: {
      eyebrow: "Ils nous ont fait confiance",
      title: "Ce que disent nos clients",
      leaveReview: "Laisser un avis",
      shareExperience: "Partagez votre expérience",
      willBeValidated: "Votre avis sera publié après validation.",
      yourName: "Votre nom",
      rating: "Note",
      yourReview: "Votre commentaire",
      sendReview: "Envoyer mon avis",
      success: "✅ Merci ! Votre avis sera publié après validation.",
      error: "❌ Une erreur est survenue. Veuillez réessayer."
    },
    // Contact
    contact: {
      title: "Parlons de votre projet",
      desc: "Remplissez le formulaire pour demander un devis ou commander un pack. Je vous réponds dans les 24 heures.",
      name: "Nom complet",
      email: "Email",
      phone: "Téléphone",
      company: "Entreprise (optionnel)",
      service: "Pack ou service souhaité",
      website: "Création de site web",
      select: "Sélectionnez...",
      message: "Décrivez votre projet",
      language: "Langue de préférence",
      submit: "Envoyer la demande",
      success: "✅ Demande envoyée avec succès ! Je vous réponds dans les 24 heures.",
      error: "❌ Une erreur est survenue. Veuillez réessayer ou me contacter directement."
    },
    // Footer
    footer: {
      tagline: "Votre slogan ou message de footer.",
      services: "Services",
      packs: "Packs",
      contact: "Contact",
      rights: "Tous droits réservés."
    }
  },
  en: {
    title: "My Site | Your activity",
    nav: {
      services: "Services",
      packs: "Packs",
      portfolio: "Portfolio",
      about: "About",
      order: "Order"
    },
    hero: {
      eyebrow: "Your activity",
      title1: "Your",
      title2: "main title",
      desc: "Describe your activity here. This text is editable in the admin.",
      cta1: "Request a quote",
      cta2: "See our work",
      stat1: "projects completed",
      stat2: "happy clients",
      stat3: "years of experience"
    },
    sections: {
      servicesTitle: "Our services",
      servicesEyebrow: "What we offer",
      packsTitle: "Our packages",
      packsEyebrow: "Choose what suits you",
      processTitle: "How we work",
      processEyebrow: "Our method",
      portfolioTitle: "Our works",
      portfolioEyebrow: "Examples of our work",
      aboutTitle: "About us",
      aboutEyebrow: "About",
      contactTitle: "Start your project now",
      contactEyebrow: "Order"
    },
    services: {
      graphicTitle: "Graphic design",
      graphicDesc: "Logos, posters, flyers, business cards, banners, menus and social media visuals.",
      printTitle: "Printing",
      printDesc: "Business cards, flyers, banners, stickers, custom T-shirts, invoices and receipt books.",
      socialTitle: "Social media",
      socialDesc: "Page creation, monthly content, Facebook/Instagram ads and profile optimization.",
      businessTitle: "Business services",
      businessDesc: "Complete visual identity, presentations, brochures, catalogs and email signatures.",
      digitalTitle: "Digital services",
      digitalDesc: "Showcase websites, professional CVs, portfolios, custom QR codes and content creation.",
      adsTitle: "Advertising support",
      adsDesc: "Strategy, campaign creation, tracking and optimization to maximize your return on investment."
    },
    packs: {
      starterBadge: "Ideal startup",
      businessBadge: "Most popular",
      premiumBadge: "All inclusive",
      starterBtn: "Choose this pack",
      businessBtn: "Choose this pack",
      premiumBtn: "Choose this pack",
      logo: "1 professional logo",
      card: "Business card",
      fbVisual: "Facebook visual",
      flyer: "Flyer",
      fbCover: "Facebook cover",
      identity: "Complete visual identity",
      social10: "10 social media visuals",
      support: "Advertising support"
    },
    process: {
      briefTitle: "Brief",
      briefDesc: "You describe your project, goals and inspirations.",
      designTitle: "Design",
      designDesc: "We create creative proposals and refine them together.",
      deliveryTitle: "Delivery",
      deliveryDesc: "You receive your files ready for print and web."
    },
    portfolio: {
      card1: "Premium business card",
      card2: "Bags & packaging",
      card3: "Custom T-shirt",
      card4: "Logo & visual identity"
    },
    about: {
      role: "Your activity",
      p1: "Describe your activity, experience and what makes you different. This text is editable in the admin.",
      p2: "Your location and service area."
    },
    // Testimonials
    testimonials: {
      eyebrow: "They trusted us",
      title: "What our clients say",
      leaveReview: "Leave a review",
      shareExperience: "Share your experience",
      willBeValidated: "Your review will be published after validation.",
      yourName: "Your name",
      rating: "Rating",
      yourReview: "Your review",
      sendReview: "Send my review",
      success: "✅ Thank you! Your review will be published after validation.",
      error: "❌ An error occurred. Please try again."
    },
    contact: {
      title: "Let's talk about your project",
      desc: "Fill out the form to request a quote or order a pack. I will respond within 24 hours.",
      name: "Full name",
      email: "Email",
      phone: "Phone",
      company: "Company (optional)",
      service: "Desired pack or service",
      website: "Website creation",
      select: "Select...",
      message: "Describe your project",
      language: "Preferred language",
      submit: "Send request",
      success: "✅ Request sent successfully! I will respond within 24 hours.",
      error: "❌ An error occurred. Please try again or contact me directly."
    },
    footer: {
      tagline: "Your slogan or footer message.",
      services: "Services",
      packs: "Packs",
      contact: "Contact",
      rights: "All rights reserved."
    }
  }
};

let currentLang = 'fr';

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'fr' ? 'fr' : 'en';
  document.title = langData[lang].title;

  // Update all elements with data-fr and data-en
  document.querySelectorAll('[data-fr][data-en]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  // Update buttons with pack data
  document.querySelectorAll('.select-pack').forEach(btn => {
    btn.textContent = langData[lang].packs[btn.dataset.packKey || 'starterBtn'];
  });

  // Update options in select
  const select = document.getElementById('pack');
  if (select) {
    select.options[0].textContent = langData[lang].contact.select;
    // The other options are dynamic packs loaded by main.js, so only update the "Other" option if it exists
    const otherOption = Array.from(select.options).find(o => o.value === 'Autre');
    if (otherOption) {
      otherOption.textContent = lang === 'fr' ? "Autre (précisez ci-dessous)" : "Other (specify below)";
    }
  }

  // Update language preference select
  const langueSelect = document.getElementById('langue');
  if (langueSelect) {
    langueSelect.options[0].textContent = 'Français';
    langueSelect.options[1].textContent = 'English';
  }

  // Toggle buttons
  const btnFr = document.getElementById('btn-fr');
  const btnEn = document.getElementById('btn-en');
  if (btnFr && btnEn) {
    btnFr.classList.toggle('active', lang === 'fr');
    btnEn.classList.toggle('active', lang === 'en');
  }

  // Store preference
  localStorage.setItem('boostify-lang', lang);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('boostify-lang') || 'fr';
  setLanguage(savedLang);

  const btnFr = document.getElementById('btn-fr');
  const btnEn = document.getElementById('btn-en');
  if (btnFr) btnFr.addEventListener('click', () => setLanguage('fr'));
  if (btnEn) btnEn.addEventListener('click', () => setLanguage('en'));
});
