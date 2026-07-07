// Mobile menu
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const header = document.getElementById('header');
  const navLinks = nav.querySelectorAll('a');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('open');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('open');
    });
  });

  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Scroll reveal animations
  const revealElements = document.querySelectorAll('.service-card, .pack-card, .step, .portfolio-item, .testimonial-card, .about-grid, .contact-grid');
  window.revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.classList.add('reveal');
    window.revealObserver.observe(el);
  });

  // Load dynamic content
  loadConfig();
  loadServices();
  loadPacks();
  loadProducts();
  loadTestimonials();
  loadPortfolio();
  updateCartCount();

  // Pack selection (event delegation for dynamic packs)
  const packsGrid = document.getElementById('packsGrid');
  const packSelect = document.getElementById('pack');

  if (packsGrid) {
    packsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.select-pack');
      if (!btn) return;
      const selectedPack = btn.dataset.pack;
      if (packSelect) {
        packSelect.value = selectedPack;
      }
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Order form submission
  const orderForm = document.getElementById('orderForm');
  const formMessage = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitBtn');

  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = currentLang === 'fr' ? 'Envoi en cours...' : 'Sending...';
      formMessage.className = 'form-message';
      formMessage.style.display = 'none';

      const formData = new FormData(orderForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
          formMessage.textContent = currentLang === 'fr'
            ? '✅ Demande envoyée avec succès ! Je vous réponds dans les 24 heures.'
            : '✅ Request sent successfully! I will respond within 24 hours.';
          formMessage.className = 'form-message success';
          orderForm.reset();
        } else {
          throw new Error(result.message || 'Erreur serveur');
        }
      } catch (error) {
        console.error('Erreur:', error);
        formMessage.textContent = currentLang === 'fr'
          ? '❌ Une erreur est survenue. Veuillez réessayer ou me contacter directement.'
          : '❌ An error occurred. Please try again or contact me directly.';
        formMessage.className = 'form-message error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // Testimonial modal
  const openTestimonialBtn = document.getElementById('openTestimonialBtn');
  const testimonialModal = document.getElementById('testimonialModal');
  const closeTestimonialModal = document.getElementById('closeTestimonialModal');
  const testimonialForm = document.getElementById('testimonialForm');
  const testimonialMessage = document.getElementById('testimonialMessage');

  if (openTestimonialBtn && testimonialModal) {
    openTestimonialBtn.addEventListener('click', () => {
      testimonialModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeTestimonialModal && testimonialModal) {
    closeTestimonialModal.addEventListener('click', () => {
      testimonialModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    testimonialModal.addEventListener('click', (e) => {
      if (e.target === testimonialModal) {
        testimonialModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (testimonialForm) {
    testimonialForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = testimonialForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = currentLang === 'fr' ? 'Envoi en cours...' : 'Sending...';
      testimonialMessage.className = 'form-message';
      testimonialMessage.style.display = 'none';

      const formData = new FormData(testimonialForm);
      const data = Object.fromEntries(formData.entries());
      data.lang = currentLang;

      try {
        const response = await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
          testimonialMessage.textContent = currentLang === 'fr'
            ? '✅ Merci ! Votre avis sera publié après validation.'
            : '✅ Thank you! Your review will be published after validation.';
          testimonialMessage.className = 'form-message success';
          testimonialForm.reset();
          setTimeout(() => {
            testimonialModal.classList.remove('active');
            document.body.style.overflow = '';
          }, 2000);
        } else {
          throw new Error(result.message || 'Erreur serveur');
        }
      } catch (error) {
        console.error('Erreur:', error);
        testimonialMessage.textContent = currentLang === 'fr'
          ? '❌ Une erreur est survenue. Veuillez réessayer.'
          : '❌ An error occurred. Please try again.';
        testimonialMessage.className = 'form-message error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // Cart modal
  const cartBtn = document.getElementById('cartBtn');
  const cartModal = document.getElementById('cartModal');
  const closeCartModal = document.getElementById('closeCartModal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (cartBtn && cartModal) {
    cartBtn.addEventListener('click', openCart);
  }

  if (closeCartModal && cartModal) {
    closeCartModal.addEventListener('click', closeCart);
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) closeCart();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      closeCart();
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      const messageField = document.getElementById('message');
      if (messageField) {
        const cart = getCart();
        const items = cart.map(i => `${i.name} - ${i.price}`).join('\n');
        const intro = currentLang === 'fr' ? 'Commande depuis le panier :' : 'Order from cart:';
        messageField.value = `${intro}\n${items}`;
      }
    });
  }
});

// Load site configuration
async function loadConfig() {
  try {
    const response = await fetch('/api/config');
    const result = await response.json();

    if (!result.success || !result.config) return;

    const config = result.config;

    // Update logo images
    const logoIds = ['siteLogo', 'heroLogo', 'aboutLogo', 'footerLogo'];
    logoIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && config.logoPath) {
        el.src = config.logoPath;
      }
    });

    // Update favicon and social sharing images
    if (config.logoPath) {
      const favicon = document.getElementById('favicon');
      if (favicon) favicon.href = config.logoPath;
      const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (appleTouchIcon) appleTouchIcon.href = config.logoPath;
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) ogImage.setAttribute('content', config.logoPath);
      const twitterImage = document.querySelector('meta[property="twitter:image"]');
      if (twitterImage) twitterImage.setAttribute('content', config.logoPath);
    }

    // Update favicon (legacy field)
    const favicon = document.getElementById('favicon');
    if (favicon && config.faviconPath) {
      favicon.href = config.faviconPath;
    }

    // Update founder info
    if (config.founderName) {
      const founderName = document.getElementById('founderName');
      const footerFounderName = document.getElementById('footerFounderName');
      if (founderName) founderName.textContent = config.founderName;
      if (footerFounderName) footerFounderName.textContent = config.founderName;
    }

    if (config.role) {
      const founderRole = document.getElementById('founderRole');
      if (founderRole) founderRole.textContent = config.role;
    }

    // Update contact info
    if (config.email) {
      updateContactItem('aboutEmail', 'mailto:', config.email, config.email);
      updateContactItem('contactEmail', 'mailto:', config.email, config.email);
      updateContactItem('footerEmail', 'mailto:', config.email, config.email);
    }
    if (config.phone) {
      const cleanPhone = config.phone.replace(/\s/g, '');
      updateContactItem('aboutPhone', 'tel:', cleanPhone, config.phone);
      updateContactItem('contactPhone', 'tel:', cleanPhone, config.phone);
      updateContactItem('footerPhone', 'tel:', cleanPhone, config.phone);
    }
    if (config.whatsapp) {
      const cleanWhatsapp = config.whatsapp.replace(/[\s+]/g, '');
      updateContactItem('aboutWhatsapp', 'https://wa.me/', cleanWhatsapp, `WhatsApp : ${config.whatsapp}`);
      updateContactItem('contactWhatsapp', 'https://wa.me/', cleanWhatsapp, `WhatsApp : ${config.whatsapp}`);
      updateContactItem('footerWhatsapp', 'https://wa.me/', cleanWhatsapp, 'WhatsApp');

      // Update WhatsApp float button
      const whatsappFloat = document.getElementById('whatsappFloat');
      if (whatsappFloat) {
        const message = currentLang === 'fr'
          ? `Bonjour ${config.siteName || 'Mon Site'}, je souhaite avoir plus d'informations sur vos services.`
          : `Hello ${config.siteName || 'My Site'}, I would like more information about your services.`;
        whatsappFloat.href = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(message)}`;
      }
    }
    if (config.location) {
      updateContactItem('contactLocation', null, null, config.location, false);
    }

    // Update website link
    if (config.website) {
      const websiteLink = document.getElementById('websiteLink');
      const websiteText = document.getElementById('websiteText');
      if (websiteLink) {
        websiteLink.href = config.website.startsWith('http') ? config.website : `https://${config.website}`;
        websiteLink.style.display = 'flex';
      }
      if (websiteText) websiteText.textContent = config.website.replace(/^https?:\/\//, '');
    } else {
      const websiteLink = document.getElementById('websiteLink');
      if (websiteLink) websiteLink.style.display = 'none';
    }

    // Update hero title
    if (config.heroTitle) {
      const heroTitleMain = document.getElementById('heroTitleMain');
      const heroTitleAccent = document.getElementById('heroTitleAccent');
      if (heroTitleMain) {
        heroTitleMain.textContent = config.heroTitle;
        heroTitleMain.setAttribute('data-fr', config.heroTitle);
      }
      if (heroTitleAccent) {
        if (config.heroSubtitle) {
          heroTitleAccent.textContent = config.heroSubtitle;
          heroTitleAccent.setAttribute('data-fr', config.heroSubtitle);
          heroTitleAccent.style.display = 'inline';
        } else {
          heroTitleAccent.style.display = 'none';
        }
      }
    }

    // Update site name and slogan
    if (config.siteName) {
      document.title = config.siteName;
      const footerSiteName = document.getElementById('footerSiteName');
      if (footerSiteName) footerSiteName.textContent = config.siteName;
    }

    if (config.slogan) {
      const sloganEl = document.getElementById('sloganText');
      if (sloganEl) {
        sloganEl.textContent = config.slogan;
        sloganEl.setAttribute('data-fr', config.slogan);
      }
    }

    if (config.footerText) {
      const footerTextEl = document.getElementById('footerText');
      if (footerTextEl) {
        footerTextEl.textContent = config.footerText;
      }
    }

    if (config.description) {
      const heroDesc = document.getElementById('heroDescription');
      if (heroDesc) {
        heroDesc.textContent = config.description;
        heroDesc.setAttribute('data-fr', config.description);
      }
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', config.description);
    }

    if (config.aboutTitle) {
      const aboutTitle = document.getElementById('aboutTitle');
      if (aboutTitle) {
        aboutTitle.textContent = config.aboutTitle;
        aboutTitle.setAttribute('data-fr', config.aboutTitle);
      }
    }

    if (config.aboutText) {
      const aboutText = document.getElementById('aboutText');
      if (aboutText) {
        aboutText.textContent = config.aboutText;
        aboutText.setAttribute('data-fr', config.aboutText);
      }
    }

    if (config.metaKeywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) metaKeywords.setAttribute('content', config.metaKeywords);
    }

    if (config.primaryColor) {
      document.documentElement.style.setProperty('--orange', config.primaryColor);
    }
    if (config.darkColor) {
      document.documentElement.style.setProperty('--black', config.darkColor);
    }

    // Update section headers
    updateText('servicesEyebrow', config.servicesEyebrow);
    updateText('servicesTitle', config.servicesTitle);
    updateText('packsEyebrow', config.packsEyebrow);
    updateText('packsTitle', config.packsTitle);
    updateText('portfolioEyebrow', config.portfolioEyebrow);
    updateText('portfolioTitle', config.portfolioTitle);
    updateText('testimonialsEyebrow', config.testimonialsEyebrow);
    updateText('testimonialsTitle', config.testimonialsTitle);
    updateText('productsTitle', config.productsTitle);
    updateText('productsEyebrow', config.productsEyebrow);

    // Update hero eyebrow and tags
    updateText('heroEyebrow', config.heroEyebrow);
    if (config.heroTags) {
      const tagsContainer = document.getElementById('heroTags');
      if (tagsContainer) {
        const tags = config.heroTags.split(',').map(t => t.trim()).filter(Boolean);
        tagsContainer.innerHTML = tags.map(t => `<span>${escapeHtml(t)}</span>`).join('');
      }
    }

    // Update process steps
    updateText('processStep1Title', config.processStep1Title);
    updateText('processStep1Desc', config.processStep1Desc);
    updateText('processStep2Title', config.processStep2Title);
    updateText('processStep2Desc', config.processStep2Desc);
    updateText('processStep3Title', config.processStep3Title);
    updateText('processStep3Desc', config.processStep3Desc);

  } catch (error) {
    console.error('Erreur chargement config:', error);
  }
}

function updateText(id, value) {
  if (!value) return;
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
    if (el.hasAttribute('data-fr')) {
      el.setAttribute('data-fr', value);
    }
  }
}

function updateContactItem(id, prefix, value, displayText, isLink = true) {
  const el = document.getElementById(id);
  if (!el) return;
  if (isLink && prefix !== null && value !== null) {
    el.href = `${prefix}${value}`;
  }
  const textSpan = el.querySelector('.contact-text') || el.querySelector('span:last-child');
  if (textSpan) textSpan.textContent = displayText;
}

// Load testimonials (replaces static content with server-approved testimonials)
async function loadTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;

  try {
    const response = await fetch(`/api/testimonials?_t=${Date.now()}`);
    const result = await response.json();

    if (!result.success || !result.testimonials || result.testimonials.length === 0) {
      grid.innerHTML = `<div class="empty" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">Aucun avis pour le moment.</div>`;
      return;
    }

    const cards = result.testimonials.map(t => {
      const initials = t.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const stars = '⭐'.repeat(t.rating || 5);
      return `
        <div class="testimonial-card reveal">
          <div class="testimonial-quote">"</div>
          <div class="testimonial-stars">${stars}</div>
          <p class="testimonial-text">${escapeHtml(t.text)}</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${initials}</div>
            <div>
              <div class="testimonial-name">${escapeHtml(t.name)}</div>
              <div class="testimonial-company">${escapeHtml(t.company || '')}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    grid.innerHTML = cards;
    grid.querySelectorAll('.reveal').forEach(el => window.revealObserver.observe(el));
  } catch (error) {
    console.error('Erreur chargement témoignages:', error);
  }
}

// Load portfolio (replaces static content with server portfolio items)
async function loadPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  try {
    const response = await fetch(`/api/portfolio?_t=${Date.now()}`);
    const result = await response.json();

    if (!result.success || !result.items || result.items.length === 0) {
      grid.innerHTML = `<div class="empty" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">Aucune réalisation pour le moment.</div>`;
      return;
    }

    const items = result.items.map(item => {
      const title = currentLang === 'en' && item.titleEn ? item.titleEn : item.title;
      const imageSrc = item.imagePath.startsWith('data:') ? item.imagePath : `${item.imagePath}?_t=${Date.now()}`;
      return `
        <div class="portfolio-item reveal">
          <div class="portfolio-img">
            <img src="${imageSrc}" alt="${escapeHtml(title)}" loading="lazy">
          </div>
          <p>${escapeHtml(title)}</p>
        </div>
      `;
    }).join('');

    grid.innerHTML = items;
    grid.querySelectorAll('.reveal').forEach(el => window.revealObserver.observe(el));
  } catch (error) {
    console.error('Erreur chargement portfolio:', error);
  }
}

// Load services (replaces static if server returns data)
async function loadServices() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;

  try {
    const response = await fetch(`/api/services?_t=${Date.now()}`);
    const result = await response.json();

    if (!result.success || !result.services || result.services.length === 0) {
      grid.innerHTML = `<div class="empty" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">Aucun service pour le moment.</div>`;
      return;
    }

    const cards = result.services.map(s => {
      const title = currentLang === 'en' && s.titleEn ? s.titleEn : s.title;
      const description = currentLang === 'en' && s.descriptionEn ? s.descriptionEn : s.description;
      return `
        <div class="service-card reveal">
          <div class="service-icon">${escapeHtml(s.icon || '')}</div>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(description)}</p>
        </div>
      `;
    }).join('');

    grid.innerHTML = cards;
    grid.querySelectorAll('.reveal').forEach(el => window.revealObserver.observe(el));
  } catch (error) {
    console.error('Erreur chargement services:', error);
  }
}

// Load packs (replaces static if server returns data)
async function loadPacks() {
  const grid = document.getElementById('packsGrid');
  const packSelect = document.getElementById('pack');
  if (!grid) return;

  try {
    const response = await fetch(`/api/packs?_t=${Date.now()}`);
    const result = await response.json();

    if (!result.success || !result.packs || result.packs.length === 0) {
      grid.innerHTML = `<div class="empty" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">Aucun pack pour le moment.</div>`;
      if (packSelect) {
        packSelect.innerHTML = '<option value="" data-fr="Sélectionnez..." data-en="Select...">Sélectionnez...</option>' +
          '<option value="Autre" data-fr="Autre (précisez ci-dessous)" data-en="Other (specify below)">Autre (précisez ci-dessous)</option>';
      }
      return;
    }

    const packs = result.packs.map(p => {
      const name = currentLang === 'en' && p.nameEn ? p.nameEn : p.name;
      const features = currentLang === 'en' && p.featuresEn ? p.featuresEn : p.features;
      const badge = p.popular
        ? `<div class="pack-badge popular" data-fr="Le plus populaire" data-en="Most popular">Le plus populaire</div>`
        : `<div class="pack-badge" data-fr="Pack" data-en="Pack">Pack</div>`;
      const featuresList = (features || []).map(f => `<li>${escapeHtml(f)}</li>`).join('');
      return `
        <div class="pack-card ${p.popular ? 'featured' : ''} reveal">
          ${badge}
          <h3>${escapeHtml(name)}</h3>
          <div class="pack-price">${escapeHtml(p.price)}</div>
          <ul>${featuresList}</ul>
          <button class="btn btn-primary select-pack" data-pack="${escapeHtml(p.name)}" data-fr="Choisir ce pack" data-en="Choose this pack">Choisir ce pack</button>
        </div>
      `;
    }).join('');

    grid.innerHTML = packs;
    grid.querySelectorAll('.reveal').forEach(el => window.revealObserver.observe(el));

    // Update pack select options
    if (packSelect) {
      packSelect.innerHTML = '<option value="" data-fr="Sélectionnez..." data-en="Select...">Sélectionnez...</option>' +
        result.packs.map(p => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)} — ${escapeHtml(p.price)}</option>`).join('') +
        '<option value="Autre" data-fr="Autre (précisez ci-dessous)" data-en="Other (specify below)">Autre (précisez ci-dessous)</option>';
    }
  } catch (error) {
    console.error('Erreur chargement packs:', error);
  }
}

// Load products (replaces static if server returns data)
async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  try {
    const response = await fetch(`/api/products?_t=${Date.now()}`);
    const result = await response.json();

    if (!result.success || !result.products || result.products.length === 0) {
      grid.innerHTML = `<div class="empty" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">Aucun produit pour le moment.</div>`;
      return;
    }

    const products = result.products.map(p => {
      const name = currentLang === 'en' && p.nameEn ? p.nameEn : p.name;
      const description = currentLang === 'en' && p.descriptionEn ? p.descriptionEn : p.description;
      const imageSrc = p.imagePath.startsWith('data:') ? p.imagePath : `${p.imagePath}?_t=${Date.now()}`;
      return `
        <div class="product-card reveal">
          <div class="product-img">
            <img src="${imageSrc}" alt="${escapeHtml(name)}" loading="lazy">
          </div>
          <div class="product-info">
            <div class="product-category">${escapeHtml(p.category || '')}</div>
            <h3>${escapeHtml(name)}</h3>
            <p>${escapeHtml(description || '')}</p>
            <div class="product-price">${escapeHtml(p.price)}</div>
            <button class="btn btn-primary add-to-cart" data-product="${escapeHtml(p.name)}" data-price="${escapeHtml(p.price)}" data-image="${escapeHtml(p.imagePath)}" data-fr="Ajouter au panier" data-en="Add to cart">Ajouter au panier</button>
          </div>
        </div>
      `;
    }).join('');

    grid.innerHTML = products;
    grid.querySelectorAll('.reveal').forEach(el => window.revealObserver.observe(el));

    // Add to cart event delegation
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-to-cart');
      if (!btn) return;
      addToCart({
        name: btn.dataset.product,
        price: btn.dataset.price,
        image: btn.dataset.image
      });
      const originalText = btn.textContent;
      btn.textContent = currentLang === 'fr' ? 'Ajouté !' : 'Added!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    });
  } catch (error) {
    console.error('Erreur chargement produits:', error);
  }
}

// Cart functionality
function getCart() {
  return JSON.parse(localStorage.getItem('boostify-cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('boostify-cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = cart.length;
}

function addToCart(item) {
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
  showCartNotification(currentLang === 'fr' ? 'Produit ajouté au panier' : 'Product added to cart');
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function showCartNotification(message) {
  const btn = document.getElementById('cartBtn');
  if (!btn) return;
  const original = btn.title;
  btn.title = message;
  setTimeout(() => {
    btn.title = original;
  }, 2000);
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartTotalValue = document.getElementById('cartTotalValue');
  if (!cartItems) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart" data-fr="Votre panier est vide." data-en="Your cart is empty.">${currentLang === 'fr' ? 'Votre panier est vide.' : 'Your cart is empty.'}</p>`;
    if (cartTotal) cartTotal.style.display = 'none';
    return;
  }

  let total = 0;
  cartItems.innerHTML = cart.map((item, index) => {
    const priceValue = parseInt(item.price.replace(/\D/g, '')) || 0;
    total += priceValue;
    const imageSrc = item.image && item.image.startsWith('data:') ? item.image : (item.image || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'/%3E');
    return `
      <div class="cart-item">
        <img src="${imageSrc}" alt="${escapeHtml(item.name)}">
        <div class="cart-item-info">
          <div class="cart-item-name">${escapeHtml(item.name)}</div>
          <div class="cart-item-price">${escapeHtml(item.price)}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${index})">×</button>
      </div>
    `;
  }).join('');

  if (cartTotal) cartTotal.style.display = 'flex';
  if (cartTotalValue) cartTotalValue.textContent = total.toLocaleString('fr-FR') + ' FCFA';
}

function openCart() {
  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    renderCart();
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
