/**
 * BIOTECH PROJECT | SRE GUARDIAN SYSTEM (Performance & Evolution Watchdog) [v7.0]
 * -------------------------------------------------------------------------
 * ARCHITECTURE: Passive Multi-Heuristic Observer & Evolution Sentinel
 * MONITORING: Long-Tasks, Mod03 Latency & Remote Evolution Manifests
 * STRATEGY: Hybrid (Stealth Background & ADR-011 Dashboard Integration)
 * -------------------------------------------------------------------------
BIOTECHPROJECT | SERVICE STRUCTURE: GUARDIAN SYSTEM
===================================================

 [INTERNAL & EXTERNAL SENSORS]
        ║
        ╠══ PerformanceObserver (longtask) ══╗
        ║                                    ║
        ╠══ setInterval (mod03-exec-marks) ══╬══[ EVALUATION ENGINE ]
        ║                                    ║          ║
        ╚══ Remote Evolution Watchdog ═══════╝          ║
             (biotech-evolution.json)                   ║
                                                        ║
             ╔══════════════════════════════════════════╝
             ║
             ╠══ THRESHOLD CHECK (ADR-010: 10FPS / 150ms)
             ║
             ╠══ VERSION COMPARISON (Evolution Discovery)
             ║
             ╠══ TELEMETRY FEED: SRE Interactive Dashboard [ADR-011]
             ║
             ╠══ BROADCAST A: 'biotech:resilience-needed' (Stress Signal)
             ║
             ╚══ BROADCAST B: 'biotech:evolution-available' (Logic Signal)

-------------------------------------------------------------------------
STATUS: v7.0_EVOLUTION_WATCHDOG_ACTIVE // STEALTH_MONITORING_ENABLED
*/

const BiotechGuardian = (() => {
    const CONFIG = {
        FPS_LIMIT: 10,           // ADR-010 Threshold (100ms per task)
        LATENCY_MAX: 150,        // ms for Module 03 execution
        COOLDOWN: 3000,          // Prevent alert flooding
        EVO_CHECK_INTERVAL: 60000, // Check for biotech-evolution.json every 60s
        EVO_ENDPOINT: 'biotech-evolution.json'
    };

    let lastAlertTime = 0;
    let currentVersion = '6.2.0'; // Base version for comparison

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

        // Signal dispatch to Patch Engine & Dashboard
        window.dispatchEvent(new CustomEvent('biotech:resilience-needed', { detail: report }));
        
        console.warn(`%c🛡️ Guardian: Performance Stress Detected (${type}: ${Math.round(duration)}ms)`, 
            'color: #ff9800; font-weight: bold;');
    };

    /**
     * EVOLUTION WATCHDOG: Monitors remote manifest for logic upgrades
     */
    const checkForEvolution = async () => {
        try {
            // Cache-busting to ensure we get the latest manifest
            const response = await fetch(`${CONFIG.EVO_ENDPOINT}?t=${Date.now()}`);
            if (!response.ok) return;

            const manifest = await response.json();

            if (manifest.version !== currentVersion) {
                console.log(`%c🧬 Evolution Signal: New Logic Detected (${manifest.version})`, 
                    'color: #00ffa2; font-weight: bold;');
                
                // Broadcast evolution signal for PatchEngine and UI
                window.dispatchEvent(new CustomEvent('biotech:evolution-available', {
                    detail: {
                        version: manifest.version,
                        type: manifest.patchType || 'System Optimization',
                        description: manifest.description,
                        payloadUrl: manifest.payloadUrl
                    }
                }));
                
                // Update local version reference to prevent redundant signaling
                currentVersion = manifest.version;
            }
        } catch (err) {
            // Silent failure for evolution checks to preserve stealth mode
        }
    };

    const initObserver = () => {
        // 1. LONG TASKS MONITORING (FPS Integrity)
        if (window.PerformanceObserver) {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (entry.duration > (1000 / CONFIG.FPS_LIMIT)) {
                            reportDegradation('LONG_TASK', entry.duration);
                        }
                    });
                });
                observer.observe({ type: 'longtask', buffered: true });
            } catch (e) {
                console.log("%c🛡️ Guardian: Fallback mode active", "color: #888;");
            }
        }

        // 2. MODULE 03 LATENCY MONITORING
        setInterval(() => {
            const marks = performance.getEntriesByName('biotech-mod03-exec');
            if (marks.length > 0) {
                const lastMark = marks[marks.length - 1];
                if (lastMark.duration > CONFIG.LATENCY_MAX) {
                    reportDegradation('MOD03_LATENCY', lastMark.duration);
                }
                if (marks.length > 10) performance.clearMeasures('biotech-mod03-exec');
            }
        }, 5000);

        // 3. START EVOLUTION WATCHDOG
        checkForEvolution(); // Initial check
        setInterval(checkForEvolution, CONFIG.EVO_CHECK_INTERVAL);
    };

    return {
        init: () => {
            setTimeout(() => {
                initObserver();
                console.log("%c🛡️ Guardian: v7.0 Evolution Watchdog Active", "color: #4CAF50; font-weight: bold;");
            }, 1000);
        }
    };
})();

// Auto-boot
BiotechGuardian.init();