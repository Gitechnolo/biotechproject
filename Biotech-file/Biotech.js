/**
 * Biotech.js - Script principale per BiotechProject
 * Versione finale: menu con Enter, DNA animato correttamente, accessibilità completa
 */

document.addEventListener('DOMContentLoaded', () => {
    // ======================
    // 1. QRedshift + DNA: Comfort Visivo
    // ======================
    const applyQRedshift = () => {
        const hour = new Date().getHours();
        const isNight = hour < 7 || hour >= 19;
        const filter = isNight
            ? 'sepia(0.6) hue-rotate(-30deg) brightness(1)'
            : 'sepia(0.2) hue-rotate(0deg) brightness(1)';

        document.body.style.transition = 'filter 0.5s';
        document.body.style.filter = filter;

        const menuContainer = document.getElementById('tech-main-menu');
        if (!menuContainer) return;

        const button = document.createElement('button');
        button.className = 'tech-nav-btn';
        button.type = 'button';
        button.setAttribute('aria-pressed', 'true');
        button.setAttribute('aria-label', isNight ? 'Modalità comfort attiva: Notte' : 'Modalità comfort attiva: Giorno');
        button.innerHTML = `<b>${isNight ? '🌙' : '☀️'} Comfort</b>`;

        const menuItem = document.createElement('div');
        menuItem.className = 'tech-menu-item';
        menuItem.appendChild(button);
        menuContainer.appendChild(menuItem);

        button.addEventListener('click', () => {
            if (button.getAttribute('aria-pressed') === 'true') {
                document.body.style.filter = '';
                document.body.classList.remove('qredshift-active');
                button.setAttribute('aria-pressed', 'false');
                button.setAttribute('aria-label', 'Modalità comfort disattivata');
                button.innerHTML = '<b>🟢 Disattivato</b>';

                const particles = document.getElementById('particles-canvas');
                const dna = document.querySelector('.dna-container-8');
                if (particles) particles.style.display = 'none';
                if (dna) dna.style.display = 'none';
            } else {
                document.body.style.filter = filter;
                document.body.classList.add('qredshift-active');
                button.setAttribute('aria-pressed', 'true');
                button.setAttribute('aria-label', isNight ? 'Modalità comfort attiva: Notte' : 'Modalità comfort attiva: Giorno');
                button.innerHTML = `<b>${isNight ? '🌙' : '☀️'} Comfort</b>`;

                const particles = document.getElementById('particles-canvas');
                const dna = document.querySelector('.dna-container-8');
                if (particles) particles.style.display = 'block';
                if (dna) {
                    dna.style.display = 'block';
                    void dna.offsetWidth; // Forza reflow
                    dna.classList.remove('dna-container-8');
                    setTimeout(() => dna.classList.add('dna-container-8'), 10);
                }
            }
        });
    };
    applyQRedshift();

    // ======================
    // 2. Dropdown Menu - Con Enter
    // ======================
    const menu = document.getElementById('tech-main-menu');
    if (menu) {
        const buttons = menu.querySelectorAll('.tech-nav-btn[aria-haspopup="true"]');
        let openDropdown = null;

        const closeAll = () => {
            if (openDropdown) {
                openDropdown.classList.add('biotechidden');
                openDropdown.setAttribute('aria-hidden', 'true');
                const btn = openDropdown.previousElementSibling?.querySelector('.tech-nav-btn');
                btn?.setAttribute('aria-expanded', 'false');
                openDropdown = null;
            }
        };

        buttons.forEach(btn => {
            const dropdown = document.getElementById(btn.getAttribute('aria-controls'));
            if (!dropdown) return;

            btn.setAttribute('aria-expanded', 'false');
            dropdown.setAttribute('aria-hidden', 'true');

            btn.addEventListener('click', () => {
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                closeAll();
                if (!isExpanded) {
                    dropdown.classList.remove('biotechidden');
                    dropdown.setAttribute('aria-hidden', 'false');
                    btn.setAttribute('aria-expanded', 'true');
                    openDropdown = dropdown;
                }
            });

            btn.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                    setTimeout(() => dropdown.querySelector('[role="menuitem"]')?.focus(), 100);
                }
            });
        });

        menu.addEventListener('keydown', e => {
            const dropdown = openDropdown;
            if (!dropdown) return;
            const items = [...dropdown.querySelectorAll('[role="menuitem"]:not([disabled])')];
            const index = items.indexOf(document.activeElement);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                items[(index + 1) % items.length]?.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                items[(index - 1 + items.length) % items.length]?.focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                items[0]?.focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                items[items.length - 1]?.focus();
            } else if (e.key === 'Escape') {
                e.stopPropagation();
                closeAll();
                document.querySelector(`[aria-controls="${dropdown.id}"]`)?.focus();
            }
        });

        document.addEventListener('click', e => !menu.contains(e.target) && closeAll());
        document.addEventListener('keydown', e => e.key === 'Escape' && closeAll());
    }

    // ======================
    // 3. Orologio Moderno
    // ======================
    const clockEl = document.getElementById('clock2');
    if (clockEl) {
        const pad = n => n < 10 ? '0' + n : n;
        const updateClock = () => {
            const d = new Date();
            clockEl.textContent = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} - ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    // ======================
    // 4. Countdown al Nuovo Anno
    // ======================
    const countdownEl = document.getElementById('countdown-days');
    if (countdownEl) {
        const now = new Date();
        const nextYear = new Date(now.getFullYear() + 1, 0, 1);
        const days = Math.ceil((nextYear - now) / 86400000);
        countdownEl.textContent = days;
    }

    // ======================
    // 5. Ultima Modifica Pagina
    // ======================
    const lastModEl = document.getElementById('lastModified');
    if (lastModEl) {
        const d = new Date(document.lastModified);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        lastModEl.textContent = `Last edit: ${d.toLocaleDateString('it-IT', options)}`;
    }

    // ======================
    // 6. Lightbox
    // ======================
    const modal = document.getElementById('myModal');
    if (modal) {
        let slideIndex = 1;
        const showSlide = n => {
            const slides = document.getElementsByClassName("mySlides");
            const dots = document.getElementsByClassName("demo");
            if (slides.length === 0) return;
            slideIndex = n > slides.length ? 1 : n < 1 ? slides.length : n;
            Array.from(slides).forEach(s => s.style.display = 'none');
            Array.from(dots).forEach(d => d.className = d.className.replace(" active", ""));
            slides[slideIndex - 1].style.display = 'block';
            if (dots[slideIndex - 1]) {
                dots[slideIndex - 1].className += " active";
                document.getElementById("caption").innerHTML = dots[slideIndex - 1].alt || "";
            }
        };

        document.querySelectorAll('[data-modal-open]').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.style.display = 'block';
                showSlide(1);
            });
        });

        modal.querySelector('.close')?.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.querySelector('.close')?.click();
            } else if (e.key === 'ArrowRight') {
                plusSlides(1);
            } else if (e.key === 'ArrowLeft') {
                plusSlides(-1);
            }
        });

        window.plusSlides = n => showSlide(slideIndex + n);
        window.currentSlide = n => showSlide(n);
        showSlide(1);
    }

    // ======================
    // 7. Lazy Loading
    // ======================
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    if (target.tagName === 'IMG' && target.dataset.src) {
                        target.src = target.dataset.src;
                        target.removeAttribute('data-src');
                    } else if (target.tagName === 'VIDEO' && target.dataset.poster) {
                        target.poster = target.dataset.poster;
                        target.querySelectorAll('source').forEach(source => {
                            if (source.dataset.src) source.src = source.dataset.src;
                        });
                        target.load();
                    }
                    obs.unobserve(target);
                }
            });
        }, { threshold: 0.05 });

        document.querySelectorAll('img[data-src], video[data-poster]').forEach(el => observer.observe(el));
    } else {
        document.querySelectorAll('img[data-src]').forEach(img => img.src = img.dataset.src);
        document.querySelectorAll('video[data-poster]').forEach(video => {
            video.querySelectorAll('source').forEach(source => {
                if (source.dataset.src) source.src = source.dataset.src;
            });
            video.load();
        });
    }

    // ======================
    // 8. Accessibilità Video
    // ======================
    document.querySelectorAll('video[data-poster]').forEach(video => {
        video.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                video.play().catch(() => console.warn('Riproduzione bloccata.'));
            }
        });
    });

    // ======================
    // 9. Tema Dinamico
    // ======================
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const themes = [
            { name: 'Verde', rgb: '0, 230, 118', h: 143, s: '100%', l: '45%' },
            { name: 'Ciano', rgb: '0, 200, 255', h: 190, s: '100%', l: '50%' },
            { name: 'Viola', rgb: '138, 43, 226', h: 270, s: '75%', l: '53%' },
            { name: 'Arancione', rgb: '255, 140, 0', h: 39, s: '100%', l: '50%' },
            { name: 'Blu Profondo', rgb: '0, 120, 255', h: 210, s: '100%', l: '50%' }
        ];

        let currentThemeIndex = parseInt(localStorage.getItem('biotech-theme') || 0, 10) % themes.length;

        const applyTheme = index => {
            const t = themes[index];
            document.documentElement.style.setProperty('--color-accent-rgb', t.rgb);
            document.documentElement.style.setProperty('--color-accent-h', t.h);
            document.documentElement.style.setProperty('--color-accent-s', t.s);
            document.documentElement.style.setProperty('--color-accent-l', t.l);
            document.documentElement.style.setProperty('--color-glow', `hsl(${t.h}, 100%, 70%)`);
            themeBtn.textContent = `🎨 Tema: (${t.name})`;
            themeBtn.setAttribute('aria-label', `Cambia tema colore: attualmente ${t.name}, clicca per passare al successivo`);
        };

        applyTheme(currentThemeIndex);

        themeBtn.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            applyTheme(currentThemeIndex);
            localStorage.setItem('biotech-theme', currentThemeIndex);
        });
    }

    // ======================
    // 10. Gestione Lingua
    // ======================
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        let currentLang = localStorage.getItem('preferred-language') || (navigator.language.startsWith('en') ? 'en' : 'it');

        const updateButton = lang => {
            const flag = document.getElementById('lang-flag');
            const text = document.getElementById('lang-text');
            const label = document.getElementById('lang-label');
            if (flag) flag.textContent = lang === 'it' ? '🇬🇧' : '🇮🇹';
            if (text) text.textContent = lang === 'it' ? 'English' : 'Italiano';
            if (label) label.textContent = lang === 'it' ? 'Switch language' : 'Cambia lingua';
            langBtn.setAttribute('aria-label', lang === 'it' ? 'Switch to English' : 'Cambia lingua in italiano');
        };

        const loadTranslations = async () => {
            const pageName = window.location.pathname.split('/').pop().replace('.html', '').replace('-semplice', '');
            const common = await (await fetch('lang/common.json')).json().catch(() => ({}));
            let translations = { it: { ...common.it }, en: { ...common.en } };

            if (['index', 'Progetti', 'Staff', 'Marketing', 'Tech_Maturity', 'Dermatologia', 'Cuore', 'Cellula', 'Apparato_digerente', 'Apparato_respiratorio', 'Apparato_tegumentario', 'Sistema_linfatico', 'Specials', 'Capelli'].includes(pageName)) {
                const key = {
                    'index': 'home',
                    'Tech_Maturity': 'tech_maturity',
                    'Apparato_digerente': 'apparato_digerente',
                    'Apparato_respiratorio': 'apparato_respiratorio',
                    'Apparato_tegumentario': 'apparato_tegumentario',
                    'Sistema_linfatico': 'sistema_linfatico'
                }[pageName] || pageName.toLowerCase();
                const pageData = await (await fetch(`lang/${key}.json`)).json().catch(() => ({}));
                if (pageData.it) translations.it = { ...translations.it, ...pageData.it };
                if (pageData.en) translations.en = { ...translations.en, ...pageData.en };
            }

            const apply = (data, lang) => {
                document.querySelectorAll('[data-lang-key]').forEach(el => {
                    const key = el.getAttribute('data-lang-key');
                    const value = data[lang]?.[key];
                    if (value !== undefined) {
                        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                            el.setAttribute('placeholder', value);
                        } else if (el.tagName === 'IMG') {
                            el.setAttribute('alt', value);
                        } else if (el.hasAttribute('aria-label')) {
                            el.setAttribute('aria-label', value);
                            const b = el.querySelector('b');
                            if (b) b.textContent = value;
                            else el.innerHTML = value;
                        } else {
                            const b = el.querySelector('b');
                            if (b) b.textContent = value;
                            else el.innerHTML = value;
                        }
                    }
                });
            };

            apply(translations, currentLang);
            document.documentElement.lang = currentLang;
            updateButton(currentLang);
        };

        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'it' ? 'en' : 'it';
            localStorage.setItem('preferred-language', currentLang);
            location.reload();
        });

        loadTranslations();
    }

    // ======================
    // 11. Pronuncia Termini
    // ======================
    window.speakTerm = (term, language = 'italiano') => {
        if (speechSynthesis.speaking) speechSynthesis.cancel();

        const custom = {
            'CRISPR': 'Clustered Regularly Interspaced Short Palindromic Repeats',
            'mitocondri': 'Mi-to-con-dri', 'lisosoma': 'Li-so-so-ma', 'miochine': 'Mi-o-ki-ne',
            'sinaptogenesi': 'Si-na-to-jen-e-si', 'epigenetici': 'E-pi-je-ne-ti-ci', 'ATP': 'Adenosina trifosfato',
            'DNA': 'Acido desossiribonucleico', 'RNA': 'Acido ribonucleico', 'tegumento': 'Te-gu-men-to', 'Pecquet': 'Pes-ché'
        };

        const langMap = { 'italiano': 'it-IT', 'inglese': 'en-US' };
        const utterance = new SpeechSynthesisUtterance(custom[term.toLowerCase()] || term);
        utterance.lang = langMap[language] || 'it-IT';
        utterance.rate = 0.8; utterance.pitch = 1.0; utterance.volume = 1.0;
        speechSynthesis.speak(utterance);
    };

    // ======================
    // 12. Popup Centrati
    // ======================
    window.openPopup = (url, title, w, h) => {
        const left = (screen.width - w) / 2;
        const top = (screen.height - h) / 2;
        const options = `width=${w},height=${h},top=${top},left=${left},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no`;
        const popup = window.open(url, title, options);
        if (!popup || popup.closed) alert("Il popup è stato bloccato. Abilita i popup per questo sito.");
        else popup.focus();
    };

    window.openSupportPopup = () => openPopup('https://gitechnolo.github.io/biotechproject/O.S_support.html', 'O.S. Support Chat GPT', 760, 440);
    window.openContactPopup = () => openPopup('https://gitechnolo.github.io/biotechproject/Tablet_forum.html', 'Contattaci - Forum ChatGPT', 825, 672);
});     