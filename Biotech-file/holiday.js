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
  astro: 'background: #D4AF37; color: #000000; border: 1px solid #B8860B; border: 1px solid #00c853;',
  display: 'background: #008080; color: #ffffff; border: 1px solid #004d4d; border: 1px solid #00c853;'
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

// --- HOLIDAY CALCULATION STRATEGIES ---
/**
 * Butcher-Meeus per la Pasqua
 */
function getEaster(year) {
    const a = year % 19, b = Math.floor(year / 100), c = year % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return { month: month - 1, day: day };
}

/**
 * Calcolo Thanksgiving (Quarto Giovedì di Novembre)
 */
function getThanksgiving(year) {
    const firstOfNov = new Date(year, 10, 1);
    const dayOfWeek = firstOfNov.getDay(); 
    const daysUntilFirstThursday = (4 - dayOfWeek + 7) % 7;
    const day = 1 + daysUntilFirstThursday + 21;
    return { month: 10, day: day };
}

// --- MAIN ENGINE ---

function getNextHoliday() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentYear = today.getFullYear();

    // Log ASTRO: visualizzato ogni volta che lo script ricalcola i cicli
    console.log(`%c 🌕 ASTRO %c Syncing dynamic cycles for ${currentYear}`, SRE_H_LOGS.astro + SRE_H_LOGS.base, "color: #888; margin-left: 5px;");

    const holidaySchema = [
        { name: "St. Patrick's Day", month: 2, day: 17, style: "st-patrick", wish: "Happy St. Paddy's!", icon: "☘️", isDynamic: false },
        { name: "Easter", style: "easter", wish: "Happy Easter!", icon: "🐣", isDynamic: true, calc: getEaster },
        { name: "4th of July", month: 6, day: 4, style: "july4", wish: "Happy Independence Day!", icon: "🎆", isDynamic: false },
        { name: "Halloween", month: 9, day: 31, style: "halloween", wish: "Spooky Halloween!", icon: "🎃", isDynamic: false },
        { name: "Thanksgiving", style: "thanksgiving", wish: "Happy Thanksgiving!", icon: "🦃", isDynamic: true, calc: getThanksgiving },
        { name: "Christmas", month: 11, day: 25, style: "natale", wish: "Merry Christmas!", icon: "🎄", isDynamic: false }
    ];

    const upcomingHolidays = holidaySchema.map(h => {
        let date;
        if (h.isDynamic) {
            const dData = h.calc(currentYear);
            date = new Date(currentYear, dData.month, dData.day);
            if (date < today) {
                const nextYearData = h.calc(currentYear + 1);
                date = new Date(currentYear + 1, nextYearData.month, nextYearData.day);
            }
        } else {
            date = new Date(currentYear, h.month, h.day);
            if (date < today) {
                date = new Date(currentYear + 1, h.month, h.day);
            }
        }
        return { ...h, date };
    }).sort((a, b) => a.date - b.date);

    const nextHoliday = upcomingHolidays[0];
    const daysLeft = Math.ceil((nextHoliday.date - today) / 86400000);
    const isToday = daysLeft === 0;

    // Log DISPLAY: Icona e stato della prossima festività
    console.log(
        `%c${nextHoliday.icon} BiotechHoliday%c ${nextHoliday.name}: ${isToday ? 'ACTIVE' : daysLeft + 'd left'}`, 
        SRE_H_LOGS.display + SRE_H_LOGS.base, 
        "color: #bcbcbc; margin-left: 5px;"
    );

    return {
        msg: isToday 
            ? `${nextHoliday.icon} <span class="holiday-name ${nextHoliday.style}">${nextHoliday.wish}</span>`
            : `Only ${daysLeft} days until ${nextHoliday.icon} <span class="holiday-name ${nextHoliday.style}">${nextHoliday.name}</span>!`,
        style: nextHoliday.style
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