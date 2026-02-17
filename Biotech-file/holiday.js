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
    // Colore verde neon con un'ombra che suggerisce profondità
    const logStyle = "color: #00e676; font-weight: bold; font-family: 'Courier New', monospace; background: #121212; padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(0, 230, 118, 0.5); text-shadow: 1px 1px 2px black;";
    
    console.log("%c[SYNC] BiotechProject: Mastering the beast. Passion and logic synchronized within the labyrinth.", logStyle);
}

// --- SUPPORT FUNCTIONS ---

function getNextHoliday() {
    const now = new Date();
    const year = now.getFullYear();
    const holidays = [
        { name: "St. Patrick's Day", date: new Date(`${year}-03-17`), style: "st-patrick" },
        { name: "4th of July", date: new Date(`${year}-07-04`), style: "july4" },
        { name: "Halloween", date: new Date(`${year}-10-31`), style: "halloween" },
        { name: "Christmas", date: new Date(`${year}-12-25`), style: "natale" }
    ];
    if (now > holidays[3].date) holidays[0].date = new Date(`${year + 1}-03-17`);
    const nextHoliday = holidays.find(h => h.date > now) || holidays[0];
    const daysLeft = Math.ceil((nextHoliday.date - now) / (1000 * 60 * 60 * 24));
    return {
        msg: `Only ${daysLeft} days until <span class="holiday-name ${nextHoliday.style}">${nextHoliday.name}</span>!`,
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