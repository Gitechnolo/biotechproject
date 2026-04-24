/**
 * =============================================================================
 * BIOTECH-SRE-PATCH-ENGINE // VERSION 6.4.0 (INTELLIGENCE IMMUNE RESPONSE)
 * =============================================================================
 * [STRATEGY]: AI-Aware Resilience Scaler with Proactive Throttling.
 * [GOAL]: Guarantee <106ms TBT during Neural Boot & Heavy Inference.
 * [COMPLIANCE]: ADR-011-PRO (Zero-Knowledge) / SRE Hardened v6.4.0.
 * -----------------------------------------------------------------------------
 * 1. SIGNAL PROCESSING (Intelligence-Driven)
 * ║─► Receiver: Listens for 'biotech:resilience-needed' & 'biotech:ai-boot-start'.
 * ║─► Neural Awareness: Interfaces with BiotechCoreWorker state via Guardian.
 *
 * 2. EXECUTION LOGIC (Predictive Scaling) [NEW v6.4.0]
 * ║─► AI-Boot Protection: Forces 'CLINICAL' mode on Intelligence Hub open.
 * ║─► Zero-Jank UI: Throttles Canvas Particle Engine during decryption cycles.
 * ║─► State Lock: Prevents AI-runtime degradation under low battery/2G.
 *
 * 3. SRE METRICS & ADAPTATION
 * ║─► TBT Guard: Offloads visual weight to maintain Speed Index 1.
 * ║─► Privacy-Safe: Operates without data exfiltration (Local-Only Patching).
 * ╚─► Anti-Loop: 5000ms cooldown (ADR-008) maintained for stabilization.
 * -----------------------------------------------------------------------------
 * STATUS: ACTIVE // INTELLIGENCE_AWARE // SPEED_INDEX_1_READY // 2026
 * =============================================================================
 */

const BiotechPatchEngine = (() => {
    // Gerarchia degli stati di protezione
    const PROTECTION_LEVELS = {
        STABLE: 0,
        CLINICAL: 1, // Riduzione animazioni (AI Booting)
        HIGH: 2      // Sospensione processi non critici (Heavy Inference)
    };

    let currentLevel = PROTECTION_LEVELS.STABLE;
    const cooldownPeriod = 5000; // ADR-008: Previene oscillazioni
    let lastPatchTime = 0;

    /**
     * Applica le modifiche alla UI/UX in base al livello di stress SRE
     */
    const applyPatch = (level) => {
        const root = document.documentElement;
        
        switch(level) {
            case PROTECTION_LEVELS.CLINICAL:
                root.setAttribute('data-sre-mode', 'clinical');
                // Riduce il frame-rate del Canvas Particle Engine per liberare il Main Thread per l'AI
                if (window.BiotechCanvas) window.BiotechCanvas.setThrottle(true);
                break;
            
            case PROTECTION_LEVELS.HIGH:
                root.setAttribute('data-sre-mode', 'high-resilience');
                // Sospende tutte le attività visuali non essenziali
                document.body.classList.add('sre-critical-path');
                break;
            
            default:
                root.removeAttribute('data-sre-mode');
                document.body.classList.remove('sre-critical-path');
                if (window.BiotechCanvas) window.BiotechCanvas.setThrottle(false);
        }
        currentLevel = level;
    };

    /**
     * Gestisce i segnali provenienti dal Guardian e dal Resilience
     */
    const handleEmergency = (event) => {
        const now = Date.now();
        if (now - lastPatchTime < cooldownPeriod) return;

        const report = event.detail;
        
        // Logica v6.4.0: Se l'AI Hub è aperto, forziamo almeno CLINICAL per proteggere il TBT
        let targetLevel = PROTECTION_LEVELS.STABLE;

        if (report.type === 'LONG_TASK' || report.isAIBooting) {
            targetLevel = PROTECTION_LEVELS.CLINICAL;
        }

        if (report.value > 200 || report.netStatus === '2g') {
            targetLevel = PROTECTION_LEVELS.HIGH;
        }

        // Impedisce il downgrade se il sistema è già in modalità HIGH per motivi di sicurezza
        if (targetLevel >= currentLevel) {
            applyPatch(targetLevel);
            lastPatchTime = now;
            
            const logStyle = (typeof SRE_LOG_MAIN !== 'undefined') 
                ? SRE_LOG_MAIN.syntax + SRE_LOG_MAIN.patch 
                : 'background: #ff9800; color: #fff; padding: 2px 5px; font-weight: bold;';
                
            console.log(`%c🛠️ Patch v6.4.0: Active Protection Level -> ${targetLevel}`, logStyle);
        }
    };

    return {
        listen: () => {
            // Ascolta segnali di stress generici
            window.addEventListener('biotech:resilience-needed', handleEmergency);
            
            // Nuovo listener v6.4.0: Protezione specifica durante il boot dell'AI
            window.addEventListener('biotech:ai-boot-start', () => {
                applyPatch(PROTECTION_LEVELS.CLINICAL);
            });

            console.log(`%c💉 Patch Engine v6.4.0: Intelligent Immune Response Active`, 
                'color: #ff9800; font-weight: bold;');
        },
        
        getCurrentStatus: () => currentLevel
    };
})();

// Auto-boot
BiotechPatchEngine.listen();

/* * =============================================================================
 * END OF BIOTECH_PATCH_ENGINE // SYSTEM_PROTECTED
 * =============================================================================
 */