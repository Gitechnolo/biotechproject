// tools/generate-performance.js
const fs = require('fs');
const path = require('path');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

// Lista delle pagine da analizzare - SOLO quelle esistenti
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
  { url: 'http://127.0.0.1:8080/Job_Listings.html', label: 'Offerte di lavoro', slug: 'job-listings', category: 'altro' }
];

(async () => {
  let chrome;
  const results = [];

  try {
   // Avvia Chrome in modalità headless
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox', '--no-zygote', '--single-process'],
      port: 9222
    });

    const options = {
      port: chrome.port,
      output: 'json',
      onlyCategories: ['performance'],
      logLevel: 'silent'
    };

    for (const page of pages) {
      try {
        console.log(`🔍 Analizzo: ${page.url}`);
        const runnerResult = await lighthouse(page.url, options);

        const score = Math.round(runnerResult.lhr.categories.performance.score * 100);
        const loadTime = runnerResult.lhr.audits['interactive']?.numericValue || 0;

        results.push({
          ...page,
          performanceScore: score,
          loadTime: Math.round(loadTime),
          lastAnalyzed: new Date().toISOString()
        });

        console.log(`✅ ${page.label}: Score ${score}`);
      } catch (pageError) {
        console.warn(`❌ Fallito: ${page.label} (${page.url})`);
        console.warn(`   Errore: ${pageError.message}`);

        // In caso di errore, inserisci un risultato con score 0 e messaggio
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
    console.error('🚨 Errore critico nell\'avvio di Chrome:', overallError);
    process.exit(1);
  } finally {
    if (chrome) {
      try {
        await chrome.kill();
      } catch (killError) {
        console.warn('⚠️ Impossibile terminare Chrome:', killError.message);
      }
    }
  }

  // Percorso di output: Biotech-file/performance-data.json
  const outputDir = path.resolve(__dirname, '../Biotech-file');
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
    console.error('❌ Errore nella scrittura del file:', writeError);
    process.exit(1);
  }
})();
