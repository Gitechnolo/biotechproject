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
    
    console.log("%c[SYNC] BiotechProject: Mastering the beast. Passion and logic synchronized within the labyrinth.", logStyle);
}

// --- SUPPORT FUNCTIONS ---

function getNextHoliday() {
    const now = new Date();
    const year = now.getFullYear();

    const holidayDefs = [
        { name: "St. Patrick's Day", month: 3,  day: 17, style: "st-patrick" },
        { name: "4th of July",        month: 7,  day: 4,  style: "july4"      },
        { name: "Halloween",          month: 10, day: 31, style: "halloween"  },
        { name: "Christmas",          month: 12, day: 25, style: "natale"     },
    ];

    // Genera le date per l'anno corrente e, se già passate, per il prossimo
    const holidays = holidayDefs.map(({ name, month, day, style }) => {
        let date = new Date(year, month - 1, day);
        if (date <= now) date = new Date(year + 1, month - 1, day);
        return { name, style, date };
    });

    // Ordina e prendi la più vicina
    holidays.sort((a, b) => a.date - b.date);
    const next = holidays;

    const daysLeft = Math.ceil((next.date - now) / (1000 * 60 * 60 * 24));

    return {
        msg: `Only ${daysLeft} days until <span class="holiday-name ${next.style}">${next.name}</span>!`,
        style: next.style,
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