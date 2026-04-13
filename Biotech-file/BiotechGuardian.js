/**
 * BIOTECH PROJECT | SRE GUARDIAN SYSTEM (Performance Watchdog)
 * -------------------------------------------------------------------------
 * ARCHITECTURE: Passive Multi-Heuristic Observer
 * MONITORING: Long-Tasks (FPS) & Module 03 Latency Execution
 * STRATEGY: Stealth Mode (Zero-Interference via PerformanceObserver)
 * -------------------------------------------------------------------------
BIOTECHPROJECT | SERVICE STRUCTURE: GUARDIAN SYSTEM
===================================================

 [INTERNAL SENSORS]
        ║
        ╠══ PerformanceObserver (longtask) ══╗
        ║                                    ║
        ╠══ setInterval (mod03-exec-marks) ══╬══[ EVALUATION ENGINE ]
        ║                                    ║          ║
        ╚══ Performance Timeline Analysis ═══╝          ║
                                                        ║
             ╔══════════════════════════════════════════╝
             ║
             ╠══ THRESHOLD CHECK (ADR-010: 10FPS / 150ms)
             ║
             ╠══ DEBOUNCE LOGIC (3000ms Cooldown)
             ║
             ╚══ BROADCAST: 'biotech:resilience-needed' (CustomEvent)

-------------------------------------------------------------------------
STATUS: STEALTH_WATCHDOG_ACTIVE // ZERO_DEPRECATION_SYNTAX
*/

const BiotechGuardian = (() => {
    const CONFIG = {
        FPS_LIMIT: 10,     // Soglia ADR-010 (100ms per task)
        LATENCY_MAX: 150,  // ms per il Modulo 03
        COOLDOWN: 3000     // Evita notifiche multiple ravvicinate
    };

    let lastAlertTime = 0;

    const reportDegradation = (type, duration) => {
        const now = performance.now();
        if (now - lastAlertTime < CONFIG.COOLDOWN) return;

        lastAlertTime = now;
        const report = { 
            status: 'DEGRADED', 
            type: type,
            value: Math.round(duration),
            timestamp: now 
        };

        // Invia segnale al Patch Engine
        window.dispatchEvent(new CustomEvent('biotech:resilience-needed', { detail: report }));
        
        // Log discreto in stile SRE
        console.warn(`%c🛡️ Guardian: Performance Stress Detected (${type}: ${Math.round(duration)}ms)`, 
            'color: #ff9800; font-weight: bold;');
    };

    const initObserver = () => {
        // 1. Monitoraggio LONG TASKS (FPS Drop)
        // Usiamo PerformanceObserver per evitare il log "Deprecated API"
        if (window.PerformanceObserver) {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (entry.duration > (1000 / CONFIG.FPS_LIMIT)) {
                            reportDegradation('LONG_TASK', entry.duration);
                        }
                    });
                });
                // Buffered: true permette di recuperare anche task avvenuti appena prima dell'init
                observer.observe({ type: 'longtask', buffered: true });
            } catch (e) {
                console.log("%c🛡️ Guardian: LongTask Observer not supported, switching to fallback", "color: #888;");
            }
        }

        // 2. Monitoraggio Latenza Modulo 03 (Esecuzione Specifica)
        // Verifichiamo periodicamente ma in modo leggero tramite il Performance Timeline
        setInterval(() => {
            const marks = performance.getEntriesByName('biotech-mod03-exec');
            if (marks.length > 0) {
                const lastMark = marks[marks.length - 1];
                if (lastMark.duration > CONFIG.LATENCY_MAX) {
                    reportDegradation('MOD03_LATENCY', lastMark.duration);
                }
                // Pulizia periodica per non accumulare entries in memoria
                if (marks.length > 10) performance.clearMeasures('biotech-mod03-exec');
            }
        }, 5000); // Check ogni 5 secondi, molto leggero
    };

    return {
        init: () => {
            // Piccolo ritardo per assicurarsi che il caricamento iniziale sia terminato
            setTimeout(() => {
                initObserver();
                console.log("%c🛡️ Guardian: Stealth Monitoring Active", "color: #4CAF50; font-weight: bold;");
            }, 1000);
        }
    };
})();

// Auto-boot
BiotechGuardian.init();