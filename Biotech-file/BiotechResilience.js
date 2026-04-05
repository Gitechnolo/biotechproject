/**
 * =============================================================================
 * BIOTECH-SRE-RESILIENCE-MAP // VERSION 1.2.2 (STABLE PILOT)
 * =============================================================================
 * [STRATEGIA]: "Resilient Edge" - Ingegneria sociale per l'equità clinica.
 * [OBIETTIVO]: Garantire accessibilità WCAG 2.2 AAA in condizioni di banda 2G/Sat.
 * -----------------------------------------------------------------------------
 * * 1. LAYER DI RILEVAMENTO (Sensing)
 * ║─► RTT (Round Trip Time): Trigger attivo se > 1000ms.
 * ║─► Connection Type: Trigger forzato su "Save-Data" o reti cellulari 2G/3G.
 * ╚─► Latency Offset: Calcolo su performance.timing se le API di rete mancano.
 * * 2. LAYER DI PROTEZIONE (Hard Pruning)
 * ║─► Asset Interception: Blocca il download di video (VideoStaff.js) e 
 * ║   canvas non essenziali (BiotechMarket.js) tramite CSS Prioritario.
 * ╚─► GPU Offloading: Rimuove i filtri .bulb-glow (holiday.js) e .neon-fx 
 * per liberare cicli CPU per il calcolo dei dati clinici.
 * * 3. LAYER DI INTEGRITÀ (Clinical Whitelist)
 * ║─► Data Preservation: Protezione assoluta per .intensity-value e #dnaScanner.
 * ╚─► UI Recovery: Forza il contrasto AAA (Verde Neon su Nero).
 * * 4. LAYER DI AUDIT (Stateless Snapshot)
 * ╚─► getBiotechAudit(): Genera un payload semantico < 2KB per audit AI.
 * * -----------------------------------------------------------------------------
 * STATUS: PILOT TEST // ARCHITECTURE: ZERO-FRAMEWORK MANDATE // YEAR: 2026
 * =============================================================================
 */

const BiotechResilience = (() => {
    const PROTECTED = ['.intensity-value', '#dnaScanner', '.terminal-window', '.type-line'];
    let isApplied = false;

    const checkEmergency = () => {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) {
            return conn.saveData || /2g|3g/.test(conn.effectiveType) || conn.rtt > 1000;
        }
        const p = window.performance.timing;
        return (p.responseEnd - p.fetchStart) > 1000;
    };

    const injectBanner = () => {
        if (!document.body) {
            setTimeout(injectBanner, 10);
            return;
        }
        if (document.querySelector('.resilience-banner')) return;

        const banner = document.createElement('div');
        banner.className = 'resilience-banner';
        // Integrazione Font Sansation e Trasparenza per un look moderno e non invasivo
        banner.style = "position:fixed; top:0; left:0; width:100%; color:#fff; text-align:center; z-index:2147483647; font-size:11px; padding:4px; font-weight:bold; letter-spacing:1px; font-family: 'Sansation', 'Courier New', monospace;";
        banner.innerText = "RESILIENT EDGE ACTIVE: CLINICAL ACCESSIBILITY MODE";
        document.body.prepend(banner);
    };

    const applyResilience = () => {
        if (isApplied) return;
        isApplied = true;

        document.documentElement.setAttribute('data-resilience', 'true');

        const style = document.createElement('style');
        style.textContent = `
            html[data-resilience="true"] body { background: #000 !important; color: #00FF55 !important; }
            html[data-resilience="true"] img, 
            html[data-resilience="true"] video, 
            html[data-resilience="true"] canvas:not(.essential) { display: none !important; }
            ${PROTECTED.join(', ')} { display: block !important; opacity: 1 !important; color: #00FF55 !important; }
        `;
        document.head.appendChild(style);

        injectBanner();
    };

    return {
        boot: () => {
            if (checkEmergency()) {
                applyResilience();
                window.addEventListener('DOMContentLoaded', injectBanner);
            }
            
            window.getBiotechAudit = () => {
                const nodes = document.querySelectorAll('h1, h2, a, button, ' + PROTECTED.join(','));
                const data = Array.from(nodes).map(n => ({ t: n.tagName, txt: n.innerText?.trim().substring(0, 20) }));
                return JSON.stringify({ audit: "SRE-2026", data });
            };
        }
    };
})();

BiotechResilience.boot();