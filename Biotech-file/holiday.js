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
/**
 * =============================================================================
 * PROJECT BIOTECH - CORE SCRIPT (V4.3 CONTROL CENTER)
 * =============================================================================
 * [PATCH] Manual Override: Exporting data now suspends TTL (auto-close).
 * [SRE COMPLIANCE] Logic & Passion synchronized within the labyrinth.
 */

(function() {
    "use strict";

    const CONFIG = {
        POPUP_AUTO_CLOSE_MS: 8000,
        BANNER_ROTATION_MS: 4000,
        TRANSITION_MS: 500
    };

    const biotechState = {
        bannerInterval: null,
        abortController: new AbortController(),
        timeouts: [],
        intervals: [],
        cachedHolidays: null,
        cacheTimestamp: null
    };

    const SRE_H_LOGS = {
        base: 'font-family: "Segoe UI", Tahoma, sans-serif; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px;',
        astro: 'background: #D4AF37; color: #000000; border: 1px solid #B8860B; border-left: 1px solid #00c853;',
        display: 'background: #008080; color: #ffffff; border: 1px solid #004d4d; border-left: 1px solid #00c853;',
        stPatrick: 'background: #2e7d32; color: #ffffff; border: 1px solid #1b5e20; border-left: 2px solid #00c853;',
        backupDay: 'background: #455a64; color: #ffffff; border: 1px solid #263238; border-left: 3px solid #00c853;',
        dnaDay: 'background: #009688; color: #ffffff; border: 1px solid #00695c; border-left: 3px solid #ffffff;',
        mayday: 'background: #c62828; color: #ffffff; border: 1px solid #b71c1c; border-left: 3px solid #00c853;',
        easter: 'background: #ffb74d; color: #000000; border: 1px solid #ff9800; border-left: 2px solid #00c853;',
        eastermonday: 'background: #77dd77; color: #000000; border: 1px solid #55aa55; border-left: 2px solid #00c853;',
        july4: 'background: #1565c0; color: #ffffff; border: 1px solid #0d47a1; border-left: 3px solid #f44336;',
        halloween: 'background: #ef6c00; color: #ffffff; border: 1px solid #e65100; border-left: 3px solid #000000;',
        thanksgiving: 'background: #8d6e63; color: #ffffff; border: 1px solid #5d4037; border-left: 3px solid #ffa000;',
        natale: 'background: #d32f2f; color: #ffffff; border: 1px solid #b71c1c; border-left: 3px solid #ffffff;'
    };

    // --- Holiday Engine (Identico alla V4.2 per stabilità) ---
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
        fixed: (m, d) => {
            const currentYear = new Date().getFullYear();
            const testDate = new Date(currentYear, m, d);
            if (testDate.getMonth() !== m) {
                const lastDay = new Date(currentYear, m + 1, 0).getDate();
                console.warn(`⚠️ SRE Auto-Correct: ${m}/${d} invalid. Fixed to ${lastDay}.`);
                return () => ({ month: m, day: lastDay });
            }
            return () => ({ month: m, day: d });
        },
        relative: (calcFn, offsetDays) => (y) => {
            const base = calcFn(y);
            const date = new Date(y, base.month, base.day + offsetDays);
            return { month: date.getMonth(), day: date.getDate() };
        }
    };

    const HOLIDAY_SCHEMA = [
        { name: "St. Patrick's Day", style: "stPatrick", wish: "Happy St. Paddy's!", icon: "☘️", calc: HolidayCalcs.fixed(2, 17) },
        { name: "World Backup Day", style: "backupDay", wish: "Resilience starts with a backup!", icon: "💾", calc: HolidayCalcs.fixed(2, 31) },
        { name: "Easter", style: "easter", wish: "Happy Easter!", icon: "🐣", calc: HolidayCalcs.easter },
        { name: "Easter Monday", style: "eastermonday", wish: "Happy Easter Monday!", icon: "🧺", calc: HolidayCalcs.relative(HolidayCalcs.easter, 1) },
        { name: "National DNA Day", style: "dnaDay", wish: "Celebrating the code of life!", icon: "🧬", calc: HolidayCalcs.fixed(3, 25) },
        { name: "Labor Day", style: "mayday", wish: "Happy Labor Day!", icon: "🛠️", calc: HolidayCalcs.fixed(4, 1) },
        { name: "4th of July", style: "july4", wish: "Happy Independence Day!", icon: "🎆", calc: HolidayCalcs.fixed(6, 4) },
        { name: "Halloween", style: "halloween", wish: "Spooky Halloween!", icon: "🎃", calc: HolidayCalcs.fixed(9, 31) },
        { name: "Thanksgiving", style: "thanksgiving", wish: "Happy Thanksgiving!", icon: "🦃", calc: HolidayCalcs.thanksgiving },
        { name: "Christmas", style: "natale", wish: "Merry Christmas!", icon: "🎄", calc: HolidayCalcs.fixed(11, 25)}
    ];

    // --- Core Logic ---
    const getProcessedHolidays = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (biotechState.cachedHolidays && biotechState.cacheTimestamp?.getTime() === today.getTime()) return biotechState.cachedHolidays;
        
        const result = HOLIDAY_SCHEMA.map(h => {
            let res = h.calc(today.getFullYear());
            let date = new Date(today.getFullYear(), res.month, res.day);
            if (date < today) {
                res = h.calc(today.getFullYear() + 1);
                date = new Date(today.getFullYear() + 1, res.month, res.day);
            }
            const diff = Math.ceil((date - today) / 86400000);
            return { ...h, date, diff };
        }).sort((a, b) => a.diff - b.diff);

        biotechState.cachedHolidays = result;
        biotechState.cacheTimestamp = today;
        return result;
    };

    // --- UI ENGINE (With Manual Override Patch) ---
    function showHolidayPopup(holiday) {
        const popup = document.createElement('div');
        popup.className = `holiday-popup ${holiday.style}`;
        popup.innerHTML = `
            <span class="popup-text">${holiday.msg}</span>
            <div class="popup-controls">
                <span class="popup-export" role="button" title="Export CSV Data">💾</span>
                <span class="popup-close" role="button" title="Chiudi">&times;</span>
            </div>
            <div class="popup-progress-container"><div class="popup-progress-bar"></div></div>
        `;
        document.body.appendChild(popup);

        let autoCloseTimeout, liveSyncInterval;

        const destroyPopup = () => {
            clearTimeout(autoCloseTimeout);
            clearInterval(liveSyncInterval);
            popup.classList.remove('show');
            const t = setTimeout(() => popup.remove(), 600);
            biotechState.timeouts.push(t);
        };

        // Real-time Countdown
        if (holiday.isToday) {
            liveSyncInterval = setInterval(() => {
                const now = new Date();
                const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                const diff = end - now;
                if (diff <= 0) return destroyPopup();
                const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
                const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                const textEl = popup.querySelector('.popup-text');
                if (textEl) textEl.innerHTML = `${holiday.icon} ${holiday.wish} <br><small style="opacity:0.8; font-size:0.8em;">Ends in: ${h}:${m}:${s}</small>`;
            }, 1000);
            biotechState.intervals.push(liveSyncInterval);
        }

        // --- INTERACTION HANDLERS ---
        popup.querySelector('.popup-close').addEventListener('click', destroyPopup);

        popup.querySelector('.popup-export').addEventListener('click', (e) => {
            e.stopPropagation();
            
            // 🛑 SRE OVERRIDE: Fermiamo i timer automatici
            clearTimeout(autoCloseTimeout);
            if (liveSyncInterval) clearInterval(liveSyncInterval);
            
            // Rimuoviamo il feedback visivo della progress bar (che simula il TTL)
            const progressBar = popup.querySelector('.popup-progress-bar');
            if (progressBar) progressBar.style.animation = 'none'; 

            // Eseguiamo l'export
            exportHolidayData('csv');

            console.log("%c 🟢 SRE Action: Export triggered. Manual override active (TTL Suspended).", "color: #00c853; font-weight: bold;");
        });

        setTimeout(() => popup.classList.add('show'), 100);
        autoCloseTimeout = setTimeout(destroyPopup, CONFIG.POPUP_AUTO_CLOSE_MS);
        biotechState.timeouts.push(autoCloseTimeout);
    }

    // --- System Analytics & Logs ---
    function executeHolidayLifecycle() {
        const now = new Date();
        const hours = now.getHours();
        const timestamp = now.toTimeString().split(' ')[0];
        const isDay = hours >= 6 && hours < 18;

        console.log(`%c ${isDay?"☀️ Daylight":"🌙 Nightly"} %c | ${timestamp} %c Syncing dynamic cycles for ${now.getFullYear()}`, 
            SRE_H_LOGS.astro + SRE_H_LOGS.base, "color: #888; margin-left: 5px; font-family: monospace;", "color: #555; font-style: italic;");

        const upcoming = getProcessedHolidays();

        console.groupCollapsed('%c📅 Upcoming Holidays Table', SRE_H_LOGS.display + SRE_H_LOGS.base);
        console.table(upcoming.map(h => ({
            Icon: h.icon, Holiday: h.name, 
            Date: h.date.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }),
            DaysLeft: h.diff === 0 ? '🎉 TODAY' : `${h.diff}d`
        })));
        console.groupEnd();

        const next = upcoming[0];
        const isToday = next.diff === 0;
        console.log(`%c ${next.icon} BiotechHoliday %c ${next.name}: ${isToday ? 'ACTIVE' : next.diff + 'd left'}`, 
            (SRE_H_LOGS[next.style] || SRE_H_LOGS.display) + SRE_H_LOGS.base, "color: #bcbcbc; margin-left: 5px;");

        return { ...next, isToday, msg: isToday ? `${next.icon} <span class="holiday-name ${next.style}">${next.wish}</span>` : `Only ${next.diff} days until ${next.icon} <span class="holiday-name ${next.style}">${next.name}</span>!` };
    }

    function exportHolidayData(format = 'csv') {
        const data = getProcessedHolidays();
        const content = ["Icon,Holiday,Date,DaysLeft", ...data.map(i => `${i.icon},${i.name},${i.date.toISOString().split('T')[0]},${i.diff}`)].join("\n");
        const a = document.createElement("a");
        const url = URL.createObjectURL(new Blob([content], { type: 'text/csv' }));
        a.href = url;
        a.download = `biotech_export_${new Date().getFullYear()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // --- Bootstrap ---
    document.addEventListener("DOMContentLoaded", async function () {
        console.log("%c 🛠️ SRE Bootstrap %c Gold Master V4.3 Initializing...", SRE_H_LOGS.display + SRE_H_LOGS.base, "color: #888;");
        
        try {
            const bannerImg = document.getElementById("Banner");
            if (!bannerImg) throw new Error("DOM Element #Banner missing.");

            const banners = ["banner1.avif", "banner2.avif", "banner3.avif", "banner4.avif"].map(b => `https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/${b}`);
            
            const conn = navigator.connection || { saveData: false };
            if (!conn.saveData) {
                await Promise.all(banners.map(src => new Promise(res => { const img = new Image(); img.onload = img.onerror = res; img.src = src; })));
            }

            let bnrCntr = 0;
            biotechState.bannerInterval = setInterval(() => {
                bannerImg.classList.add("banner-fade-out");
                biotechState.timeouts.push(setTimeout(() => {
                    bnrCntr = (bnrCntr + 1) % banners.length;
                    bannerImg.src = banners[bnrCntr];
                    bannerImg.classList.remove("banner-fade-out");
                }, CONFIG.TRANSITION_MS));
            }, CONFIG.BANNER_ROTATION_MS);

            showHolidayPopup(executeHolidayLifecycle());
            
            console.log("%c 🐂 SYNC BiotechProject: Mastering the beast. Passion and logic synchronized within the labyrinth.", 
                "color: #B5EAD7; font-family: 'Courier New', monospace; background: #1a1a1a; padding: 2px 5px; border: 1px solid #00e676;");

        } catch (err) { console.error("%c ☢️ SRE Critical:", "background: red; color: white;", err); }
    });

    window.addEventListener('beforeunload', () => {
        clearInterval(biotechState.bannerInterval);
        biotechState.abortController.abort();
        biotechState.timeouts.forEach(clearTimeout);
        biotechState.intervals.forEach(clearInterval);
    });

})();


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