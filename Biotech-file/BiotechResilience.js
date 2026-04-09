/**
 * =============================================================================
 * BIOTECH-SRE-RESILIENCE-MAP // VERSION 1.4.1 (SECURE PASSIVE AI)
 * =============================================================================
 * [STRATEGY]: "Deterministic Edge AI" - Passive Monitoring & Fuzzy Logic.
 * [OBJECTIVE]: Sub-100ms Rendering under Environmental Stress (Latency/CPU).
 * -----------------------------------------------------------------------------
 * * 1. DIAGNOSTIC LAYER (Passive AI Observation)
 * ║─► Zero-Intrusion: No Connection API calls (Privacy-by-Design).
 * ║─► Performance Timing: TTFB & DOM Processing latency analysis.
 * ╚─► Fuzzy Logic: Scoring engine (0-100) to determine environmental stress.
 *
 * * 2. ARCHITECTURAL STATES (Multi-Level Pruning)
 * ║─► STABLE (Score < 40): Standard High-Fidelity Rendering.
 * ║─► CLINICAL (Score 40-70): Prunes Video/Canvas; stabilizes GPU DNA Helix.
 * ╚─► HIGH RESILIENCE (Score > 70): Hard Pruning (Images/GFX) for Clinical Data.
 *
 * * 3. PERFORMANCE & SECURITY MANDATE
 * ║─► Atomic CSS Injection: Uses CSSStyleSheet.insertRule (No textContent/XSS).
 * ║─► Zero-Framework: Pure Vanilla JS Core (< 2KB footprint).
 * ╚─► Clinical Integrity: WCAG 2.2 AAA Contrast enforcement on data nodes.
 *
 * * 4. COMPLIANCE & ETHICS
 * ╚─► Stealth Ops: Zero Fingerprinting / Zero Cloud Calls / Fully Stateless.
 * -----------------------------------------------------------------------------
 * STATUS: DEPLOYED // ARCHITECTURE: SECURE PASSIVE EDGE AI // YEAR: 2026
 * =============================================================================
 */

const BiotechResilience = (() => {
    const PROTECTED = ['.intensity-value', '#dnaScanner', '.terminal-window', '.type-line'];
    let isApplied = false;

    const BiotechEdgeAI = (() => {
        const p = window.performance.timing;
        const getMetrics = () => ({
            ttfb: p.responseStart - p.requestStart,
            dom: p.domInteractive - p.domLoading
        });

        return {
            evaluate: () => {
                const { ttfb, dom } = getMetrics();
                let score = 0;
                
                if (ttfb > 500) score += 40;
                if (ttfb > 1000) score += 30;
                if (dom > 300) score += 30;

                const html = document.documentElement;
                if (score >= 70) html.setAttribute('data-resilience', 'high');
                else if (score >= 40) html.setAttribute('data-resilience', 'clinical');
                else html.setAttribute('data-resilience', 'stable');

                return score >= 40; 
            }
        };
    })();

    const injectBanner = () => {
        if (!document.body || document.querySelector('.resilience-banner')) return;
        const state = document.documentElement.getAttribute('data-resilience').toUpperCase();
        const banner = document.createElement('div');
        banner.className = 'resilience-banner';
        // Banner minimale non invasivo, font alto contrasto per stato resilienza attivo.
        banner.style = "position:fixed; top:0; left:0; width:100%; color:#00FF55; text-align:center; z-index:2147483647; font-size:10px; padding:3px; font-weight:bold; letter-spacing:1px; font-family: 'Sansation', monospace; pointer-events:none;";
        banner.innerText = `RESILIENT EDGE ACTIVE: ${state} MODE`;
        document.body.prepend(banner);
    };

    const applyResilience = () => {
        if (isApplied) return;
        isApplied = true;

        const style = document.createElement('style');
        document.head.appendChild(style);
        const sheet = style.sheet;

        const rules = [
            `html[data-resilience] body { background-image: none !important; background-color: #000 !important; }`,
            // High: sparisce tutto. Clinical: spariscono solo i video.
            `html[data-resilience="high"] img { display: none !important; }`,
            `html[data-resilience] video, html[data-resilience] canvas:not(.essential) { display: none !important; }`,
            
            `html[data-resilience] .dna-container-8, html[data-resilience] .dna-helix-8 { 
                animation: none !important; 
                transform: rotateZ(-20deg) rotateX(45deg) scale(0.7) !important; 
                opacity: 0.3 !important; 
                transition: none !important; 
                box-shadow: none !important;
            }`,

            `${PROTECTED.join(', ')} { opacity: 1 !important; color: #00FF55 !important; font-weight: bold !important; text-shadow: 0 0 5px #00FF5566 !important; }`
        ];

        rules.forEach((rule, index) => {
            try { sheet.insertRule(rule, index); } 
            catch (e) { console.warn("SRE-Security: Rule bypass", e); }
        });
        
        const currentState = document.documentElement.getAttribute('data-resilience').toUpperCase();
        console.log(`%c 🧬 BIOTECH RESILIENCE %c ${currentState} `, 
            "background: #00FF55; color: #000; font-weight: bold; padding: 2px 5px; border-radius: 3px;", 
            "background: #ff0055; color: #fff; font-weight: bold; padding: 2px 5px; border-radius: 3px;");
    };

    return {
        boot: () => {
            if (BiotechEdgeAI.evaluate()) {
                applyResilience();
                if (document.readyState === 'loading') {
                    window.addEventListener('DOMContentLoaded', injectBanner);
                } else {
                    injectBanner();
                }
            }
        }
    };
})();

BiotechResilience.boot();

/* ================================================================================
      BIOTECHPROJECT - SRE PASSIVE EDGE AI & RESILIENCE SIGN-OFF
================================================================================
  Status:           RESILIENCE_MODE_ACTIVE (ADR-009 / v1.4.1)
  AI Determinism:   PASSIVE_FUZZY_INFERENCE [OK]
  Pruning Layer:    SECURE_ATOMIC_INTERCEPTION [OK]
  Privacy Ethics:   ZERO_FINGERPRINTING_COMPLIANT [OK]
  Timestamp:        2026-04-09 18:30:00 UTC
--------------------------------------------------------------------------------
   "Now they live like dolphins"
   
   -- (James - Getting Away With It (All Messed Up) // Resilience Theme)
--------------------------------------------------------------------------------
* END OF FILE - BIOTECH_RESILIENCE_ENGINE... SYSTEM_HARDENED_AND_READY
*/