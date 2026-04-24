/**
 * BIOTECH PROJECT | SRE GUARDIAN SYSTEM (Intelligence Watchdog) [v6.4.0]
 * -------------------------------------------------------------------------
 * ARCHITECTURE: Active Contextual Observer & AI Telemetry Provider
 * MONITORING: Long-Tasks (TBT 106ms) | Ambient Sensing | Battery & Network
 * STRATEGY: Zero-Knowledge Intelligence Support (ADR-011-PRO Compliance)
 * -------------------------------------------------------------------------
BIOTECHPROJECT | SERVICE STRUCTURE: GUARDIAN v6.4.0
===================================================

 [ENVIRONMENTAL SENSORS]
        ║
        ╠══ Battery API (Energy Guard) ══════╗
        ║                                    ║
        ╠══ Network API (Bandwidth Guard) ═══╬══[ CONTEXT AGGREGATOR ]
        ║                                    ║          ║
        ╚══ Interaction (Velocity/Density) ══╝          ║
                                                        ║
 [PERFORMANCE SENSORS]                                  ║
        ║                                               ║
        ╠══ PerformanceObserver (TBT: 106ms) ═══════════╣
        ║                                               ║
        ╚══ Stability Check (isSystemStable) ═══════════╝
                                                        ║
             ╔══════════════════════════════════════════╝
             ║
             ╠══ AI BACK-OFF SIGNAL (Priority: Critical)
             ║
             ╠══ NEURAL SYNC (Context-Aware Training Matrix) [v6.4.0]
             ║
             ╚══ BROADCAST: 'biotech:ai-backoff' & 'resilience-needed'

-------------------------------------------------------------------------
* PERFORMANCE BENCHMARK (INTELLIGENCE EDITION)
* -------------------------------------------------------------------------
* ⚡ Target TBT: 106ms (Warm Stable) | Speed Index: 1
* ⚡ AI Readiness: On-Demand activation logic (Zero Cold Start impact)
* ⚡ Context Sync: 2000ms Contextual Heartbeat (Neural Core Link)
-------------------------------------------------------------------------
STATUS: INTELLIGENCE_READY // ZERO_KNOWLEDGE_ENABLED // 2026
*/

const BiotechGuardian = (() => {
    const CONFIG = {
        LONG_TASK_THRESHOLD: 106, // Allineato al nuovo target TBT v6.4.0
        SAMPLE_RATE: 2000,
        LATENCY_MAX: 150
    };

    let interactionBuffer = { velocity: 0, density: 0 };
    let aiActive = false;

    // Cattura lo stato ambientale per l'AI
    const getEnvironmentContext = async () => {
        const context = {
            batt: 1,
            net: 'unknown'
        };

        if ('getBattery' in navigator) {
            const battery = await navigator.getBattery();
            context.batt = battery.level;
        }
        
        if ('connection' in navigator) {
            context.net = navigator.connection.effectiveType;
        }

        return context;
    };

    const reportDegradation = (type, value) => {
        const report = { type, value, timestamp: Date.now() };
        
        // Se l'AI sta lavorando e il sistema soffre, abbassiamo la priorità
        if (value > CONFIG.LONG_TASK_THRESHOLD) {
            window.dispatchEvent(new CustomEvent('biotech:ai-backoff', { detail: report }));
        }

        window.dispatchEvent(new CustomEvent('biotech:resilience-needed', { detail: report }));
    };

    const initObserver = () => {
        // 1. MONITORAGGIO TBT & LONG TASKS (v6.4.0 optimized)
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.duration > CONFIG.LONG_TASK_THRESHOLD) {
                    reportDegradation('LONG_TASK_DETECTED', entry.duration);
                }
            });
        });
        observer.observe({ entryTypes: ['longtask'] });

        // 2. AMBIENT SENSING PER NEURAL SYNC
        window.addEventListener('scroll', () => interactionBuffer.velocity++, { passive: true });
        window.addEventListener('mousemove', () => interactionBuffer.density++, { passive: true });

        setInterval(async () => {
            if (interactionBuffer.velocity > 0 || interactionBuffer.density > 0) {
                const env = await getEnvironmentContext();
                
                if (window.BiotechWorker) {
                    window.BiotechWorker.postMessage({
                        action: 'PREDICTIVE_LOAD_INFERENCE',
                        payload: { 
                            velocity: interactionBuffer.velocity, 
                            density: interactionBuffer.density,
                            env: env // Forniamo il contesto reale all'AI
                        },
                        taskId: `neural_sync_${Date.now()}`
                    });
                }
                
                interactionBuffer.velocity = 0;
                interactionBuffer.density = 0;
            }
        }, CONFIG.SAMPLE_RATE);
    };

    return {
        init: () => {
            setTimeout(() => {
                initObserver();
                console.log("%c🛡️ Guardian v6.4.0: Contextual AI Monitoring Active", "color: #00ffa2; font-weight: bold;");
            }, 1000);
        },
        // API per Biotech.js per sapere se l'AI può partire in sicurezza
        isSystemStable: () => {
            const lastTask = performance.getEntriesByType('longtask').pop();
            return !lastTask || lastTask.duration < CONFIG.LONG_TASK_THRESHOLD;
        }
    };
})();

BiotechGuardian.init();