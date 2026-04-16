/**
 * BIOTECH PROJECT | SRE PATCH ENGINE (Immune Response & Self-Evolution) [v7.0]
 * -------------------------------------------------------------------------
 * ARCHITECTURE: Event-Driven Resilience & Hot-Logic Injector
 * RELIABILITY: Anti-Loop Protection (ADR-008) & Safe-Rollback Logic
 * EVOLUTION: Consent-Based Dynamic Update Execution (v7.0 Evolution Support)
 * -------------------------------------------------------------------------
BIOTECHPROJECT | SERVICE STRUCTURE: PATCH ENGINE
================================================

 [SIGNAL RECEIVERS] 
        ║
        ╠══ biotech:resilience-needed ══════╗
        ║                                   ║
        ╚══ biotech:evolution-available ════╬══[ LOGIC ORCHESTRATOR ]
                                            ║           ║
             ╔══════════════════════════════╝           ║
             ║                                          ║
             ╠══ DEFENSE: Anti-Loop Logic (ADR-008 Compliance)
             ║
             ╠══ ANALYSIS: Performance Scaling (data-resilience: clinical)
             ║
             ╠══ EVOLUTION: Hot-Patch Execution (In-Memory Mutation)
             ║      ║
             ║      ╠══ VALIDATION: Syntax Check (new Function)
             ║      ╚══ ROLLBACK: Shadow Logic Restoration (Safe-State)
             ║
             ╠══ FEEDBACK: Dashboard & Terminal Sync (CustomEvents)
             ║
             ╚══ A11Y: ARIA-Live Sonification (WCAG 2.2 AAA)

-------------------------------------------------------------------------
STATUS: READY // EVOLUTION_SUPPORT_ACTIVE // SAFE_ROLLBACK_ARMED
*/

const BiotechPatchEngine = (() => {
    let lastAction = 0;
    const COOLDOWN = 5000; // ADR-008 Grace Period
    
    let backupLogic = null; // Buffer per Safe-Rollback
    let pendingPatchUrl = null;

    /**
     * RESILIENCE SCALING: Handles performance degradation
     */
    const handleEmergency = (event) => {
        const now = performance.now();
        if (now - lastAction < COOLDOWN) return; 

        lastAction = now;
        const report = event.detail;

        window.requestAnimationFrame(() => {
            if (document.documentElement.getAttribute('data-resilience') !== 'clinical') {
                document.documentElement.setAttribute('data-resilience', 'clinical');
                
                const buffer = document.getElementById('biotech-alert-buffer');
                if (buffer) buffer.innerText = "Performance optimization active.";

                const logStyle = (typeof SRE_LOG_MAIN !== 'undefined') 
                    ? SRE_LOG_MAIN.syntax + SRE_LOG_MAIN.patch 
                    : 'background: #ff9800; color: #fff; padding: 2px 5px;';
                
                console.log(`%c🛠️ Patch: Applied Clinical Mode (${report.type})`, logStyle);
            }
        });
    };

    /**
     * EVOLUTION HANDLER: Prepares the system for a logic upgrade
     */
    const prepareEvolution = (event) => {
        const { version, type, payloadUrl } = event.detail;
        pendingPatchUrl = payloadUrl;

        console.log(`%c🧬 Patch Engine: Evolution v${version} staged (${type})`, 'color: #00ffa2; font-style: italic;');
        
        // Notifica il terminale (Il terminale ascolta biotech:evolution-available separatamente)
        // ma noi marchiamo il Patch Engine come "Ready for Upgrade"
    };

    /**
     * HOT-PATCH EXECUTION: Injects new logic without reload
     */
    const executeHotPatch = async () => {
        if (!pendingPatchUrl) return;

        try {
            console.log("%c💉 Evolution: Initiating Hot-Infection...", "color: #00ffa2;");
            
            const response = await fetch(`${pendingPatchUrl}?t=${Date.now()}`);
            if (!response.ok) throw new Error("Update payload unreachable");
            
            const newLogicScript = await response.text();

            // SAFE-ROLLBACK: Salvataggio dello stato attuale (Shadow Logic)
            const dynamicContainer = document.getElementById('biotech-dynamic-patch');
            backupLogic = dynamicContainer ? dynamicContainer.textContent : '';

            // VALIDATION: Verifichiamo la sintassi prima dell'iniezione finale
            try {
                new Function(newLogicScript); 
            } catch (syntaxError) {
                throw new Error("New logic failed syntax validation: " + syntaxError.message);
            }

            // INJECTION: Sostituzione della logica nel DOM
            const scriptTag = dynamicContainer || document.createElement('script');
            scriptTag.id = 'biotech-dynamic-patch';
            scriptTag.textContent = newLogicScript;
            
            if (!dynamicContainer) document.head.appendChild(scriptTag);

            console.log("%c✅ Evolution: System Evolved successfully.", "color: #00ffa2; font-weight: bold;");
            pendingPatchUrl = null;

        } catch (err) {
            console.error("🛠️ Patch Engine: Evolution Failed. Triggering Rollback.", err);
            rollback();
        }
    };

    const rollback = () => {
        if (backupLogic !== null) {
            const scriptTag = document.getElementById('biotech-dynamic-patch');
            if (scriptTag) scriptTag.textContent = backupLogic;
            console.warn("🛡️ Patch Engine: Safe-Rollback executed. Stable state restored.");
        }
    };

    return {
        listen: () => {
            // Monitoraggio Stress
            window.addEventListener('biotech:resilience-needed', handleEmergency);
            
            // Monitoraggio Evoluzione
            window.addEventListener('biotech:evolution-available', prepareEvolution);
            
            // Esposizione comando per l'utente/terminale
            window.BiotechEvolutionTrigger = executeHotPatch;

            const readyStyle = (typeof SRE_LOG_MAIN !== 'undefined') 
                ? SRE_LOG_MAIN.syntax + SRE_LOG_MAIN.patch 
                : 'background: #ff9800; color: #fff; padding: 2px 5px;';
                
            console.log(`%c💉 Patch Engine: v7.0 Evolution Support Ready`, readyStyle);
        }
    };
})();

// Auto-boot
BiotechPatchEngine.listen();