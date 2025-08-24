// tools/generate-performance.js

import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
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
  { url: 'http://127.0.0.1:8080/Tech_Maturity.html', label: 'Maturità tecnologica', slug: 'job-listings', category: 'altro' }
];

/**
 * Funzione principale asincrona
 */
async function runPerformanceAnalysis() {
  let chrome;
  const results = [];

  try {
    // Avvia Chrome in modalità headless
    console.log('🚀 Avvio Chrome headless...');
    chrome = await chromeLauncher.launch({
      chromeFlags: [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--no-zygote',
        '--single-process',
        '--remote-debugging-port=9222',
        '--disable-dev-shm-usage'
      ],
      port: 9222,
      // Su GitHub Actions, Chromium è disponibile qui
      executablePath: process.env.CHROME_PATH || '/usr/bin/chromium-browser'
    });

    const options = {
      port: chrome.port,
      output: 'json',
      onlyCategories: ['performance'],
      logLevel: 'silent'
    };

    console.log('✅ Chrome avviato. Inizio analisi delle pagine...');

    for (const page of pages) {
      try {
        console.log(`🔍 Analizzo: ${page.label} (${page.url})`);
        const runnerResult = await lighthouse(page.url, options);

        const score = Math.round(runnerResult.lhr.categories.performance.score * 100);
        const loadTime = runnerResult.lhr.audits['interactive']?.numericValue || 0;

        results.push({
          ...page,
          performanceScore: score,
          loadTime: Math.round(loadTime),
          lastAnalyzed: new Date().toISOString()
        });

        console.log(`✅ ${page.label}: Punteggio performance ${score}`);
      } catch (pageError) {
        console.warn(`❌ Fallito: ${page.label}`);
        console.warn(`   Errore: ${pageError.message}`);

        results.push({
          ...page,
          performanceScore: 0,
          loadTime: 0,
          lastAnalyzed: new Date().toISOString(),
          error: `Non raggiungibile - ${pageError.message.substring(0, 100)}...`
        });
      }
    }
  } catch (overallError) {
    console.error('🚨 Errore critico nell\'avvio di Chrome:', overallError.message);
    process.exit(1);
  } finally {
    if (chrome) {
      try {
        await chrome.kill();
        console.log('⏹️ Chrome chiuso correttamente');
      } catch (killError) {
        console.warn('⚠️ Impossibile terminare Chrome:', killError.message);
      }
    }
  }

  // Percorso di output: Biotech-file/performance-data.json
  const outputDir = path.resolve(new URL(import.meta.url).pathname, '../Biotech-file');
  const outputPath = path.join(outputDir, 'performance-data.json');

  // Assicura che la cartella esista
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Dati finali da salvare
  const output = {
    lastUpdated: new Date().toISOString(),
    summary: {
      totalPages: pages.length,
      analyzed: results.filter(r => !r.error).length,
      failed: results.filter(r => r.error).length
    },
    pages: results
  };

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