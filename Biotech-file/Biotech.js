// Biotech.js - Tutto racchiuso in una sola IIFE, nessun codice fuori
(function () {
  'use strict';

  // Stato globale del modulo
  let particlesController = null;
  let currentLang = 'it';
  let lastFocusedElement = null;
  let keyboardNavActive = false;
  let cachedTranslations = null;

  // 1. LOGICA PARTICELLE (con debounce resize)
  function randomStemCellColor() {
    const colors = [
      "rgba(180, 220, 255, 0.26)",
      "rgba(220, 255, 180, 0.22)",
      "rgba(255, 220, 180, 0.19)",
      "rgba(200, 255, 220, 0.21)",
      "rgba(255, 200, 220, 0.21)",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  function initParticles(canvasId, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let animationId;
    const FRAME_DELAY = 100;
    let lastFrameTime = 0;
    let resizeTimeout = null;
    function resizeCanvas() {
      if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
      resizeTimeout = requestAnimationFrame(() => {
        const dpr = window.devicePixelRatio || 1;
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      });
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    const hour = new Date().getHours();
    const isDay = hour >= 7 && hour < 19;
    if (isDay) {
      const count = Math.min(options.count || 50, 60);
      const color = options.color || 'rgba(231, 231, 231, 0.47)';
      const radius = options.radius || 2;
      const speed = options.speed || 1;
      const particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
      }));
      function animate(timestamp) {
        if (!lastFrameTime || timestamp - lastFrameTime >= FRAME_DELAY) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
            if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
          });
          lastFrameTime = timestamp;
        }
        animationId = requestAnimationFrame(animate);
      }
      animate(0);
    } else {
      const count = Math.min(options.count || 30, 40);
      const minRadius = 1.5;
      const maxRadius = 4;
      const speed = options.speed || 0.6;
      const cells = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: minRadius + Math.random() * (maxRadius - minRadius),
        color: randomStemCellColor(),
      }));
      function animateStemCells(timestamp) {
        if (!lastFrameTime || timestamp - lastFrameTime >= FRAME_DELAY) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          cells.forEach(c => {
            c.x += c.vx;
            c.y += c.vy;
            if (c.x < 0 || c.x > window.innerWidth) c.vx *= -1;
            if (c.y < 0 || c.y > window.innerHeight) c.vy *= -1;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.fillStyle = c.color;
            ctx.shadowColor = c.color;
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.shadowBlur = 0;
          });
          lastFrameTime = timestamp;
        }
        animationId = requestAnimationFrame(animateStemCells);
      }
      animateStemCells();
    }
    function destroy() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      window.removeEventListener('resize', resizeCanvas);
    }
    return { destroy, resizeCanvas };
  }

  // 2. QRedshift (Comfort visivo automatico)
  function QRedshift() {
    const menuContainer = document.getElementById('tech-main-menu');
    const storageKey = 'qredshift_disabled';
    if (!menuContainer) return;
    const particles = document.getElementById('particles-canvas');
    const dna = document.querySelector('.dna-container-8');
    const isDisabledFromStorage = localStorage.getItem(storageKey) === 'true';
    const hour = new Date().getHours();
    const isNight = (hour < 7 || hour >= 19);
    const filterDay = 'sepia(0.2) hue-rotate(0deg) brightness(1)';
    const filterNight = 'sepia(0.6) hue-rotate(-30deg) brightness(1)';
    const currentFilter = isNight ? filterNight : filterDay;
    let isActive = !isDisabledFromStorage;
    function applyQRedshiftState(active) {
      if (active) {
        document.body.classList.add('qredshift-active');
        document.body.style.filter = currentFilter;
        document.body.style.transition = 'filter 0.5s';
        document.body.style.willChange = 'filter';
        if (particles) particles.style.display = '';
        if (dna) dna.style.display = '';
        if (typeof window.initParticles === "function" && particles && !particlesController) {
          setTimeout(() => {
            particlesController = window.initParticles("particles-canvas", { count: 50, speed: 1 });
            if (particlesController && typeof particlesController.resizeCanvas === 'function') {
              setTimeout(() => {
                particlesController.resizeCanvas();
              }, 0);
            }
          }, 0);
        }
      } else {
        document.body.classList.remove('qredshift-active');
        document.body.style.filter = '';
        document.body.style.transition = '';
        document.body.style.willChange = 'auto';
        if (particles) particles.style.display = 'none';
        if (dna) dna.style.display = 'none';
        if (particlesController && typeof particlesController.destroy === 'function') {
          particlesController.destroy();
          particlesController = null;
        }
      }
    }
    const menuItem = document.createElement('div');
    menuItem.className = 'tech-menu-item';
    menuItem.setAttribute('data-menu', 'qredshift');
    const button = document.createElement('button');
    button.className = 'tech-nav-btn';
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'false');
    button.setAttribute('aria-expanded', 'false');
    const activeIcon = isNight ? '🌙' : '☀️';
    const initialIcon = isActive ? activeIcon : '☀️';
    const initialLabel = isActive
      ? `Modalità comfort visivo attiva: ${isNight ? 'Notte' : 'Giorno'}`
      : 'Modalità comfort visivo disattivata';
    button.setAttribute('aria-pressed', isActive);
    button.setAttribute('aria-label', initialLabel);
    button.innerHTML = `<b>${initialIcon} Comfort</b>`;
    menuItem.appendChild(button);
    menuContainer.appendChild(menuItem);
    function toggleQRedshift() {
      isActive = !isActive;
      applyQRedshiftState(isActive);
      localStorage.setItem(storageKey, isActive ? 'false' : 'true');
      const currentIcon = isNight ? '🌙' : '☀️';
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      button.setAttribute('aria-label', isActive
        ? `Modalità comfort visivo attiva: ${isNight ? 'Notte' : 'Giorno'}`
        : 'Modalità comfort visivo disattivata');
      button.innerHTML = `<b>${isActive ? currentIcon : '☀️'} Comfort</b>`;
    }
    button.addEventListener('click', toggleQRedshift);
    applyQRedshiftState(isActive);
  }

  // 3. Fade effect (dissolvenza)
  function fadeEffect() {
    let text = document.getElementById("fadingText");
    if (!text) return;
    let visible = true;
    setInterval(() => {
      visible = !visible;
      text.classList.toggle("fade", !visible);
    }, 2000);
  }

  // 4. Lightbox e modale immagini
  function openModal() {
    lastFocusedElement = document.activeElement;
    const modal = document.getElementById("myModal");
    if (modal) {
      modal.style.display = "block";
      setTimeout(() => {
        const closeBtn = document.getElementById("closeBtn");
        if (closeBtn) closeBtn.focus();
      }, 100);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  function closeModal() {
    const modal = document.getElementById("myModal");
    if (modal) {
      modal.style.display = "none";
      resetAllZoom();
      if (lastFocusedElement) lastFocusedElement.focus();
    }
  }
  function plusSlides(n) {
    resetAllZoom();
    showSlides(slideIndex += n);
  }
  function currentSlide(n) {
    resetAllZoom();
    showSlides(slideIndex = n);
  }
  let slideIndex = 1;
  function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("demo");
    var captionText = document.getElementById("caption");
    if (slides.length === 0) return;
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    if (dots.length > 0 && dots[slideIndex - 1]) {
      dots[slideIndex - 1].className += " active";
      if (captionText) {
        captionText.innerHTML = dots[slideIndex - 1].alt || "";
      }
    }
  }
  function resetAllZoom() {
    document.querySelectorAll('.zoom-container').forEach(container => {
      container.classList.remove('zoomed');
      const img = container.querySelector('img');
      if (img) img.style.transformOrigin = `center center`;
    });
  }
  function setupBiotechModal() {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    const closeBtn = modal ? modal.querySelector(".close") : document.querySelector("#myModal .close");
    if (!modal || !modalImg || !closeBtn) return;
    window.openBiotechModal = function(imgId, event) {
      const targetImg = document.getElementById(imgId);
      if (!targetImg) return;
      lastFocusedElement = event.currentTarget;
      const rect = lastFocusedElement.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      modalImg.style.transformOrigin = `${originX}px ${originY}px`;
      modalImg.src = targetImg.src;
      modalImg.alt = targetImg.alt || "";
      captionText.textContent = targetImg.alt || "";
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.add("show");
        closeBtn.focus();
      }, 10);
    };
    function closeBiotechModal() {
      if (!modal.classList.contains("show")) return;
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
        modalImg.src = "";
        if (lastFocusedElement) {
          lastFocusedElement.focus();
          lastFocusedElement = null;
        }
      }, 400);
    }
    closeBtn.onclick = closeBiotechModal;
    modal.onclick = function (e) {
      if (e.target === modal) closeBiotechModal();
    };
    document.addEventListener("keydown", function (e) {
      if (!modal.classList.contains("show")) return;
      if (e.key === 'Escape') closeBiotechModal();
      if (e.key === 'Tab') {
        const focusableElements = modal.querySelectorAll('button, [tabindex=\"0\"], .close');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
      if (e.target === closeBtn && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        closeBiotechModal();
      }
    });
  }

  // 5. Performance helpers
  const throttle = (fn) => {
    let ticking = false;
    return (...args) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          fn.apply(this, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  };
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  };
  function initSmartPrefetch() {
    const menuLinks = document.querySelectorAll('#tech-main-menu a[href]');
    const prefetchedLinks = new Set();
    menuLinks.forEach(link => {
      const url = link.href;
      if (!url.startsWith(window.location.origin) || url.includes('#') || prefetchedLinks.has(url)) return;
      link.addEventListener('mouseenter', () => {
        link._prefetchTimer = setTimeout(() => {
          if (!prefetchedLinks.has(url)) {
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = url;
            document.head.appendChild(prefetchLink);
            prefetchedLinks.add(url);
          }
        }, 200);
      });
      link.addEventListener('mouseleave', () => {
        clearTimeout(link._prefetchTimer);
      });
    });
  }
  function initLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('img[data-src]').forEach(img => img.src = img.dataset.src);
      return;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            obs.unobserve(img);
          }
        });
      },
      { rootMargin: '0px 0px 300px 0px', threshold: 0.01 }
    );
    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
  }
  function loadScript(src, callback, priority = 'low') {
    if (document.querySelector(`script[src=\"${src}\"]`)) {
      if (callback) callback();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if ('fetchPriority' in HTMLScriptElement.prototype) script.fetchPriority = priority;
    script.onload = callback;
    document.head.appendChild(script);
  }

  // 6. Popup helpers
  function openPopup(url, title, width, height) {
    const left = Math.floor((screen.width - width) / 2);
    const top = Math.floor((screen.height - height) / 2);
    const options = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,toolbar=no,location=no`;
    const popup = window.open(url, title, options);
    if (!popup || popup.closed || typeof popup.closed == 'undefined') {
      alert("Il popup è stato bloccato. Per favore, abilita i popup per questo sito.");
      return;
    }
    popup.focus();
  }
  function openSupportPopup() {
    openPopup('https://gitechnolo.github.io/biotechproject/O.S_support.html', 'O.S. Support Chat GPT', 760, 440);
  }
  function openContactPopup() {
    openPopup('https://gitechnolo.github.io/biotechproject/Tablet_forum.html', 'Contattaci - Forum ChatGPT', 825, 672);
  }

  // 7. Theme toggle
  function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;
    const themes = [
      { name: 'Verde', rgb: '0, 230, 118', h: 143, s: '100%', l: '45%' },
      { name: 'Ciano', rgb: '0, 200, 255', h: 190, s: '100%', l: '50%' },
      { name: 'Viola', rgb: '138, 43, 226', h: 270, s: '75%', l: '53%' },
      { name: 'Arancione', rgb: '255, 140, 0', h: 39, s: '100%', l: '50%' },
      { name: 'Blu Profondo', rgb: '0, 120, 255', h: 210, s: '100%', l: '50%' }
    ];
    let currentThemeIndex = 0;
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      currentThemeIndex = themes.findIndex(t => t.name === 'Blu Profondo') || 0;
    }
    const savedTheme = localStorage.getItem('biotech-theme');
    if (savedTheme !== null) {
      const index = parseInt(savedTheme, 10);
      if (index >= 0 && index < themes.length) {
        currentThemeIndex = index;
      }
    }
    function updateAriaLabel(themeName) {
      themeBtn.setAttribute(
        'aria-label',
        `Cambia tema colore: attualmente ${themeName}, clicca per passare al successivo`
      );
    }
    function applyTheme(index) {
      const theme = themes[index];
      document.documentElement.style.setProperty('--color-accent-rgb', theme.rgb);
      document.documentElement.style.setProperty('--color-accent-h', theme.h);
      document.documentElement.style.setProperty('--color-accent-s', theme.s);
      document.documentElement.style.setProperty('--color-accent-l', theme.l);
      document.documentElement.style.setProperty('--color-glow', `hsl(${theme.h}, 100%, 70%)`);
      themeBtn.textContent = `🎨 Tema: (${theme.name})`;
      updateAriaLabel(theme.name);
    }
    applyTheme(currentThemeIndex);
    themeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      applyTheme(currentThemeIndex);
      localStorage.setItem('biotech-theme', currentThemeIndex);
    });
  }

  // 8. Traduzioni e gestione lingua
  const translatablePages = [
    'index', 'Progetti', 'Staff', 'Marketing', 'Tech_Maturity', 'Dermatologia', 'Cuore', 'Cellula',
    'Apparato_digerente', 'Apparato_respiratorio', 'Apparato_tegumentario', 'Sistema_linfatico', 'Specials', 'Capelli'
  ];
  function getPageKey(pageName) {
    const map = {
      'index': 'home',
      'Tech_Maturity': 'tech_maturity',
      'Apparato_digerente': 'apparato_digerente',
      'Apparato_respiratorio': 'apparato_respiratorio',
      'Apparato_tegumentario': 'apparato_tegumentario',
      'Sistema_linfatico': 'sistema_linfatico'
    };
    return map[pageName] || pageName.toLowerCase();
  }
  function getPageName() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop().replace('.html', '');
    return fileName.replace('-semplice', '');
  }
  async function loadTranslation(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`File non trovato: ${path}`);
      return await res.json();
    } catch (err) {
      console.warn(err);
      return null;
    }
  }
  function applyTranslations(translations, lang) {
    document.querySelectorAll('[data-lang-key]').forEach(el => {
      const key = el.getAttribute('data-lang-key');
      const value = translations[lang]?.[key];
      if (value !== undefined && value !== null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', value);
        } else if (el.tagName === 'IMG') {
          el.setAttribute('alt', value);
          const modal = document.getElementById("myModal");
          const modalImg = document.getElementById("img01");
          const captionText = document.getElementById("caption");
          if (modal && modal.classList.contains("show") && modalImg && modalImg.src === el.src) {
            captionText.textContent = value;
          }
        } else if (el.hasAttribute('aria-label')) {
          el.setAttribute('aria-label', value);
          const bold = el.querySelector('b');
          if (bold) {
            bold.textContent = value;
          } else {
            el.innerHTML = value;
          }
        } else {
          const bold = el.querySelector('b');
          if (bold) {
            bold.textContent = value;
          } else {
            el.innerHTML = value;
          }
        }
      }
    });
    updateLastModified(lang);
  }
  async function initTranslations() {
    const pageName = getPageName();
    const savedLang = getSavedLanguage();
    let promises = [loadTranslation('lang/common.json')];
    let isTranslatable = translatablePages.includes(pageName);
    if (isTranslatable) {
      const pageKey = getPageKey(pageName);
      promises.push(loadTranslation(`lang/${pageKey}.json`));
    }
    const [common, pageData] = await Promise.all(promises);
    const translations = {
      it: { ...(common?.it || {}), ...(pageData?.it || {}) },
      en: { ...(common?.en || {}), ...(pageData?.en || {}) }
    };
    cachedTranslations = translations;
    applyTranslations(translations, savedLang);
    updateLanguageButton(savedLang);
    document.documentElement.lang = savedLang;
    currentLang = savedLang;
  }
  function getSavedLanguage() {
    return localStorage.getItem('preferred-language') || (navigator.language.startsWith('en') ? 'en' : 'it');
  }
  function updateLanguageButton(lang) {
    const flag = document.getElementById('lang-flag');
    const text = document.getElementById('lang-text');
    const button = document.getElementById('lang-toggle');
    const label = document.getElementById('lang-label');
    if (!flag || !button) return;
    if (lang === 'it') {
      flag.textContent = '🇬🇧';
      if (text) text.textContent = 'English';
      if (label) label.textContent = 'Switch language';
      button.setAttribute('aria-label', 'Switch to English');
    } else {
      flag.textContent = '🇮🇹';
      if (text) text.textContent = 'Italiano';
      if (label) label.textContent = 'Cambia lingua';
      button.setAttribute('aria-label', 'Cambia lingua in italiano');
    }
  }
  function setLanguage(lang) {
    const pageName = getPageName();
    const isTranslatable = translatablePages.includes(pageName);
    let promises = [loadTranslation('lang/common.json')];
    if (isTranslatable) {
      const pageKey = getPageKey(pageName);
      promises.push(loadTranslation(`lang/${pageKey}.json`));
    }
    Promise.all(promises).then(([common, pageData]) => {
      const translations = {
        it: { ...(common?.it || {}), ...(pageData?.it || {}) },
        en: { ...(common?.en || {}), ...(pageData?.en || {}) }
      };
      cachedTranslations = translations;
      setTimeout(() => {
        applyTranslations(translations, lang);
        updateLanguageButton(lang);
        document.documentElement.lang = lang;
        currentLang = lang;
        localStorage.setItem('preferred-language', lang);
        const msgEl = document.getElementById('filter-message');
        if (msgEl && msgEl.style.display === 'block') {
          msgEl.textContent = translations[lang]['filter-empty'] || "";
        }
      }, 100);
    });
  }
  function toggleLanguage() {
    const newLang = currentLang === 'it' ? 'en' : 'it';
    setLanguage(newLang);
  }

  // 9. Ultima modifica pagina
  function updateLastModified(lang) {
    const el = document.getElementById('lastModified');
    if (!el) return;
    const lastModifiedDate = new Date(document.lastModified);
    if (isNaN(lastModifiedDate)) return;
    const isEn = (lang === 'en');
    const label = isEn ? 'Last modified' : 'Ultima modifica';
    const locale = isEn ? 'en-US' : 'it-IT';
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    el.textContent = `${label}: ${lastModifiedDate.toLocaleString(locale, options)}`;
  }

  // 10. Pronuncia
  function speakTerm(term, language = 'italiano') {
    if (!term) return;
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    const customPronunciations = {
      'crispr': 'Clustered Regularly Interspaced Short Palindromic Repeats',
      'mitocondri': 'Mi-to-con-dri',
      'lisosoma': 'Li-so-so-ma',
      'miochine': 'Mi-o-ki-ne',
      'sinaptogenesi': 'Si-na-to-jen-e-si',
      'epigenetici': 'E-pi-je-ne-ti-ci',
      'atp': 'Adenosina trifosfato',
      'dna': 'Acido desossiribonucleico',
      'rna': 'Acido ribonucleico',
      'tegumento': 'Te-gu-men-to',
      'pecquet': 'Pes-ché'
    };
    const langMap = { 'italiano': 'it-IT', 'inglese': 'en-US' };
    const utteranceText = customPronunciations[term.toLowerCase()] || term;
    const utterance = new SpeechSynthesisUtterance(utteranceText);
    utterance.lang = langMap[language] || 'it-IT';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    const announcement = document.getElementById('sr-announcement');
    if (announcement) {
      announcement.textContent = `Lettura avviata: ${term}.`;
      setTimeout(() => {
        if (announcement.textContent.includes(term)) announcement.textContent = '';
      }, 1000);
    }
    speechSynthesis.speak(utterance);
  }

  // 11. Event delegation centralizzata
  function setupEventDelegation() {
    // --- Pronounce buttons ---
    document.body.addEventListener('click', function (event) {
      const btn = event.target.closest('.pronounce-btn');
      if (btn) {
        event.stopPropagation();
        const term = btn.getAttribute('data-term');
        const langAttr = btn.getAttribute('lang');
        const language = (langAttr === 'en') ? 'inglese' : 'italiano';
        speakTerm(term, language);
      }
    });

    // --- Modal triggers ---
    document.body.addEventListener('click', function (event) {
      const link = event.target.closest('.biotech-modal-trigger');
      if (link) {
        event.preventDefault();
        const imgId = link.getAttribute('data-target-img');
        if (typeof window.openBiotechModal === 'function') {
          window.openBiotechModal(imgId, event);
        }
      }
    });

    // --- Modal & Video keyboard accessibility ---
    document.body.addEventListener('keydown', function (event) {
      // 1. Gestione Modal
      const link = event.target.closest('.biotech-modal-trigger');
      if (link && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        const imgId = link.getAttribute('data-target-img');
        if (typeof window.openBiotechModal === 'function') {
          window.openBiotechModal(imgId, event);
        }
        return; // Esce per evitare conflitti
      }

      // 2. Gestione Video (Accessibilità tastiera sul poster)
      const videoPoster = event.target.closest('#videoPoster');
      if (videoPoster && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        if (typeof window.loadAndPlayVideo === 'function') {
          window.loadAndPlayVideo();
        }
      }
    });

    // --- Video Click handling (se rimosso onclick dall'HTML) ---
    document.body.addEventListener('click', function (event) {
      const videoPoster = event.target.closest('#videoPoster');
      if (videoPoster) {
        if (typeof window.loadAndPlayVideo === 'function') {
          window.loadAndPlayVideo();
        }
      }
    });

    // --- Menu event delegation ---
    const navContainer = document.getElementById('tech-main-menu');
    if (navContainer) {
      let openDropdown = null;
      navContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button, a');
        if (!target) return;
        if (target.classList.contains('tech-nav-btn')) {
          e.stopPropagation();
          handleDropdownToggle(target);
        } else if (target.id) {
          handleMenuCommands(target.id);
        }
      });

      function handleMenuCommands(id) {
        switch (id) {
          case 'btn-support-os': openSupportPopup(); break;
          case 'btn-contact-forum': openContactPopup(); break;
          case 'lang-toggle': toggleLanguage(); break;
        }
      }

      function handleDropdownToggle(btn) {
        const dropdown = btn.nextElementSibling;
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        if (openDropdown && openDropdown !== dropdown) closeDropdown(openDropdown);
        if (isExpanded) {
          closeDropdown(dropdown);
        } else {
          dropdown.classList.add('show');
          btn.setAttribute('aria-expanded', 'true');
          openDropdown = dropdown;
        }
      }

      function closeDropdown(dropdown) {
        if (!dropdown) return;
        dropdown.classList.remove('show');
        const btn = dropdown.previousElementSibling;
        if (btn) btn.setAttribute('aria-expanded', 'false');
        openDropdown = null;
      }

      navContainer.addEventListener('keydown', (e) => {
        const target = e.target;
        if (e.key === 'Escape' && openDropdown) {
          const triggerBtn = openDropdown.previousElementSibling;
          closeDropdown(openDropdown);
          triggerBtn.focus();
          return;
        }
        if (openDropdown && openDropdown.contains(target)) {
          const items = Array.from(openDropdown.querySelectorAll('[role=\"menuitem\"]:not([disabled])'));
          const currentIndex = items.indexOf(target);
          switch (e.key) {
            case 'ArrowDown': e.preventDefault(); items[(currentIndex + 1) % items.length].focus(); break;
            case 'ArrowUp': e.preventDefault(); items[(currentIndex - 1 + items.length) % items.length].focus(); break;
            case 'Home': e.preventDefault(); items[0].focus(); break;
            case 'End': e.preventDefault(); items[items.length - 1].focus(); break;
          }
        } else if (target.classList.contains('tech-nav-btn') && (e.key === 'Enter' || e.key === ' ')) {
          setTimeout(() => {
            const firstItem = target.nextElementSibling?.querySelector('[role=\"menuitem\"]');
            if (firstItem) firstItem.focus();
          }, 120);
        }
      });

      document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target) && openDropdown) closeDropdown(openDropdown);
      });
    }

    // --- Keyboard navigation toggle ---
    const toggleBtn = document.getElementById("keyboard-nav-toggle");
    const body = document.body;
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        keyboardNavActive = !keyboardNavActive;
        if (keyboardNavActive) {
          body.classList.add("keyboard-navigation-on");
          toggleBtn.setAttribute("aria-pressed", "true");
          toggleBtn.setAttribute("data-active", "true");
          toggleBtn.textContent = "✅ Navigazione Attiva";
        } else {
          body.classList.remove("keyboard-navigation-on");
          toggleBtn.setAttribute("aria-pressed", "false");
          toggleBtn.setAttribute("data-active", "false");
          toggleBtn.textContent = "🔧 Navigazione Tastiera";
        }
      });
      setTimeout(() => {
        toggleBtn.classList.remove("hint");
      }, 2500);
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && !keyboardNavActive) {
        keyboardNavActive = true;
        body.classList.add("keyboard-navigation-on");
        if (toggleBtn) {
          toggleBtn.setAttribute("aria-pressed", "true");
          toggleBtn.setAttribute("data-active", "true");
          toggleBtn.textContent = "✅ Navigazione Attiva";
        }
      }
    });
  }

  // 12. Orchestratore unico
  function startupOrchestrator() {
    // PHASE 1: CRITICAL (Tema, Lingua)
    initThemeToggle();
    initTranslations().catch(err => {
      console.error('Errore nel caricamento delle traduzioni:', err);
    });
    window.toggleLanguage = toggleLanguage;
    // PHASE 2: INTERACTIVE (Menu, Modali, Event Delegation)
    setupEventDelegation();
    setupBiotechModal();
    // PHASE 3: IDLE (Particelle, Prefetch, LazyLoad, Fade)
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        QRedshift();
        fadeEffect();
        initLazyLoading();
        initSmartPrefetch();
      });
    } else {
      window.addEventListener('load', () => {
        QRedshift();
        fadeEffect();
        initLazyLoading();
        initSmartPrefetch();
      });
    }
    window.initParticles = initParticles;
  }

  // Unico listener DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      startupOrchestrator();
    });
  } else {
    startupOrchestrator();
  }

})();