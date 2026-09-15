// TNK Translation Dictionary - Phase 1 (Core Pages)
const TNK_TRANSLATIONS = {
  // Navbar
  'nav.home': { en: 'Home', es: 'Inicio' },
  'nav.blog': { en: 'Blog', es: 'Blog' },
  'nav.projects': { en: 'Projects', es: 'Proyectos' },
  'nav.contact': { en: 'Get in touch', es: 'Contáctanos' },
  'nav.lang-toggle': { en: 'ES', es: 'EN' },

  // Homepage
  'home.title': { en: 'TNK – Design & Analytics', es: 'TNK – Diseño & Analytics' },
  'home.tagline': {
    en: 'Implementation, governance, and data quality in digital Web and App environments.',
    es: 'Implementación, gobernanza y calidad de datos en entornos Web y App digitales.'
  },
  'home.hero.heading': {
    en: 'End-to-end measurement. From strategy to validation.',
    es: 'Medición de extremo a extremo. De la estrategia a la validación.'
  },
  'home.hero.subheading': {
    en: 'Design data architecture, implement tracking, and validate data quality.',
    es: 'Diseña arquitectura de datos, implementa tracking, y valida calidad de datos.'
  },
  'home.hero.cta': { en: 'Explore my work', es: 'Explora mi trabajo' },
  'home.services': { en: 'Services', es: 'Servicios' },
  'home.blog': { en: 'Latest Articles', es: 'Últimos Artículos' },

  // Blog
  'blog.title': { en: 'Blog', es: 'Blog' },
  'blog.description': {
    en: 'Articles on analytics, design, and data-driven strategies',
    es: 'Artículos sobre analytics, diseño y estrategias data-driven'
  },
  'blog.filter-all': { en: 'All', es: 'Todos' },
  'blog.filter-analytics': { en: 'Analytics', es: 'Analytics' },
  'blog.filter-design': { en: 'Design', es: 'Diseño' },
  'blog.filter-dev': { en: 'Development', es: 'Desarrollo' },
  'blog.coming-soon': { en: 'Coming Soon', es: 'Próximamente' },
  'blog.min-read': { en: 'min read', es: 'min de lectura' },
  'blog.read-more': { en: 'Read →', es: 'Leer →' },

  // Contact
  'contact.title': { en: 'Get in touch', es: 'Contáctanos' },
  'contact.description': {
    en: 'Have a question or want to work together? Reach out.',
    es: '¿Tienes una pregunta o quieres trabajar juntos? Contáctame.'
  },
  'contact.form.name': { en: 'Name', es: 'Nombre' },
  'contact.form.email': { en: 'Email', es: 'Correo electrónico' },
  'contact.form.message': { en: 'Message', es: 'Mensaje' },
  'contact.form.send': { en: 'Send', es: 'Enviar' },
  'contact.email-link': { en: 'hola@tnkproject.com', es: 'hola@tnkproject.com' },

  // Footer
  'footer.copyright': { en: '© 2026 TNK. All rights reserved.', es: '© 2026 TNK. Todos los derechos reservados.' },
  'footer.made-by': { en: 'Made with data and design', es: 'Hecho con datos y diseño' },
};

// Get current language from localStorage or default to 'en'
function getCurrentLanguage() {
  return localStorage.getItem('tnk_lang') || 'en';
}

// Translation function
function t(key, defaultValue = null) {
  const lang = getCurrentLanguage();
  const value = TNK_TRANSLATIONS[key]?.[lang] || TNK_TRANSLATIONS[key]?.en;
  return value || defaultValue || key;
}

// Set language and optionally reload
function setLanguage(lang) {
  localStorage.setItem('tnk_lang', lang);
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = translation;
    } else {
      el.textContent = translation;
    }
  });
  // Update language indicator in navbar
  const langIndicator = document.getElementById('lang-indicator');
  if (langIndicator) {
    langIndicator.textContent = lang === 'en' ? 'ES' : 'EN';
  }
  // Push language change event to GA4
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'language_switch',
      language: lang,
      previous_language: lang === 'en' ? 'es' : 'en'
    });
  }
}

// Switch language (toggle between EN and ES)
function tnkSwitchLanguage() {
  const currentLang = getCurrentLanguage();
  const newLang = currentLang === 'en' ? 'es' : 'en';
  setLanguage(newLang);
}

// Initialize translations on page load
document.addEventListener('DOMContentLoaded', function() {
  const lang = getCurrentLanguage();
  document.documentElement.lang = lang;

  // Apply initial translations to all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = translation;
    } else {
      el.textContent = translation;
    }
  });

  // Update language indicator
  const langIndicator = document.getElementById('lang-indicator');
  if (langIndicator) {
    langIndicator.textContent = lang === 'en' ? 'ES' : 'EN';
  }

  // Track language preference in GA4 (as user property, not event)
  if (window.dataLayer) {
    window.dataLayer.push({
      'user_language': lang
    });
  }
});

// Expose functions globally
window.getCurrentLanguage = getCurrentLanguage;
window.t = t;
window.setLanguage = setLanguage;
window.tnkSwitchLanguage = tnkSwitchLanguage;
