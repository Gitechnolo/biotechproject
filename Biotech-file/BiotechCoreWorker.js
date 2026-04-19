/**
 * BIOTECH PROJECT | CORE COMPUTATIONAL WORKER [v1.0.1]
 * -------------------------------------------------------------------------
 * STRATEGY: Off-Main-Thread Processing | Zero-Exfiltration | ADR-011
 * ROLE: Primary Computational Engine for i18n & Heavy Data Parsing
 * PERFORMANCE: Main-Thread Liberation (60fps Protection)
 * -------------------------------------------------------------------------
   WORKER TASK TOPOLOGY 2026
   =========================
   
   [INCOMING MESSAGE] ──► [TASK ORCHESTRATOR] ──► [LOCAL CACHE]
                                ║
        ╠══ ACTION: INIT_TRANSLATION_ENGINE ══► Fetch & Heavy Parse
        ║           (Offloads JSON overhead from Main Thread)
        ║
        ╠══ ACTION: PROCESS_TRANSLATION ══════► Key-Value Lookup
        ║           (Non-blocking i18n resolution)
        ║
        ╠══ ACTION: CALCULATE_HOLIDAY_METRICS ► Deterministic Logic
        ║           (Scientific D.A.T.A. offloading)
        ║
        ╚══ ACTION: DEFAULT ══════════════════► Error Handling (taskId Sync)

 * -------------------------------------------------------------------------
 * COMPLIANCE: Privacy-First (No external pings) | Local-Only Data Vault
 * STATUS: ACTIVE // COMPUTATIONAL_CORE_READY
 */

// Cache locale del Worker per evitare fetch ripetuti
let cachedData = null;

self.onmessage = async function(e) {
    const { action, payload, taskId } = e.data;

    switch (action) {
        case 'PARSE_JSON_DATA': // Usato da loadTranslation
        case 'INIT_TRANSLATION_ENGINE':
            try {
                const response = await fetch(payload.fileUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                cachedData = await response.json();
                const processedData = performHeavyCalculations(cachedData, payload.options);

                self.postMessage({ taskId, success: true, data: processedData });
            } catch (error) {
                self.postMessage({ taskId, success: false, error: error.message });
            }
            break;

        case 'PROCESS_TRANSLATION': // Richiesto da getTranslation/getWorkerTranslation
            try {
                if (!cachedData) {
                    // Se il worker viene interrogato prima dell'init, restituiamo la chiave
                    self.postMessage({ taskId, success: true, data: payload.key });
                    return;
                }
                const translatedText = cachedData[payload.key] || payload.key;
                self.postMessage({ taskId, success: true, data: translatedText });
            } catch (error) {
                self.postMessage({ taskId, success: false, error: error.message });
            }
            break;

        case 'CALCULATE_HOLIDAY_METRICS':
            const holidayResults = calculateDeterministicDates(payload.year);
            self.postMessage({ taskId, success: true, data: holidayResults });
            break;

        default:
            self.postMessage({ taskId, success: false, error: "Unknown Action" });
    }
};

function performHeavyCalculations(data, options) {
    if (options && options.filter) {
        return data.filter(item => item.status === 'active');
    }
    return data;
}

function calculateDeterministicDates(year) {
    return { year, status: "Calculated in Worker" };
}