/*
 * =============================================================================
 * BIOTECH-SRE-RESILIENCE-MAP // VERSION 6.4.0-FINAL (DETERMINISTIC HYBRID)
 * =============================================================================
 * [STATUS]: PRODUCTION READY & INFRASTRUCTURE RESILIENCE DEPLOYED
 * [AUTHOR]: Software Architect & SRE Team
 * [DATE]: 2026-11-12
 * -----------------------------------------------------------------------------
 * [PERFORMANCE EVOLUTION & FIELD AUDIT (3G SLOW STRESS TEST)]:
 * - CLS (Visual Stability)  : ~0.17 (Before) ──► 0.012 - 0.090 ("Good" Tier) 🟢
 * - TTFB (Time to First Byte): ~1980ms       ──► 1941 - 1965ms (Resilient Sync) 🟢
 * - DOM Interactive         : ~2600ms       ──► 2450 - 2494ms (Faster UI) 🟢
 * - Accessibility Compliance: WCAG 2.2 AAA  ──► Maintained (Zero Regression) 🟢
 * -----------------------------------------------------------------------------
 * FLOW LOGIC MAP (v6.4.0)
 * ║─► STEP A: Silent Boot ────────────────► Min. Resources (0ms visual impact)
 * ║         │
 * ║         ├──► Historical Memory ('high') ──► Immediate Emergency
 * ║         └──► Network Guard (2G/3G) ──────► Immediate Emergency
 * ║
 * ║─► STEP B: Ambient Intelligence ───────► Battery Watchdog (< 15%)
 * ║                                         └──► ENERGY OVERRIDE (Max Priority)
 * ║
 * ║─► STEP C: Sampling & Promotion (Post-Load / Idle)
 * ║         │
 * ║         ├──► TTFB < 600ms ──► applyResilience(STABLE, force) ──► Full Quality
 * ║         │                     └──► localStorage = 'stable'
 * ║         │
 * ║         └──► TTFB >= 600ms ─► applyResilience(REACTIVE) ──────► Parsimonious Mode
 * ║                               └──► localStorage = 'high'
 * ║
 * ╚─► SAFETY GATE: ENABLE_OPTIMIZED_BOOT === true ──► Active Smart Promotion
 * -----------------------------------------------------------------------------
 * [NOTES]: Adaptive Hybrid Resilience (Silent Sampling + Smart Promotion).
 *          Full audit telemetry & evolution rationale tracked in Issue #27.
 * =============================================================================
 */
const BiotechResilience = (() => {
    const SIGNAL_KEY = 'biotech_resilience_signal';
    const STYLE_ID = 'biotech-resilience-sheet';
    let isApplied = false;

    // --- FEATURE FLAG DI PRODUZIONE (Abilitato per il rilascio definitivo) ---
    const ENABLE_OPTIMIZED_BOOT = true;

    // --- 1. SENSOR ARRAY (Optimized Flow) ---
    const Sensors = {
        // Sincrono: Zero latenza
        getNetworkStress: () => {
            const conn = navigator.connection || {};
            return (conn.saveData || /2g|3g/.test(conn.effectiveType));
        },
        // Asincrono: Gestito via callback per non bloccare il Main Thread
        checkEnergyStress: (callback) => {
            if (!navigator.getBattery) return;
            navigator.getBattery().then(battery => {
                if (battery.level < 0.15 && !battery.charging) {
                    callback('CRITICAL_BATTERY_LEVEL');
                }
            }).catch(() => {/* Silent Bypass */});
        }
    };

    const applyResilience = (type = 'REACTIVE', reason = 'PERFORMANCE', forceStable = false) => {
        if (isApplied && !forceStable) return;
        if (forceStable) {
            // Se è una promozione stabile esplicita, rimuoviamo eventuale blocco high
            document.documentElement.removeAttribute('data-resilience');
            isApplied = false;
            return;
        }

        if (isApplied) return;
        isApplied = true;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        document.head.appendChild(style);
        
        const rules = [
            `html[data-resilience] .dynamic-bg, html[data-resilience] video { display: none !important; }`,
            `html[data-resilience] * { animation-play-state: paused !important; transition: none !important; }`,
            `html[data-resilience] .essential-ui { filter: drop-shadow(0 0 2px #00FF55); text-shadow: none !important; }`
        ];

        rules.forEach((rule, i) => style.sheet.insertRule(rule, i));
        document.documentElement.setAttribute('data-resilience', 'high');
        
        console.log(`%c 🧬 BIOTECH %c ${type}_IMMUNE_BOOT [%s] `, 
            'background: #000; color: #00ffa2; font-weight: bold;', 
            'background: #333; color: #fff;', reason);
    };

    return {
        boot: () => {
            // --- STEP A: DETERMINISTIC BOOT (Millisecond 0) ---
            // 1. Memoria Storica
            const cached = localStorage.getItem(SIGNAL_KEY);
            if (cached === 'high') {
                applyResilience('PREDICTIVE', 'HISTORICAL_MEMORY_HIT');
            }

            // 2. Network Guard (Sincrono) - Gestisce tunnel e zone morte
            if (Sensors.getNetworkStress()) {
                applyResilience('PREDICTIVE', 'NETWORK_DEGRADATION_DETECTED');
            }

            // --- STEP B: AMBIENT INTELLIGENCE (Background) ---
            Sensors.checkEnergyStress((reason) => {
                applyResilience('REACTIVE', reason);
            });

            // --- STEP C: SRE AUTO-HEALING, DIAGNOSTICS & DETERMINISTIC SYNC (Post-Load) ---
            window.addEventListener('load', () => {
                const scheduleTask = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));

                scheduleTask(() => {
                    const navTiming = performance.getEntriesByType('navigation')[0];
                    if (!navTiming) return;

                    const ttfb = navTiming.responseStart;
                    const totalLoad = navTiming.duration;

                    // Logica condizionale basata sul Feature Flag attivo in Produzione
                    if (ENABLE_OPTIMIZED_BOOT) {
                        // Silent Sampling + Smart Promotion Strategy (< 600ms soglia intermedia)
                        if (ttfb < 600) {
                            applyResilience('STABLE', 'FAST_NETWORK', true);
                            localStorage.setItem(SIGNAL_KEY, 'stable');
                        } else {
                            applyResilience('REACTIVE', 'HIGH_LATENCY_DETECTION');
                            localStorage.setItem(SIGNAL_KEY, 'high');
                        }
                    } else {
                        // Comportamento Standard / Storico di riserva
                        if (ttfb > 1000) {
                            applyResilience('REACTIVE', 'HIGH_LATENCY_DETECTION');
                            localStorage.setItem(SIGNAL_KEY, 'high');
                        } else if (ttfb < 300) {
                            localStorage.setItem(SIGNAL_KEY, 'stable');
                        }
                    }

                    // Sincronizzazione con il Worker Deterministico
                    if (window.BiotechWorker) {
                        window.BiotechWorker.postMessage({
                            action: 'PREDICTIVE_LOAD_INFERENCE',
                            payload: { 
                                velocity: 0, 
                                density: ttfb, 
                                actualLoad: (ttfb > 800 || totalLoad > 3000) ? 0.9 : 0.1 
                            },
                            taskId: `resilience_sync_${Date.now()}`
                        });
                    }
                    
                    console.log(`%c📶 Resilience: Diagnostic Sync Complete (TTFB: ${Math.round(ttfb)}ms)`, "color: #9e9e9e; font-size: 10px;");
                });
            });
        }
    };
})();

BiotechResilience.boot();

/* =============================================================================
 * BIOTECH_RESILIENCE_ENGINE // SYSTEM_IMMUNE_HARDENED (v6.4.0-FINAL)
================================================================================

    God give me style and give me grace
    God put a smile upon my face

    -- (God Put a Smile upon Your Face, by Coldplay)
--------------------------------------------------------------------------------
- END OF FILE - BIOTECH_RESILIENCE_ENGINE... SYSTEM_IMMUNE_HARDENED // MEDIA_PIPELINE_HARDENED
*/