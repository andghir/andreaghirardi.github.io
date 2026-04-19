// ─── i18n Engine ─────────────────────────────────────────────────────────────
function applyTranslations(lang) {
    const t = TRANSLATIONS[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key] !== undefined) el.innerHTML = t[key];
    });

    document.documentElement.lang = lang;
    localStorage.setItem('ag-lang', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

function initLang() {
    const saved = localStorage.getItem('ag-lang');
    const lang  = (saved === 'en' || saved === 'it') ? saved : 'it';
    applyTranslations(lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => applyTranslations(btn.dataset.lang));
    });
}

if (typeof TRANSLATIONS !== 'undefined') initLang();

// ─── Custom Cursor ────────────────────────────────────────────────────────────
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = window.innerWidth  / 2;
let mouseY = window.innerHeight / 2;
let ringX  = mouseX;
let ringY  = mouseY;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
});

(function animateRing() {
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .project-item, .skill').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering'));
});

// ─── Nav Scroll ───────────────────────────────────────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

revealEls.forEach(el => {
    const siblings = [...el.parentElement.querySelectorAll('.reveal')];
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = (idx * 0.05) + 's';
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0, rootMargin: '0px 0px 400px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ─── Theme ────────────────────────────────────────────────────────────────────
function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('ag-theme', theme);
}

function initTheme() {
    const saved = localStorage.getItem('ag-theme') || 'light';
    applyTheme(saved);
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            applyTheme(current === 'light' ? 'dark' : 'light');
        });
    }
}

initTheme();

// ─── Mobile Menu ──────────────────────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
    });

    mobileMenu.querySelectorAll('.mobile-nav-links a').forEach(a => {
        a.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('open');
            document.body.classList.remove('menu-open');
        });
    });

    // Active link detection
    const path = window.location.pathname;
    mobileMenu.querySelectorAll('.mobile-nav-links a').forEach(a => {
        const href = a.getAttribute('href').replace('../', '');
        if (path.endsWith(href)) a.classList.add('active');
    });
}
