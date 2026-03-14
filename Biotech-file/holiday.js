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
  stPatrick: 'background: #2e7d32; color: #ffffff; border: 1px solid #1b5e20; border-left: 2px solid #00c853;',
  backupDay: 'background: #455a64; color: #ffffff; border: 1px solid #263238; border-left: 3px solid #00c853;',
  dnaDay: 'background: #009688; color: #ffffff; border: 1px solid #00695c; border-left: 3px solid #ffffff;',
  mayday: 'background: #c62828; color: #ffffff; border: 1px solid #b71c1c; border-left: 3px solid #00c853;', // Red for Labor Day
  easter: 'background: #ffb74d; color: #000000; border: 1px solid #ff9800; border-left: 2px solid #00c853;',
  eastermonday: 'background: #77dd77; color: #000000; border: 1px solid #55aa55; border-left: 2px solid #00c853;',
  july4: 'background: #1565c0; color: #ffffff; border: 1px solid #0d47a1; border-left: 3px solid #f44336;',
  halloween: 'background: #ef6c00; color: #ffffff; border: 1px solid #e65100; border-left: 3px solid #000000;',
  thanksgiving: 'background: #8d6e63; color: #ffffff; border: 1px solid #5d4037; border-left: 3px solid #ffa000;',
  natale: 'background: #d32f2f; color: #ffffff; border: 1px solid #b71c1c; border-left: 3px solid #ffffff;'
};

document.addEventListener("DOMContentLoaded", function () {
    
    // --- PROMISE-BASED INITIALIZATION ---
const systemInit = new Promise((resolve) => {
    const bannerImg = document.getElementById("Banner");
    if (bannerImg) {
        const banners = [
            "https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner1.avif",
            "https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner2.avif",
            "https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner3.avif",
            "https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner4.avif"
        ];
        // 1: forEach invece di map per il preload
        // 2: Controllo base sulla connessione (Preload con verifica)
        const isSlowConn = navigator.connection && (navigator.connection.saveData || /2g|slow-2g/.test(navigator.connection.effectiveType));
        
        if (!isSlowConn) {
            banners.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        }

        let bnrCntr = 0;
        // Salvare l'ID per cleanup se necessario
        const bannerInterval = setInterval(() => {
            bannerImg.classList.add("banner-fade-out");
            setTimeout(() => {
                bnrCntr = (bnrCntr + 1) % banners.length;
                bannerImg.src = banners[bnrCntr];
                bannerImg.classList.remove("banner-fade-out");
            }, 500);
        }, 3500);
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
            // --- SISTEMA SINCRONIZZATO E PRONTO ---
            
            // A. Calcoliamo la festività 
            const holiday = getNextHoliday();

            // B. TRIGGER DEL POPUP 
            showHolidayPopup(holiday);

            // C. Log di sistema finale
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


/**
 * Genera e mostra notifica a comparsa basata sui dati festività.
 * Include il metodo di export SRE integrato.
 */
function showHolidayPopup(holiday) {
    const popup = document.createElement('div');
    popup.className = `holiday-popup ${holiday.style}`;
    
    // Struttura aggiornata: testo + icona export + chiusura
    popup.innerHTML = `
        <span class="popup-text">${holiday.msg}</span>
        <span class="popup-export" title="Export CSV Data">💾</span>
        <span class="popup-close" title="Chiudi">&times;</span>
    `;
    document.body.appendChild(popup);

    // Funzione interna per chiudere con grazia (transizione CSS)
    const closePopup = () => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 600); // Rimuove dal DOM dopo l'animazione
    };

    // --- LOGICA TIMER ---
    // Il popup scompare automaticamente dopo 6 secondi
    let autoCloseTimeout = setTimeout(closePopup, 6000);

    // --- GESTIONE EVENTI ---

    // 1. Click su Export: scarica il file e ferma il timer per dare tempo all'utente
    popup.querySelector('.popup-export').addEventListener('click', (e) => {
        e.stopPropagation();
        exportHolidayData('csv'); 
        clearTimeout(autoCloseTimeout); // Blocca la sparizione automatica se l'utente interagisce
        console.log("%c 🟢 SRE Action: Export triggered from UI. Auto-close suspended.", "color: #00c853;");
    });

    // 2. Click sulla X: chiusura manuale immediata
    popup.querySelector('.popup-close').addEventListener('click', () => {
        clearTimeout(autoCloseTimeout);
        closePopup();
    });

    // Entrata (trigger animazione CSS)
    setTimeout(() => popup.classList.add('show'), 100);
}

/**
 * [SRE ENGINE] getProcessedHolidays
 * Centralizza il calcolo per garantire coerenza tra UI, Log e Export.
 */
const getProcessedHolidays = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentYear = today.getFullYear();

    return HOLIDAY_SCHEMA.map(h => {
        const res = h.calc(currentYear);
        let date = new Date(currentYear, res.month, res.day);

        if (date < today) {
            const nextRes = h.calc(currentYear + 1);
            date = new Date(currentYear + 1, nextRes.month, nextRes.day);
        }

        const diff = Math.ceil((date - today) / 86400000);
        return { ...h, date, diff };
    }).sort((a, b) => a.diff - b.diff);
};

// --- FUNZIONE HELPER PER TIMESTAMP DINAMICO ---
function getTimestampWithPhase() {
    const now = new Date();
    const hours = now.getHours();
    const timestamp = now.toTimeString().split(' ')[0];
    
    const isDay = hours >= 6 && hours < 18;
    const icon = isDay ? "☀️" : "🌙";
    const phase = isDay ? "Daylight" : "Nightly";
    
    return {
        icon, phase, timestamp,
        part1: `${icon} ${phase}`,
        part2: ` | ${timestamp}`
    };
}

// --- CALCOLATORI ATOMICI ---
const HolidayCalcs = {
    easter: (y) => {
        const a = y % 19, b = Math.floor(y / 100), c = y % 100;
        const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return { month: month - 1, day: day };
    },
    thanksgiving: (y) => {
        const first = new Date(y, 10, 1).getDay();
        const day = 22 + (4 - first + 7) % 7;
        return { month: 10, day: day };
    },
    fixed: (m, d) => () => ({ month: m, day: d }),
    relative: (calcFn, offsetDays) => (y) => {
        const base = calcFn(y);
        const date = new Date(y, base.month, base.day + offsetDays);
        return { month: date.getMonth(), day: date.getDate() };
    }
};

// --- REGISTRO DELLE FESTIVITÀ ---
const HOLIDAY_SCHEMA = [
    { name: "St. Patrick's Day", style: "stPatrick",    wish: "Happy St. Paddy's!",       icon: "☘️", calc: HolidayCalcs.fixed(2, 17) },
    { name: "World Backup Day",  style: "backupDay",    wish: "Resilience starts with a backup!", icon: "💾", calc: HolidayCalcs.fixed(2, 31) },
    { name: "National DNA Day",  style: "dnaDay",       wish: "Celebrating the code of life!",    icon: "🧬", calc: HolidayCalcs.fixed(3, 25) },
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
    const tData = getTimestampWithPhase();
    const currentYear = new Date().getFullYear();

    console.log(
        `%c ${tData.part1} %c${tData.part2} %c Syncing dynamic cycles for ${currentYear}`,
        SRE_H_LOGS.astro + SRE_H_LOGS.base,
        "color: #888; margin-left: 5px; font-family: monospace;",
        "color: #555; margin-left: 10px; font-style: italic;"
    );

    const upcoming = getProcessedHolidays();

    console.groupCollapsed('%c📅 Upcoming Holidays Table', SRE_H_LOGS.display + SRE_H_LOGS.base);
    console.table(upcoming.map(h => ({
        Icon: h.icon,
        Holiday: h.name,
        Date: h.date.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }),
        DaysLeft: h.diff === 0 ? '🎉 TODAY' : `${h.diff}d`
    })));
    console.groupEnd();

    const next = upcoming[0]; 
    const isToday = next.diff === 0;
    const logStyle = SRE_H_LOGS[next.style] || SRE_H_LOGS.display;

    console.log(
        `%c ${next.icon} BiotechHoliday %c ${next.name}: ${isToday ? 'ACTIVE' : next.diff + 'd left'}`,
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

/**
 * [SRE UTILITY] exportHolidayData (Versione Completa)
 */
function exportHolidayData(format = 'json') {
    const data = getProcessedHolidays();
    const exportTime = new Date().toISOString();

    if (format === 'csv') {
        const headers = ["Icon", "Holiday", "Date", "DaysLeft", "SystemStatus"];
        const rows = data.map(item => [
            item.icon, 
            item.name, 
            item.date.toISOString().split('T')[0], 
            item.diff,
            "SRE_VERIFIED"
        ]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        downloadFile(csvContent, `biotech_export_${new Date().getFullYear()}.csv`, 'text/csv');
    } else {
        const payload = {
            system: "Biotech-Core",
            exportedAt: exportTime,
            holidays: data.map(h => ({
                name: h.name, icon: h.icon, date: h.date.toISOString().split('T')[0], daysLeft: h.diff
            }))
        };
        downloadFile(JSON.stringify(payload, null, 2), 'biotech_holidays.json', 'application/json');
    }
    console.log(`%c 💾 Export completed: ${format.toUpperCase()}`, SRE_H_LOGS.backupDay + SRE_H_LOGS.base);
}

window.exportHolidayData = exportHolidayData;

function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
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