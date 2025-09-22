// tools/generate-performance.js

import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';

// URL base del sito
const BASE_URL = 'https://gitechnolo.github.io/biotechproject';

// Lista delle pagine da analizzare
const pages = [
  { url: `${BASE_URL}/index.html`, label: 'Homepage', slug: 'index', category: 'biotecnologie' },
  { url: `${BASE_URL}/Cuore.html`, label: 'Cuore', slug: 'cuore', category: 'fisiologia' },
  { url: `${BASE_URL}/Cuore-semplice.html`, label: 'Cuore (versione semplificata)', slug: 'cuore-semplice', category: 'accessibilità' },
  { url: `${BASE_URL}/Apparato_respiratorio.html`, label: 'Apparato respiratorio', slug: 'apparato-respiratorio', category: 'fisiologia' },
  { url: `${BASE_URL}/Apparato_respiratorio-semplice.html`, label: 'Apparato respiratorio (versione semplificata)', slug: 'apparato-respiratorio-semplice', category: 'accessibilità' },   
  { url: `${BASE_URL}/Apparato_digerente.html`, label: 'Apparato digerente', slug: 'apparato-digerente', category: 'fisiologia' },
  { url: `${BASE_URL}/Apparato_digerente-semplice.html`, label: 'Apparato digerente (versione semplificata)', slug: 'apparato-digerente-semplice', category: 'accessibilità' },   
  { url: `${BASE_URL}/Apparato_tegumentario.html`, label: 'Apparato tegumentario', slug: 'apparato-tegumentario', category: 'fisiologia' },
  { url: `${BASE_URL}/Apparato_tegumentario-semplice.html`, label: 'Apparato tegumentario (versione semplificata)', slug: 'apparato-tegumentario-semplice', category: 'accessibilità' },   
  { url: `${BASE_URL}/Sistema_linfatico.html`, label: 'Sistema linfatico', slug: 'sistema-linfatico', category: 'fisiologia' },
  { url: `${BASE_URL}/Sistema_linfatico-semplice.html`, label: 'Sistema linfatico (versione semplificata)', slug: 'sistema-linfatico-semplice', category: 'accessibilità'},   
  { url: `${BASE_URL}/Dermatologia.html`, label: 'Dermatologia', slug: 'dermatologia', category: 'fisiologia' },
  { url: `${BASE_URL}/Dermatologia-semplice.html`, label: 'Dermatologia (versione semplificata)', slug: 'dermatologia-semplice', category: 'accessibilità'},   
  { url: `${BASE_URL}/Cellula.html`, label: 'Cellula', slug: 'cellula', category: 'fisiologia' },
  { url: `${BASE_URL}/Cellula-semplice.html`, label: 'Cellula (versione semplificata)', slug: 'cellula-semplice', category: 'accessibilità' },   
  { url: `${BASE_URL}/Staff.html`, label: 'Staff', slug: 'staff', category: 'staff' },
  { url: `${BASE_URL}/Progetti.html`, label: 'Progetti', slug: 'progetti', category: 'altro' },
  { url: `${BASE_URL}/Marketing.html`, label: 'Marketing', slug: 'marketing', category: 'mercato cibernetica' },
  { url: `${BASE_URL}/O.S_support.html`, label: 'Supporto OS', slug: 'os-support', category: 'supporto' },
  { url: `${BASE_URL}/Tablet_forum.html`, label: 'Forum Tablet', slug: 'tablet-forum', category: 'forum' },
  { url: `${BASE_URL}/Specials.html`, label: 'Specials', slug: 'specials', category: 'cellule staminali robotica' },
  { url: `${BASE_URL}/Tech_Maturity.html`, label: 'Maturità tecnologica', slug: 'tech-maturity', category: 'maturità tecnologica' },
  { url: `${BASE_URL}/accessibility-it.html`, label: 'Accessibilità (informazioni)', slug: 'accessibility-it', category: 'accessibilità' }, 
  { url: `${BASE_URL}/accessibility-en.html`, label: 'Accessibility (information)', slug: 'accessibility-en', category: 'accessibilità' },     
];

// Configurazione di Chrome per Lighthouse
const launchChrome = async () => {
  return await chromeLauncher.launch({
    chromeFlags: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--headless',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-ipc-flooding-protection',
      '--disable-breakpad',
      '--disable-component-extensions-with-background-pages',
      '--disable-default-apps',
      '--disable-features=TranslateUI',
      '--disable-features=AudioServiceOutOfProcess',
      '--allow-running-insecure-content',
      '--disable-web-security',
      '--window-size=1350,940'
    ],
    port: 9222, // Porta fissa per debug (opzionale)
    logLevel: 'silent'
  });
};

/**
 * Funzione principale: analizza tutte le pagine
 */
async function runPerformanceAnalysis() {
  const results = [];
  let chrome;

  try {
    // 🚀 Avvia Chrome con chrome-launcher
    console.log('🚀 Avvio Chrome per Lighthouse...');
    chrome = await launchChrome();
    console.log(`✅ Chrome avviato sulla porta ${chrome.port}`);

    // Configurazione comune per Lighthouse
    const lighthouseConfig = {
      port: chrome.port,
      output: 'json',
      logLevel: 'silent',
      disableStorageReset: false, // Permette a Lighthouse di pulire cache/sessione
      formFactor: 'desktop',
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: true // Disabilita emulazione (usiamo desktop reale)
      },
      throttling: {
        rttMs: 150,
        throughputKbps: 1500,
        cpuSlowdownMultiplier: 4,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0
      },
      throttlingMethod: 'devtools',
      onlyCategories: ['performance'],
      skipAudits: [
        'metrics',           // Non calcolare metriche aggiuntive (LCP, FCP, ecc.) se non necessarie
        'diagnostics',       // Rimuove audit diagnostici (riduce rumore)
        'audit-refs'         // Ottimizza output
      ]
    };

    // 🔍 Analisi di ogni pagina
    for (const pageData of pages) {
      try {
        console.log(`🔍 Analizzo: ${pageData.label} (${pageData.url})`);

        // ✅ Lighthouse gestisce TUTTA la navigazione
        const runnerResult = await lighthouse(pageData.url, lighthouseConfig);

        // Estrai risultati
        const lhr = runnerResult.lhr;
        const performanceScore = Math.round(lhr.categories.performance.score * 100);
        const lcp = lhr.audits['largest-contentful-paint']?.numericValue || 0;
        const fcp = lhr.audits['first-contentful-paint']?.numericValue || 0;

        results.push({
          ...pageData,
          performanceScore,
          loadTime: Math.round(lcp),
          firstPaint: Math.round(fcp),
          lastAnalyzed: new Date().toISOString()
        });

        console.log(`✅ ${pageData.label}: Punteggio ${performanceScore}, LCP: ${Math.round(lcp)}ms`);

      } catch (auditError) {
        console.warn(`❌ Fallito: ${pageData.label}`);
        console.warn(`   Errore: ${auditError.message.substring(0, 100)}...`);

        results.push({
          ...pageData,
          performanceScore: 0,
          loadTime: 0,
          firstPaint: 0,
          lastAnalyzed: new Date().toISOString(),
          error: `Analisi fallita - ${auditError.message.substring(0, 100)}...`
        });
      }

      // ⏸️ Pausa tra una pagina e l'altra (gentile verso il server)
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

  } catch (overallError) {
    console.error('🚨 Errore critico durante l’analisi:', overallError.message);
    process.exit(1);
  } finally {
    // 🔚 Chiudi Chrome in modo sicuro
    if (chrome) {
      try {
        await chrome.kill();
        console.log('⏹️ Chrome chiuso correttamente');
      } catch (closeError) {
        console.warn('⚠️ Impossibile chiudere Chrome:', closeError.message);
      }
    }
  }

  // 📁 Percorso di output: tools/performance-data.json
  const outputDir = path.resolve(new URL(import.meta.url).pathname, '..');
  const outputPath = path.join(outputDir, 'performance-data.json');

  // 📊 Dati finali
  const output = {
    lastUpdated: new Date().toISOString(),
    summary: {
      totalPages: pages.length,
      analyzed: results.filter(r => !r.error).length,
      failed: results.filter(r => r.error).length
    },
    pages: results
  };

  // Assicura che la cartella esista
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Cartella creata: ${outputDir}`);
    }
  } catch (mkdirError) { 
    console.warn(`⚠️  Impossibile creare la cartella: ${mkdirError.message}`);
  }

  // 📥 Scrive il file JSON
  try {
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`✅ Report salvato in: ${outputPath}`);
    console.log(`📊 Analisi completata: ${results.length} pagine processate.`);
    if (output.summary.failed > 0) {
      console.warn(`⚠️  ${output.summary.failed} pagine non analizzate.`);
    }
  } catch (writeError) {
    console.error('❌ Errore nella scrittura del file:', writeError.message);
    process.exit(1);
  }
}

// ✅ Esegui l'analisi
runPerformanceAnalysis().catch(err => {
  console.error('🚨 Errore non gestito:', err);
  process.exit(1);
});   