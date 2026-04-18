/**
 * =============================================================================
 * BIOTECH-SRE-PATCH-ENGINE // VERSION 6.2.1 (INTELLIGENT IMMUNE RESPONSE)
 * =============================================================================
 * [STRATEGY]: Event-Driven Resilience Scaler with Hierarchy Protection.
 * [GOAL]: Dynamic UX adaptation without downgrading existing safety states.
 * [COMPLIANCE]: ADR-008 (Anti-Loop) / WCAG 2.2 AAA (A11Y Sonification).
 * -----------------------------------------------------------------------------
 * 1. SIGNAL PROCESSING (Event-Driven)
 * ║─► Receiver: Listens for 'biotech:resilience-needed' from SRE Guardian.
 * ║─► Analysis: Parses Performance Reports (Long Tasks / FPS Drops).
 *
 * 2. EXECUTION LOGIC (State Hierarchy) [NEW v6.2.1]
 * ║─► High Priority: If state is 'HIGH' (Memory/3G), no downgrade to 'CLINICAL'.
 * ║─► Reactive: Escalates 'STABLE' to 'CLINICAL' upon stress detection.
 * ║─► Frame Sync: Uses requestAnimationFrame for zero-jank UI updates.
 *
 * 3. FEEDBACK & ACCESSIBILITY
 * ║─► Sonification: Updates ARIA-Live 'biotech-alert-buffer' for Screen Readers.
 * ║─► SRE Logging: Diagnostic output to the Neural Core Dashboard.
 * ╚─► Anti-Loop: 5000ms cooldown (ADR-008) to prevent oscillation.
 * -----------------------------------------------------------------------------
 * STATUS: ACTIVE // HIERARCHY_PROTECTION_ENABLED // YEAR: 2026
 * =============================================================================
 */

const BiotechPatchEngine = (() => {
    let lastAction = 0;
    const COOLDOWN = 5000; // 5s di "Stato di Grazia" (ADR-008)

    /**
     * Gestisce l'emergenza segnalata dal Guardian.
     * Implementa la protezione gerarchica: HIGH > CLINICAL > STABLE
     */
    const handleEmergency = (event) => {
        const now = performance.now();
        if (now - lastAction < COOLDOWN) return; // Protezione Anti-Loop

        lastAction = now;
        const report = event.detail;

        window.requestAnimationFrame(() => {
            const currentStatus = document.documentElement.getAttribute('data-resilience');

            // PROTEZIONE GERARCHICA:
            // Non sovrascrivere mai se siamo già in modalità 'high' (massima protezione).
            if (currentStatus !== 'high') {
                
                // Eleviamo lo stato a 'clinical'
                document.documentElement.setAttribute('data-resilience', 'clinical');
                
                // Aggiornamento ARIA Buffer per l'accessibilità (WCAG 2.2 AAA)
                const buffer = document.getElementById('biotech-alert-buffer');
                if (buffer) {
                    buffer.innerText = "Ottimizzazione automatica delle performance in corso per garantire la stabilità.";
                }

                // Log diagnostico in stile SRE
                const logStyle = (typeof SRE_LOG_MAIN !== 'undefined') 
                    ? SRE_LOG_MAIN.syntax + SRE_LOG_MAIN.patch 
                    : 'background: #ff9800; color: #fff; padding: 2px 5px; font-weight: bold; border-radius: 3px;';
                
                console.log(`%c🛠️ Patch: Applied Clinical Mode (${report.type}: ${report.value}ms)`, logStyle);
            } else {
                // Notifica silenziosa: il sistema è già al massimo della protezione
                console.log(`%c🛡️ Patch: Hierarchy Shield Active - System already in HIGH mode. Ignoring Clinical downgrade.`, 
                    'color: #00ffa2; font-family: monospace; font-size: 10px;');
            }
        });
    };

    return {
        /**
         * Attiva il ricevitore di segnali del Patch Engine
         */
        listen: () => {
            window.addEventListener('biotech:resilience-needed', handleEmergency);
            
            const readyStyle = (typeof SRE_LOG_MAIN !== 'undefined') 
                ? SRE_LOG_MAIN.syntax + SRE_LOG_MAIN.patch 
                : 'background: #333; color: #ff9800; padding: 2px 5px; border: 1px solid #ff9800;';
                
            console.log(`%c💉 Patch Engine: System Ready & Immune Response Active`, readyStyle);
        }
    };
})();

// Inizializzazione automatica
BiotechPatchEngine.listen();

/* * =============================================================================
 * END OF BIOTECH_PATCH_ENGINE // SYSTEM_PROTECTED
 * =============================================================================
 */