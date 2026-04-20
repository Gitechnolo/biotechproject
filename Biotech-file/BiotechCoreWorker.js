/**
 * BIOTECH PROJECT | CORE COMPUTATIONAL WORKER [v1.0.2]
 * -------------------------------------------------------------------------
 * STRATEGY: Off-Main-Thread Processing | Zero-Exfiltration | ADR-011
 * ROLE: Primary Computational Engine for i18n & SRE Performance Analytics
 * PERFORMANCE: Main-Thread Liberation (60fps Protection)
 * -------------------------------------------------------------------------
   WORKER TASK TOPOLOGY 2026
   =========================
   
   [INCOMING MESSAGE] ──► [TASK ORCHESTRATOR] ──► [LOCAL CACHE]
                                ║
        ╠══ ACTION: INIT_TRANSLATION_ENGINE ══► Fetch & Heavy Parse
        ║
        ╠══ ACTION: PROCESS_TRANSLATION ══════► Key-Value Lookup
        ║
        ╠══ ACTION: PROCESS_PERFORMANCE ══════► SRE Trend & Stats Analytics
        ║           (Calculates averages, trends, and history off-thread)
        ║
        ╚══ ACTION: DEFAULT ══════════════════► Error Handling (taskId Sync)

 * -------------------------------------------------------------------------
 */

let cachedData = null;

self.onmessage = async function(e) {
    const { action, payload, taskId } = e.data;

    switch (action) {
        case 'PARSE_JSON_DATA':
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

        case 'PROCESS_TRANSLATION':
            try {
                if (!cachedData) {
                    self.postMessage({ taskId, success: true, data: payload.key });
                    return;
                }
                const translatedText = cachedData[payload.key] || payload.key;
                self.postMessage({ taskId, success: true, data: translatedText });
            } catch (error) {
                self.postMessage({ taskId, success: false, error: error.message });
            }
            break;

        case 'PROCESS_PERFORMANCE':
            try {
                // Esecuzione analisi SRE
                const processedData = processPerformanceAnalytics(payload.rawJson, payload.origin);
                self.postMessage({ taskId, success: true, data: processedData });
            } catch (error) {
                self.postMessage({ taskId, success: false, error: error.message });
            }
            break;

        default:
            self.postMessage({ taskId, success: false, error: "Unknown Action" });
    }
};

/**
 * Logica SRE: Calcola trend, medie e prepara i dati per la UI.
 */
function processPerformanceAnalytics(data, origin) {
    const pages = data.pages || [];
    
    // 1. Identificazione Homepage
    const homePage = pages.find(p => 
        p.url.includes('/index.html') || 
        p.url === 'https://gitechnolo.github.io/biotechproject/' ||
        p.url === origin + '/biotechproject/'
    );

    // 2. Calcolo Media Performance
    const totalPerf = pages.reduce((sum, p) => sum + (p.performanceScore || 0), 0);
    const avgPerf = Math.round(totalPerf / (pages.length || 1));

    // 3. Generazione Dati Grafico (History)
    const reportTime = homePage?.lastAnalyzed ? new Date(homePage.lastAnalyzed) : new Date();
    const history = [];
    
    if (homePage?.previousPerformanceScore !== undefined && homePage.previousPerformanceScore !== null) {
        history.push({
            date: subtractDays(reportTime, 5),
            score: homePage.previousPerformanceScore,
            note: 'Previous measurement'
        });
    }
    history.push({
        date: formatDate(reportTime),
        score: avgPerf,
        note: 'Current measurement'
    });

    // 4. Arricchimento dati pagine (Trend & UI Helpers)
    const processedPages = pages.map(page => {
        const current = page.performanceScore || 0;
        const previous = page.previousPerformanceScore;
        const diff = (previous !== null && previous !== undefined) ? current - previous : 0;
        
        return {
            ...page,
            trendValue: diff,
            trendArrow: diff > 0 ? '▲' : diff < 0 ? '▼' : '→',
            trendClass: diff > 0 ? 'badge-optimized' : diff < 0 ? 'badge-deprecated' : 'badge-compatible',
            formattedLoadTime: (page.loadTime / 1000).toFixed(1)
        };
    });

    return {
        avgPerf,
        history,
        pages: processedPages,
        summary: data.summary,
        lastUpdated: data.lastUpdated,
        homePageTrend: homePage ? (homePage.performanceScore - (homePage.previousPerformanceScore || homePage.performanceScore)) : 0
    };
}

// --- HELPERS ---

function performHeavyCalculations(data, options) { 
    if (options && options.filter) {
        return data.filter(item => item.status === 'active');
    }
    return data;
}

function subtractDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() - days);
    return formatDate(d);
}

function formatDate(date) {
    const d = new Date(date);
    // Nota: Intl API è supportata nei moderni Web Workers
    const options = { month: 'short' };
    return `${d.getDate()} ${d.toLocaleDateString('it-IT', options).replace('.', '')}`;
}