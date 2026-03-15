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
 * BIOTECH CORE SYSTEM - V4.5 SOBRIA (ZERO-FAULT)
 * Bilancio perfetto tra leggibilità e affidabilità SRE.
 */
(() => {
    "use strict";

    // --- 1. CONFIGURAZIONE & LOG STYLE ---
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

    // Stato per la gestione delle risorse (Cleanup)
    const STATE = {
        bannerInterval: null,
        popupInterval: null,
        popupTTL: null
    };

    // --- 2. BOOTSTRAP & DOM VALIDATION ---
    document.addEventListener("DOMContentLoaded", async () => {
        console.log("%c 🛠️ SRE Bootstrap %c System Init...", SRE_H_LOGS.display + SRE_H_LOGS.base, "color: #888;");

        const BANNER_ID = "Banner";
        const idPattern = /^[a-zA-Z0-9_-]+$/;

        try {
            // Validazione ID Pattern (Security check)
            if (!idPattern.test(BANNER_ID)) throw new Error("Invalid DOM ID Pattern detected.");
            
            const bannerImg = document.getElementById(BANNER_ID);
            if (!bannerImg) throw new Error("Element #Banner missing. Aborting SRE Pipeline.");

            // Resource Budgeting & Preload (Zero Leak)
            const banners = [
                "https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner1.avif",
                "https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner2.avif",
                "https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner3.avif",
                "https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner4.avif"
            ];

            const conn = navigator.connection || { saveData: false, effectiveType: '4g' };
            if (!conn.saveData && !/2g/.test(conn.effectiveType)) {
                banners.forEach(url => {
                    let img = new Image();
                    img.onload = () => { img.src = ""; img = null; }; // Cleanup immediato
                    img.src = url;
                });
            }

            // Banner Rotation Logic (Race-Condition Protected)
            let bnrCntr = 0;
            STATE.bannerInterval = setInterval(() => {
                const el = document.getElementById(BANNER_ID);
                if (!el) { clearInterval(STATE.bannerInterval); return; } // Cleanup se sparisce dal DOM

                el.classList.add("banner-fade-out");
                setTimeout(() => {
                    bnrCntr = (bnrCntr + 1) % banners.length;
                    el.src = banners[bnrCntr];
                    el.classList.remove("banner-fade-out");
                }, 500);
            }, 3500);

            // Avvio Sequenziale
            window.addEventListener("load", () => {
                const holiday = getNextHoliday();
                showHolidayPopup(holiday);
                triggerHumanSync();
            }, { once: true });

        } catch (err) {
            console.error("%c 🚨 SRE Pipeline Reject:", "color: #ff5252; font-weight: bold;", err.message);
        }
    });

    // --- 3. UI ENGINE (Null-Safety & State Consistency) ---
    function showHolidayPopup(holiday) {
        const popup = document.createElement('div');
        popup.className = `holiday-popup ${holiday.style}`;
        popup.innerHTML = `
            <span class="popup-text">${holiday.msg}</span>
            <div class="popup-controls">
                <span class="popup-export" title="Export CSV Data">💾</span>
                <span class="popup-close" title="Chiudi">&times;</span>
            </div>
            <div class="popup-progress-container"><div class="popup-progress-bar"></div></div>
        `;
        document.body.appendChild(popup);

        const closePopup = () => {
            clearTimeout(STATE.popupTTL);
            clearInterval(STATE.popupInterval);
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 600);
        };

        STATE.popupTTL = setTimeout(closePopup, 6000);

        // Null-Check for UI elements
        const exportBtn = popup.querySelector('.popup-export');
        const closeBtn = popup.querySelector('.popup-close');
        const textEl = popup.querySelector('.popup-text');

        exportBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            exportHolidayData('csv');
            clearTimeout(STATE.popupTTL);
            clearInterval(STATE.popupInterval);
            popup.querySelector('.popup-progress-bar')?.remove();
            console.log("%c 🟢 SRE: Manual override. Timer suspended.", "color: #00c853;");
        });

        closeBtn?.addEventListener('click', closePopup);

        if (holiday.isToday && textEl) {
            STATE.popupInterval = setInterval(() => {
                const now = new Date();
                const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                const diff = new Date(endOfDay - now);
                const timeStr = diff.toISOString().substr(11, 8);
                textEl.innerHTML = `${holiday.icon} ${holiday.wish} <br><small style="opacity:0.8;">Ends in: ${timeStr}</small>`;
            }, 1000);
        }

        setTimeout(() => popup.classList.add('show'), 100);
    }

    // --- 4. EXPORT ENGINE (Data Integrity & Cleanup) ---
    function exportHolidayData(format = 'json') {
    const data = getProcessedHolidays();
    const exportTime = new Date().toISOString();

    if (format === 'csv') {
        // Intestazioni pulite e minimali
        const headers = ["Icon", "Holiday", "Date", "Status"];
        const rows = data.map(h => [
            h.icon,
            h.name,
            h.date.toISOString().split('T'), // YYYY-MM-DD
            "SRE_VERIFIED"
        ]);
        const csvContent = "\ufeff" + [headers, ...rows].map(e => e.join(",")).join("\n");
        downloadFile(csvContent, `biotech_export_${new Date().getFullYear()}.csv`, 'text/csv;charset=utf-8');
    } else {
        const payload = {
            system: "Biotech-Core",
            exportedAt: exportTime,
            holidays: data.map(h => ({
                name: h.name,
                icon: h.icon,
                date: h.date.toISOString().split('T')
            }))
        };
        downloadFile(JSON.stringify(payload, null, 2), 'biotech_holidays.json', 'application/json;charset=utf-8');
    }
}

    function downloadFile(content, fileName, contentType) {
        const file = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        
        a.click();
        
        // Resource Cleanup
        setTimeout(() => {
            URL.revokeObjectURL(url);
            a.remove();
        }, 150);
    }

    // --- 5. LOGICA DI CALCOLO (Centralizzata) ---
    const HolidayCalcs = {
        easter: (y) => {
            const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
            const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
            const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
            return { month: month - 1, day: day };
        },
        thanksgiving: (y) => {
            const first = new Date(y, 10, 1).getDay();
            return { month: 10, day: 22 + (4 - first + 7) % 7 };
        },
        fixed: (m, d) => () => ({ month: m, day: d }),
        relative: (calc, off) => (y) => {
            const b = calc(y);
            const d = new Date(y, b.month, b.day + off);
            return { month: d.getMonth(), day: d.getDate() };
        }
    };

    const HOLIDAY_SCHEMA = [
        { name: "St. Patrick's Day", style: "stPatrick", wish: "Happy St. Paddy's!", icon: "☘️", calc: HolidayCalcs.fixed(2, 17) },
        { name: "World Backup Day", style: "backupDay", wish: "Resilience starts with a backup!", icon: "💾", calc: HolidayCalcs.fixed(2, 31) },
        { name: "National DNA Day", style: "dnaDay", wish: "Celebrating the code of life!", icon: "🧬", calc: HolidayCalcs.fixed(3, 25) },
        { name: "Labor Day", style: "mayday", wish: "Happy Labor Day!", icon: "🛠️", calc: HolidayCalcs.fixed(4, 1) },
        { name: "Easter", style: "easter", wish: "Happy Easter!", icon: "🐣", calc: HolidayCalcs.easter },
        { name: "Easter Monday", style: "eastermonday", wish: "Happy Easter Monday!", icon: "🧺", calc: HolidayCalcs.relative(HolidayCalcs.easter, 1) },
        { name: "4th of July", style: "july4", wish: "Happy Independence Day!", icon: "🎆", calc: HolidayCalcs.fixed(6, 4) },
        { name: "Halloween", style: "halloween", wish: "Spooky Halloween!", icon: "🎃", calc: HolidayCalcs.fixed(9, 31) },
        { name: "Thanksgiving", style: "thanksgiving", wish: "Happy Thanksgiving!", icon: "🦃", calc: HolidayCalcs.thanksgiving },
        { name: "Christmas", style: "natale", wish: "Merry Christmas!", icon: "🎄", calc: HolidayCalcs.fixed(11, 25)}
    ];

    const getProcessedHolidays = () => {
        const today = new Date();
        today.setHours(0,0,0,0);
        const y = today.getFullYear();

        return HOLIDAY_SCHEMA.map(h => {
            const res = h.calc(y);
            let d = new Date(y, res.month, res.day);
            if (d < today) {
                const nextRes = h.calc(y + 1);
                d = new Date(y + 1, nextRes.month, nextRes.day);
            }
            return { ...h, date: d, diff: Math.ceil((d - today) / 86400000) };
        }).sort((a, b) => a.diff - b.diff);
    };

    function getNextHoliday() {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        const isDay = now.getHours() >= 6 && now.getHours() < 18;
        
        console.log(`%c ${isDay ? "☀️ Daylight" : "🌙 Nightly"} %c | ${timeStr} %c Syncing...`, SRE_H_LOGS.astro + SRE_H_LOGS.base, "color:#888; font-family:monospace;", "color:#555; font-style:italic;");

        const upcoming = getProcessedHolidays();
        const next = upcoming[0];
        const isToday = next.diff === 0;

        console.groupCollapsed('%c📅 Upcoming Holidays Table', SRE_H_LOGS.display + SRE_H_LOGS.base);
        console.table(upcoming.map(h => ({
            Icon: h.icon, Holiday: h.name, Date: h.date.toLocaleDateString('it-IT'), DaysLeft: h.diff === 0 ? '🎉 TODAY' : h.diff
        })));
        console.groupEnd();

        console.log(`%c ${next.icon} BiotechHoliday %c ${next.name}: ${isToday ? 'ACTIVE' : next.diff + 'd left'}`, (SRE_H_LOGS[next.style] || SRE_H_LOGS.display) + SRE_H_LOGS.base, "color: #bcbcbc;");

        return {
            ...next,
            isToday,
            msg: isToday 
                ? `${next.icon} <span class="holiday-name ${next.style}">${next.wish}</span>`
                : `Only ${next.diff} days until ${next.icon} <span class="holiday-name ${next.style}">${next.name}</span>!`
        };
    }

    function triggerHumanSync() {
        console.log("%c 🐂 SYNC BiotechProject: Logic synchronized within the labyrinth.", "color: #B5EAD7; background: #1a1a1a; padding: 2px 5px; border-radius: 3px; border: 1px solid rgba(0, 230, 118, 0.3);");
    }

    // Export globale per console
    window.BiotechSRE = { exportHolidayData };

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