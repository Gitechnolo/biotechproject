/**
 * BIOTECH PROJECT | PATCH ENGINE (v1.0.0)
 * -------------------------------------------------------------------------
 * ROLE: Emergency Resolution & State Transition (Anti-Loop)
 * -------------------------------------------------------------------------
 */

const BiotechPatchEngine = (() => {
    let lastAction = 0;
    const COOLDOWN = 5000; // 5s di "Stato di Grazia" (ADR-008)

    const handleEmergency = (event) => {
        const now = performance.now();
        if (now - lastAction < COOLDOWN) return; // Anti-Loop attivo

        lastAction = now;
        const report = event.detail;

        console.warn(`[PatchEngine] Intervento su segnale: ${report.status}`);

        // Interazione con BiotechResilience (Invariante Etica)
        if (document.documentElement.getAttribute('data-resilience') !== 'high') {
            // Scaliamo forzatamente lo stato di resilienza
            document.documentElement.setAttribute('data-resilience', 'clinical');
            
            // Notifica silente per WCAG 2.2 AAA (Sonification)
            const buffer = document.getElementById('biotech-alert-buffer');
            if (buffer) buffer.innerText = "Ottimizzazione resilienza attiva.";
        }
    };

    return {
        listen: () => {
            window.addEventListener('biotech:resilience-needed', handleEmergency);
            console.log("💉 PatchEngine: Ready");
        }
    };
})();

BiotechPatchEngine.listen();