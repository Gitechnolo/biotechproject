// tools/generate-performance.js

import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Lista delle pagine da analizzare
const pages = [
  { url: 'http://127.0.0.1:8080/index.html', label: 'Homepage', slug: 'index', category: 'cellula' },
  { url: 'http://127.0.0.1:8080/Apparato_circolatorio.html', label: 'Apparato circolatorio', slug: 'apparato-circolatorio', category: 'cellula' },
  { url: 'http://127.0.0.1:8080/Cuore.html', label: 'Cuore', slug: 'cuore', category: 'cellula' },
  { url: 'http://127.0.0.1:8080/Apparato_respiratorio.html', label: 'Apparato respiratorio', slug: 'apparato-respiratorio', category: 'cellula' },
  { url: 'http://127.0.0.1:8080/Apparato_digerente.html', label: 'Apparato digerente', slug: 'apparato-digerente', category: 'cellula' },
  { url: 'http://127.0.0.1:8080/Apparato_tegumentario.html', label: 'Apparato tegumentario', slug: 'apparato-tegumentario', category: 'cellula' },
  { url: 'http://127.0.0.1:8080/Sistema_linfatico.html', label: 'Sistema linfatico', slug: 'sistema-linfatico', category: 'cellula' },
  { url: 'http://127.0.0.1:8080/Dermatologia.html', label: 'Dermatologia', slug: 'dermatologia', category: 'dermatologia' },
  { url: 'http://127.0.0.1:8080/Cellula.html', label: 'Cellula', slug: 'cellula', category: 'cellula' },
  { url: 'http://127.0.0.1:8080/Staff.html', label: 'Staff', slug: 'staff', category: 'staff' },
  { url: 'http://127.0.0.1:8080/Progetti.html', label: 'Progetti', slug: 'progetti', category: 'altro' },
  { url: 'http://127.0.0.1:8080/Marketing.html', label: 'Marketing', slug: 'marketing', category: 'altro' },
  { url: 'http://127.0.0.1:8080/O.S_support.html', label: 'Supporto OS', slug: 'os-support', category: 'altro' },
  { url: 'http://127.0.0.1:8080/Tablet_forum.html', label: 'Forum Tablet', slug: 'tablet-forum', category: 'altro' },
  { url: 'http://127.0.0.1:8080/Specials.html', label: 'Specials', slug: 'specials', category: 'altro' },
  { url: 'http://127.0.0.1:8080/Tech_Maturity.html', label: 'Maturità tecnologica', slug: 'tech-maturity', category: 'altro' }
];

/**
 * Funzione principale asincrona
 */
async function runPerformanceAnalysis() {
  const results = [];
  let browser;
  let page;

  try {
  // 🚀 Avvia Chromium con Puppeteer (più affidabile in ambienti cloud)
  console.log('🚀 Avvio Chromium con Puppeteer...');
  browser = await puppeteer.launch({
  headless: 'chrome', // 🔥 Usa 'chrome', non 'new'
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-software-rasterizer', // 🔥 Evita l'uso della GPU
    '--disable-features=VizDisplayCompositor', // 🔥 Fondamentale: disabilita il compositore grafico
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-features=TranslateUI',
    '--disable-features=ImprovedCookieControls',
    '--disable-features=SameSiteByDefaultCookies',
    '--disable-features=AutofillServerCommunication',
    '--disable-features=PasswordBreachDetection',
    '--disable-features=PrivacySandboxSettings4',
    '--disable-features=SigninSuccessNotification',
    '--no-first-run',
    '--no-zygote',
    '--deterministic-fetch',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-ipc-flooding-protection',
    '--disable-breakpad',
    '--single-process', // Utile in ambienti con poca RAM
    '--window-size=1350,940',
    '--remote-debugging-port=9222',
    '--remote-debugging-address=0.0.0.0',
    '--disable-background-networking',
    '--disable-background-timer-throttling'
  ],
  defaultViewport: {
    width: 1350,
    height: 940,
    deviceScaleFactor: 1
  }
});      

// Ottieni una nuova pagina
    page = await browser.newPage();

    // Estrai la porta di debug da Puppeteer
    const { port } = new URL(browser.wsEndpoint());

    // Configurazione Lighthouse: analisi performance desktop
    const options = {
      port,
      output: 'json',
      onlyCategories: ['performance'],
      logLevel: 'silent',
      disableStorageReset: true,
      formFactor: 'desktop',
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false
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
      useDevtoolsLogs: true,
      skipAudits: [
        'metrics',
        'diagnostics',
        'audit-refs'
      ]
    };

    console.log('✅ Chromium avviato. Inizio analisi delle pagine...');

    // Analizza ogni pagina
    for (const pageData of pages) {
      try {
        console.log(`🔍 Analizzo: ${pageData.label} (${pageData.url})`);
        
        // Vai alla pagina
        await page.goto(pageData.url, {
          waitUntil: 'networkidle0',
          timeout: 30000
        });

        // Esegui Lighthouse
        const runnerResult = await lighthouse(pageData.url, options);

        // Estrai punteggio e metriche
        const score = Math.round(runnerResult.lhr.categories.performance.score * 100);
        const loadTime = runnerResult.lhr.audits['largest-contentful-paint']?.numericValue || 0;

        results.push({
          ...pageData,
          performanceScore: score,
          loadTime: Math.round(loadTime),
          lastAnalyzed: new Date().toISOString()
        });

        console.log(`✅ ${pageData.label}: Punteggio performance ${score}`);
      } catch (pageError) {
        console.warn(`❌ Fallito: ${pageData.label}`);
        console.warn(`   Errore: ${pageError.message}`);

        results.push({
          ...pageData,
          performanceScore: 0,
          loadTime: 0,
          lastAnalyzed: new Date().toISOString(),
          error: `Non raggiungibile - ${pageError.message.substring(0, 100)}...`
        });
      }

      // Pausa tra una pagina e l'altra (evita sovraccarico)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } catch (overallError) {
    console.error('🚨 Errore critico:', overallError.message);
    process.exit(1);
  } finally {
    // Chiudi il browser
    if (browser) {
      try {
        await browser.close();
        console.log('⏹️ Chromium chiuso correttamente');
      } catch (closeError) {
        console.warn('⚠️ Impossibile chiudere il browser:', closeError.message);
      }
    }
  }

  // Percorso di output: tools/performance-data.json
  const outputDir = path.resolve(new URL(import.meta.url).pathname, '..');
  const outputPath = path.join(outputDir, 'performance-data.json');

  // Dati finali
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

  // Scrive il file JSON
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

// Esegui la funzione principale
runPerformanceAnalysis().catch(err => {
  console.error('🚨 Errore non gestito:', err);
  process.exit(1);
});