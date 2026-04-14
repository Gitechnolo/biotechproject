/**
 * BIOTECH PROJECT | SRE PATCH ENGINE (Immune Response)
 * -------------------------------------------------------------------------
 * ARCHITECTURE: Event-Driven Resilience Scaler
 * RELIABILITY: Anti-Loop Protection (5000ms Cooldown)
 * COMPLIANCE: WCAG 2.2 AAA (ARIA Sonification Buffer)
 * -------------------------------------------------------------------------
BIOTECHPROJECT | SERVICE STRUCTURE: PATCH ENGINE
================================================

 [SIGNAL RECEIVER] 
        ║
        ╚══ biotech:resilience-needed (Event Listener)
             ║
             ╠══ ANALYSIS: Performance Report Parsing
             ║
             ╠══ DEFENSE: Anti-Loop Logic (ADR-008 Compliance)
             ║
             ╠══ EXECUTION: DOM Attribute Scaling (data-resilience)
             ║
             ╚══ A11Y: ARIA-Live Buffer Update (Sonification)

-------------------------------------------------------------------------
STATUS: READY // ACTIVE_DEFENSE_MODE_ENABLED
*/

const BiotechPatchEngine = (() => {
    let lastAction = 0;
    const COOLDOWN = 5000; // 5s di "Stato di Grazia" (ADR-008)

    const handleEmergency = (event) => {
        const now = performance.now();
        if (now - lastAction < COOLDOWN) return; // Anti-Loop attivo

        lastAction = now;
        const report = event.detail;

        // Eseguiamo la "toppa" in sincronia con il refresh del browser
        window.requestAnimationFrame(() => {
            if (document.documentElement.getAttribute('data-resilience') !== 'high') {
                
                // Applichiamo lo stato 'clinical'
                document.documentElement.setAttribute('data-resilience', 'clinical');
                
                // Aggiornamento ARIA Buffer (WCAG Compliance)
                const buffer = document.getElementById('biotech-alert-buffer');
                if (buffer) {
                    buffer.innerText = "Ottimizzazione performance in corso.";
                }

                // Log pulito e sintetico
                const logStyle = (typeof SRE_LOG_MAIN !== 'undefined') 
                    ? SRE_LOG_MAIN.syntax + SRE_LOG_MAIN.patch 
                    : 'background: #ff9800; color: #fff; padding: 2px 5px;';
                
                console.log(`%c🛠️ Patch: Applied Clinical Mode (${report.type})`, logStyle);
            }
        });
    };

    return {
        listen: () => {
            window.addEventListener('biotech:resilience-needed', handleEmergency);
            
            // LOG DI BOOT: Il medico è in ambulatorio
            const readyStyle = (typeof SRE_LOG_MAIN !== 'undefined') 
                ? SRE_LOG_MAIN.syntax + SRE_LOG_MAIN.patch 
                : 'background: #ff9800; color: #fff; padding: 2px 5px;';
                
            console.log(`%c💉 Patch Engine: System Ready`, readyStyle);
        }
    };
})();

// Inizializzazione automatica al caricamento del modulo
BiotechPatchEngine.listen();