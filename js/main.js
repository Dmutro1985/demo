// Мобільне меню
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuBtn.classList.toggle('active');
  });
}

// Закриваємо меню при кліку на посилання
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.classList.remove('active');
  });
});

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const ICON_MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5Z"/></svg>';
const ICON_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5 3.5 3.5M18.5 18.5 20 20M5 19l-1.5 1.5M18.5 5.5 20 4"/></svg>';

// Перевіряємо збережену тему
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
  themeToggle.innerHTML = savedTheme === 'dark' ? ICON_SUN : ICON_MOON;
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';

  if (next === 'dark') {
    html.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = ICON_SUN;
  } else {
    html.removeAttribute('data-theme');
    themeToggle.innerHTML = ICON_MOON;
  }

  localStorage.setItem('theme', next === 'dark' ? 'dark' : 'light');
});

// Плавна поява блоків при скролі
const revealEls = document.querySelectorAll(
  '.section, .quote-section, .hero-main'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Поява карток по черзі (stagger)
document.querySelectorAll('.cards-grid, .mini-cards').forEach((grid) => {
  const items = grid.querySelectorAll('.card, .mini-card');
  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * 90}ms`;
  });
});

// Тінь у шапки при скролі
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Прогрес скролу сторінки -> підкреслення активного пункту меню
// поступово заповнюється в міру прочитання сторінки
const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollable > 0
    ? Math.min(100, Math.max(8, (window.scrollY / scrollable) * 100))
    : 100;
  document.documentElement.style.setProperty('--scroll-pct', pct + '%');
};

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();
// Слайдер дипломів і сертифікатів
document.querySelectorAll('.certs-slider-wrap').forEach((wrap) => {
  const slider = wrap.querySelector('.certs-slider');
  const slides = wrap.querySelectorAll('.cert-slide');
  const prevBtn = wrap.querySelector('.certs-slider-arrow.prev');
  const nextBtn = wrap.querySelector('.certs-slider-arrow.next');
  const dotsWrap = wrap.querySelector('.certs-dots');

  if (!slider || slides.length === 0) return;

  // Створюємо крапки-індикатори
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'certs-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll('.certs-dot');

  const updateActiveDot = () => {
    const sliderRect = slider.getBoundingClientRect();
    const center = sliderRect.left + sliderRect.width / 2;
    let closestIndex = 0;
    let closestDist = Infinity;
    slides.forEach((slide, i) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const dist = Math.abs(center - slideCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === closestIndex));
  };

  slider.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateActiveDot);
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -slider.clientWidth, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      slider.scrollBy({ left: slider.clientWidth, behavior: 'smooth' });
    });
  }

  updateActiveDot();
});

// Форма зворотного зв'язку (відправка через FormSubmit без перезавантаження сторінки)
const feedbackForm = document.getElementById('feedback-form');

if (feedbackForm) {
  const statusEl = document.getElementById('form-status');
  const submitBtn = feedbackForm.querySelector('button[type="submit"]');
  const lang = document.documentElement.lang === 'uk' ? 'uk' : 'ru';

  const messages = {
    ru: {
      sending: 'Отправляем...',
      success: 'Спасибо! Заявка отправлена, я свяжусь с вами в ближайшее время.',
      error: 'Что-то пошло не так. Попробуйте написать напрямую в Telegram или на email.',
    },
    uk: {
      sending: 'Надсилаємо...',
      success: 'Дякую! Заявку надіслано, я зв\'яжуся з вами найближчим часом.',
      error: 'Щось пішло не так. Спробуйте написати напряму в Telegram або на email.',
    },
  };

  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    statusEl.textContent = messages[lang].sending;
    statusEl.className = 'form-status';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(feedbackForm);
      const response = await fetch(feedbackForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        statusEl.textContent = messages[lang].success;
        statusEl.className = 'form-status success';
        feedbackForm.reset();
      } else {
        throw new Error('Request failed');
      }
    } catch (err) {
      statusEl.textContent = messages[lang].error;
      statusEl.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Кнопка "Наверх"
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Секційна навігація з підсвіткою активного блоку (тільки на головній)
const sectionNav = document.getElementById('section-nav');
if (sectionNav) {
  const headerEl = document.querySelector('.header');

  const setNavOffset = () => {
    if (headerEl) {
      sectionNav.style.top = headerEl.offsetHeight + 'px';
    }
  };
  setNavOffset();
  window.addEventListener('resize', setNavOffset);

  const navLinksBySection = {};
  sectionNav.querySelectorAll('a[href^="#"]').forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    navLinksBySection[id] = link;
  });

  const targetSections = Object.keys(navLinksBySection)
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const sectionSpyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          Object.values(navLinksBySection).forEach((l) => l.classList.remove('active'));
          if (navLinksBySection[id]) {
            navLinksBySection[id].classList.add('active');
          }
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );

  targetSections.forEach((section) => sectionSpyObserver.observe(section));
}

// Плаваюча кнопка "Записатися" (мобільні) - з'являється після того, як hero-блок зникає з екрана
const floatingCta = document.getElementById('floating-cta');
if (floatingCta) {
  const heroSection = document.querySelector('.hero-main');
  const showThreshold = heroSection
    ? heroSection.offsetTop + heroSection.offsetHeight
    : 400;

  const toggleFloatingCta = () => {
    if (window.scrollY > showThreshold) {
      floatingCta.classList.add('visible');
    } else {
      floatingCta.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleFloatingCta, { passive: true });
  toggleFloatingCta();
}

// Золоті іскри в hero-блоці (легка декоративна анімація)
const heroMainEl = document.querySelector('.hero-main');
if (heroMainEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const sparkleCount = window.innerWidth < 700 ? 10 : 18;
  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'hero-sparkle';
    const size = 2 + Math.random() * 3.5;
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = 10 + Math.random() * 80 + '%';
    sparkle.style.animationDuration = 3 + Math.random() * 4 + 's';
    sparkle.style.animationDelay = Math.random() * 5 + 's';
    heroMainEl.appendChild(sparkle);
  }
}

// Паралакс-ефект для золотих хвиль у hero-блоці
const heroWavesEl = document.querySelector('.hero-waves');
if (heroWavesEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;

  const updateParallax = () => {
    const heroMain = heroWavesEl.closest('.hero-main');
    if (!heroMain) return;

    const rect = heroMain.getBoundingClientRect();
    // Паралакс рахуємо тільки поки hero-блок хоч частково видно
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const offset = rect.top * -0.15;
      heroWavesEl.style.transform = `translateY(${offset}px)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
}
