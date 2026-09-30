/**
 * Kampeerverblijfpark Veronique — Editorial Script
 * 100% Cookievrij, Pure Vanilla JS, ZERO emojis
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initI18n();
});

/* ==========================================================================
   1. Mobiele Navigatie Toggle
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.textContent = isOpen ? 'Sluit menu' : 'Menu';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = 'Menu';
    });
  });
}

/* ==========================================================================
   2. Subtiele Meertaligheid (NL / FR / EN) — ZERO Emojis
   ========================================================================== */
const editorialI18n = {
  nl: {
    navPark: "Over het park",
    navGallery: "Fotogalerij",
    navRates: "Tarieven",
    navSurroundings: "Omgeving & Fietsen",
    navContact: "Contact",
    navBooking: "Aanvraag doen",
    heroKicker: "01 / KAMPENHOUT · SAS VAN KAMPENHOUT",
    heroTitle: "Eenvoud, rust en ruimte aan de Leuvense Vaart.",
    heroLead: "Aan het kabbelende water van het kanaal Leuven-Dijle vindt u Kampeerverblijfpark Veronique. Een gemoedelijke en overzichtelijke camping voor residentiële gasten en reizigers met trekcaravan, camper of tent. Zonder drukte of entertainmentprogramma's, maar mét vogelgeluiden, het jaagpad voor de deur en een warm welkom.",
    btnBook: "Plek reserveren / Aanvraag doen",
    btnRates: "Bekijk de tarieven",
    btnDirectContact: "Direct contact opnemen",
    infostripText: "Aankomst vanaf 13:00 • Vertrek vóór 11:30 • Honden welkom zonder meerprijs • Nachtrust vanaf 22:00",
    galleryTitle: "Het park en de omgeving in beeld",
    galleryLead: "Originele beelden van onze ruime standplaatsen, de verzorgde lanen en de rustgevende ligging aan de Vaartstraat.",
    ratesTitle: "Tarieven per overnachting (toeristische plaatsen)",
    ratesSubtitle: "Geldig voor caravans, zwerfauto's (campers) en tenten",
    contactTitle: "Reserveren of een vraag stellen?",
    contactDesc: "Wilt u een plaats reserveren of heeft u een vraag over de beschikbaarheid? Neem gerust rechtstreeks contact met ons op via e-mail of telefoon.",
    btnSendMail: "Stuur een reserveringsaanvraag via e-mail"
  },
  fr: {
    navPark: "Le camping",
    navGallery: "Galerie photos",
    navRates: "Tarifs",
    navSurroundings: "Environs & Vélo",
    navContact: "Contact",
    navBooking: "Faire une demande",
    heroKicker: "01 / KAMPENHOUT · SAS DE KAMPENHOUT",
    heroTitle: "Simplicité, calme et espace le long du canal.",
    heroLead: "Au bord de l'eau paisible du canal Louvain-Dyle, découvrez le Kampeerverblijfpark Veronique. Un camping chaleureux et familial pour caravanes, camping-cars et tentes. Sans animations bruyantes, mais avec le chant des oiseaux, le chemin de halage devant la porte et un accueil bienveillant.",
    btnBook: "Réserver un emplacement",
    btnRates: "Consulter les tarifs",
    btnDirectContact: "Nous contacter",
    infostripText: "Arrivée dès 13h00 • Départ avant 11h30 • Chiens bienvenus sans supplément • Calme nocturne dès 22h00",
    galleryTitle: "Le domaine et les environs en images",
    galleryLead: "Photos authentiques de nos emplacements spacieux, des allées arborées et du cadre paisible de la Vaartstraat.",
    ratesTitle: "Tarifs par nuitée (emplacements touristiques)",
    ratesSubtitle: "Valable pour caravanes, camping-cars et tentes",
    contactTitle: "Réserver ou poser une question ?",
    contactDesc: "Vous souhaitez réserver un emplacement ou vérifier la disponibilité ? Contactez-nous simplement par e-mail ou téléphone.",
    btnSendMail: "Envoyez-nous un e-mail"
  },
  en: {
    navPark: "About the park",
    navGallery: "Photo gallery",
    navRates: "Rates",
    navSurroundings: "Surroundings & Cycling",
    navContact: "Contact",
    navBooking: "Inquire now",
    heroKicker: "01 / KAMPENHOUT · SAS VAN KAMPENHOUT",
    heroTitle: "Simplicity, calm, and open space along the canal.",
    heroLead: "Alongside the gentle waters of the Leuven-Dijle canal, you'll find Kampeerverblijfpark Veronique. A peaceful and authentic campsite for caravans, motorhomes, and tents. No loud entertainment, just birdsong, the towpath at your doorstep, and a warm Flemish welcome.",
    btnBook: "Request a pitch / Inquire",
    btnRates: "View rates",
    btnDirectContact: "Get in touch",
    infostripText: "Arrival from 1:00 PM • Departure before 11:30 AM • Dogs welcome at no charge • Quiet hours from 10:00 PM",
    galleryTitle: "A glimpse of our park & surroundings",
    galleryLead: "Authentic photographs of our spacious pitches, verdant lanes, and peaceful grounds along the Vaartstraat.",
    ratesTitle: "Nightly rates (tourist pitches)",
    ratesSubtitle: "Applicable for caravans, campervans, and tents",
    contactTitle: "Inquiries & Reservations",
    contactDesc: "Would you like to reserve a pitch or ask about availability? Feel free to reach out directly via email or phone.",
    btnSendMail: "Send us an email"
  }
};

function initI18n() {
  const langButtons = document.querySelectorAll('.lang-btn');
  let currentLang = 'nl';

  // Support URL hash #fr, #en, #nl
  const hashLang = window.location.hash.replace('#', '').toLowerCase();
  if (['nl', 'fr', 'en'].includes(hashLang)) {
    currentLang = hashLang;
  } else {
    try {
      const saved = localStorage.getItem('kp_veronique_lang');
      if (saved && editorialI18n[saved]) currentLang = saved;
    } catch (e) {}
  }

  function applyLanguage(lang, updateHash = false) {
    if (!editorialI18n[lang]) return;
    currentLang = lang;

    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (editorialI18n[lang][key]) {
        el.textContent = editorialI18n[lang][key];
      }
    });

    document.documentElement.lang = lang;

    if (updateHash && window.location.hash !== '#' + lang) {
      if (history.replaceState) {
        history.replaceState(null, '', '#' + lang);
      }
    }

    try {
      localStorage.setItem('kp_veronique_lang', lang);
    } catch (e) {}
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      applyLanguage(btn.dataset.lang, true);
    });
  });

  applyLanguage(currentLang);
}
