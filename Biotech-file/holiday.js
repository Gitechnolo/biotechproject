/**
 * =============================================================================
 * PROJECT BIOTECH - CORE SCRIPT
 * =============================================================================
 * [SRE ADVISORY & ARCHITECTURAL PHILOSOPHY]
 * This script implements "Graceful Degradation" and "Resilience by Design" logic.
 * We do not seek the illusion of a static, error-free system (Zero-Entropy), 
 * but instead aim for risk management through resource pre-loading 
 * and smooth transition state handling (UI/UX Latency Budget). 
 * =============================================================================
 */
// Namespace UNICO per il modulo Holiday - Colori differenziati
const SRE_H_LOGS = {
  base: 'font-family: "Segoe UI", Tahoma, sans-serif; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px;',
  astro: 'background: #D4AF37; color: #000000; border: 1px solid #B8860B; border-left: 1px solid #00c853;',
  display: 'background: #008080; color: #ffffff; border: 1px solid #004d4d; border-left: 1px solid #00c853;',
// Holiday-specific styles
  stPatrick: 'background: #2e7d32; color: #ffffff; border: 1px solid #1b5e20; border-left: 5px solid #00c853;',
  mayday: 'background: #c62828; color: #ffffff; border: 1px solid #b71c1c; border-left: 5px solid #00c853;', // Red for Labor Day
  easter: 'background: #ffb74d; color: #000000; border: 1px solid #ff9800; border-left: 1px solid #00c853;',
  eastermonday: 'background: #77dd77; color: #000000; border: 1px solid #55aa55; border-left: 1px solid #00c853;',
  july4: 'background: #1565c0; color: #ffffff; border: 1px solid #0d47a1; border-left: 5px solid #f44336;',
  halloween: 'background: #ef6c00; color: #ffffff; border: 1px solid #e65100; border-left: 5px solid #000000;',
  thanksgiving: 'background: #8d6e63; color: #ffffff; border: 1px solid #5d4037; border-left: 5px solid #ffa000;',
  natale: 'background: #d32f2f; color: #ffffff; border: 1px solid #b71c1c; border-left: 5px solid #ffffff;'
};

document.addEventListener("DOMContentLoaded", function () {
    
    // --- PROMISE-BASED INITIALIZATION ---
    // Inizializzazione come una catena asincrona
    const systemInit = new Promise((resolve) => {
        
        // 1. BANNER CYCLING & PRELOAD
        const bannerImg = document.getElementById("Banner");
        if (bannerImg) {
            const banners = [
                "https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner1.avif",
                "https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner2.avif",
                "https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner3.avif",
                "https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner4.avif"
            ];

            banners.map(src => {
                const img = new Image();
                img.src = src;
                return img;
            });

            let bnrCntr = 0;
            setInterval(() => {
                bannerImg.classList.add("banner-fade-out");
                setTimeout(() => {
                    bnrCntr = (bnrCntr + 1) % banners.length;
                    bannerImg.src = banners[bnrCntr];
                    bannerImg.classList.remove("banner-fade-out");
                }, 500);
            }, 3500);
        }

        // 2. HOLIDAY COUNTER
        const msgContainer = document.getElementById("holidayMsg");
        if (msgContainer) {
            const holiday = getNextHoliday();
            msgContainer.innerHTML = `<p class="holiday-countdown ${holiday.style}">${holiday.msg}</p>`;
        }

        resolve("DOM and Assets initialized.");
    });

    // --- EXECUTION OF THE SYNC LOGIC ---
    systemInit
        .then(() => {
            // Sistema pronto, ma attendiamo che la finestra sia caricata 
            // per la sincronizzazione finale
            return new Promise(resolve => window.addEventListener("load", resolve));
        })
        .then(() => {
            // Esecuzione del trigger 
            triggerHumanSync();
        });
});

/**
 * [FUNCTION] triggerHumanSync
 * Latent visual resonance in the system.
 * Signals that the "Minotaur" of complex data has been harnessed 
 * and the system is in a state of creative stasis.
 */
function triggerHumanSync() {
    // Colore verde neon con un'ombra per profondità
    const logStyle = "color: #B5EAD7; font-family: 'Courier New', monospace; background: #1a1a1a; padding: 2px 5px; border-radius: 3px; border: 1px solid rgba(0, 230, 118, 0.3); text-shadow: 1px 1px 2px rgba(137, 43, 226, 0.568);";
    console.log("%c 🐂 SYNC BiotechProject: Mastering the beast. Passion and logic synchronized within the labyrinth.", logStyle);
}


// --- CALCOLATORI ATOMICI ---
const HolidayCalcs = {
    // Butcher-Meeus (Easter)
    easter: (y) => {
        const a = y % 19, b = Math.floor(y / 100), c = y % 100;
        const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return { month: month - 1, day };
    },
    // Quarto Giovedì di Novembre
    thanksgiving: (y) => {
        const first = new Date(y, 10, 1).getDay();
        const day = 22 + (4 - first + 7) % 7;
        return { month: 10, day };
    },
    // Helper per date fisse
    fixed: (m, d) => () => ({ month: m, day: d }),
    
    // FIX ROBUSTO: Calcola la data relativa gestendo il cambio mese/anno
    relative: (calcFn, offsetDays) => (y) => {
        const base = calcFn(y);
        const date = new Date(y, base.month, base.day + offsetDays);
        return { month: date.getMonth(), day: date.getDate() };
    }
};

// --- REGISTRO DELLE FESTIVITÀ ---
const HOLIDAY_SCHEMA = [
    { name: "St. Patrick's Day", style: "stPatrick",    wish: "Happy St. Paddy's!",       icon: "☘️", calc: HolidayCalcs.fixed(2, 17) },
    { name: "Labor Day",         style: "mayday",       wish: "Happy Labor Day!",         icon: "🛠️", calc: HolidayCalcs.fixed(4, 1)  },
    { name: "Easter",            style: "easter",       wish: "Happy Easter!",            icon: "🐣", calc: HolidayCalcs.easter       },
    { name: "Easter Monday",     style: "eastermonday", wish: "Happy Easter Monday!",     icon: "🧺", calc: HolidayCalcs.relative(HolidayCalcs.easter, 1) },
    { name: "4th of July",       style: "july4",        wish: "Happy Independence Day!",  icon: "🎆", calc: HolidayCalcs.fixed(6, 4)  },
    { name: "Halloween",         style: "halloween",    wish: "Spooky Halloween!",        icon: "🎃", calc: HolidayCalcs.fixed(9, 31) },
    { name: "Thanksgiving",      style: "thanksgiving", wish: "Happy Thanksgiving!",      icon: "🦃", calc: HolidayCalcs.thanksgiving },
    { name: "Christmas",         style: "natale",       wish: "Merry Christmas!",         icon: "🎄", calc: HolidayCalcs.fixed(11, 25)}
];

// --- MAIN ENGINE ---
function getNextHoliday() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentYear = today.getFullYear();

    console.log(`%c 🌕 ASTRO %c Syncing dynamic cycles for ${currentYear}`, SRE_H_LOGS.astro + SRE_H_LOGS.base, "color: #888; margin-left: 5px;");

    const upcoming = HOLIDAY_SCHEMA.map(h => {
        let { month, day } = h.calc(currentYear);
        let date = new Date(currentYear, month, day);

        if (date < today) {
            ({ month, day } = h.calc(currentYear + 1));
            date = new Date(currentYear + 1, month, day);
        }

        const diff = Math.ceil((date - today) / 86400000);
        return { ...h, date, diff };
    }).sort((a, b) => a.diff - b.diff);

    const next = upcoming[0];
    const isToday = next.diff === 0;

    const logStyle = SRE_H_LOGS[next.style] || SRE_H_LOGS.display;

    console.log(
        `%c${next.icon} BiotechHoliday%c ${next.name}: ${isToday ? 'ACTIVE' : next.diff + 'd left'}`,
        logStyle + SRE_H_LOGS.base,
        "color: #bcbcbc; margin-left: 5px;"
    );

    return {
        msg: isToday
            ? `${next.icon} <span class="holiday-name ${next.style}">${next.wish}</span>`
            : `Only ${next.diff} days until ${next.icon} <span class="holiday-name ${next.style}">${next.name}</span>!`,
        style: next.style
    };
}

// Light effect functions
function turnOnLight() {
    const img = document.getElementById('myImage');
    if (img) { img.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/pic_bulbon.avif'; img.classList.add('bulb-glow'); }
}
function turnOffLight() {
    const img = document.getElementById('myImage');
    if (img) { img.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/pic_bulboff.avif'; img.classList.remove('bulb-glow'); }
}

// === EFFECT WITH FADE-IN SEQUENCE (Encapsulated) ===
(function() {
    const initFadeInSequence = () => {
        const lines = document.querySelectorAll(".type-line");
        let currentLineIndex = 0;
        const showNextLine = () => {
            if (currentLineIndex >= lines.length) return;
            const line = lines[currentLineIndex];
            if (line.textContent.trim().length === 0) { setTimeout(showNextLine, 50); return; }
            line.classList.add("is-visible");
            currentLineIndex++;
            setTimeout(showNextLine, 500);
        };
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { showNextLine(); observer.disconnect(); }
        }, { threshold: 0.2 });
        const terminalWindow = document.querySelector(".terminal-window");
        if (terminalWindow) observer.observe(terminalWindow);
    };
    window.addEventListener("load", initFadeInSequence);
})();

/**
 * [ARTISTIC ANALOGY: THE MINOTAUR PHILOSOPHY]
 * Author's Vision:
 * This project draws inspiration from Picasso's identification with the Minotaur 
 * (1927-1938). In the labyrinth of Biotechnology and Code, we do not seek to 
 * destroy the "beast" (complexity/instability), but to coexist with it by 
 * mastering the creative passion through rigorous logic.
 * * "Refusing to kill the Minotaur. Coexisting with the beast."
 */