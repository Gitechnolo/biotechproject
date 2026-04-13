/**
 * BIOTECH PROJECT | GUARDIAN SYSTEM (v1.0.0)
 * -------------------------------------------------------------------------
 * ROLE: Passive Performance Watchdog
 * TARGET: FPS Integrity & Module 03 Latency
 * -------------------------------------------------------------------------
 */

const BiotechGuardian = (() => {
    const CONFIG = {
        SAMPLE_RATE: 1000, // 1 secondo
        FPS_LIMIT: 10,     // Soglia ADR-010
        LATENCY_MAX: 150   // ms
    };

    const checkVitalSigns = () => {
        const now = performance.now();
        const report = { status: 'HEALTHY', metrics: {}, timestamp: now };

        // 1. Monitoraggio Frame Rate (via Long Tasks)
        const longTasks = performance.getEntriesByType('longtask')
            .filter(t => t.startTime > (now - 2000));
        
        if (longTasks.some(t => t.duration > (1000 / CONFIG.FPS_LIMIT))) {
            report.status = 'DEGRADED';
        }

        // 2. Verifica Latenza Specifica (Modulo 03)
        const lastPerfMark = performance.getEntriesByName('biotech-mod03-exec').pop();
        if (lastPerfMark && lastPerfMark.duration > CONFIG.LATENCY_MAX) {
            report.status = 'DEGRADED';
        }

        // Se degradato, invia segnale al Patch Engine
        if (report.status === 'DEGRADED') {
            window.dispatchEvent(new CustomEvent('biotech:resilience-needed', { detail: report }));
        }
    };

    return {
        init: () => {
            console.log("🛡️ Guardian: Active");
            setInterval(() => {
                if (window.requestIdleCallback) {
                    window.requestIdleCallback(checkVitalSigns);
                } else {
                    checkVitalSigns();
                }
            }, CONFIG.SAMPLE_RATE);
        }
    };
})();

// Auto-boot se caricato asincronamente
BiotechGuardian.init();