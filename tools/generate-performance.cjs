// tools/generate-performance.js
const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 🔗 Lista delle pagine da analizzare
// Aggiorna con tutte le pagine del tuo progetto
const PAGES = [
  { url: 'https://gitechnolo.github.io/biotechproject/index.html', label: 'Homepage', slug: 'index', category: 'biotecnologie' },
  { url: 'https://gitechnolo.github.io/biotechproject/Cuore.html', label: 'Cuore', slug: 'cuore', category: 'fisiologia' },
  { url: 'https://gitechnolo.github.io/biotechproject/Tech_Maturity.html', label: 'Tech Maturity', slug: 'tech-maturity', category: 'tecnologia' },
  // 🔽 Aggiungi altre pagine qui:
  // { url: 'https://gitechnolo.github.io/biotechproject/altra-pagina.html', label: 'Etichetta', slug: 'altra', category: 'categoria' }
];

// 📂 Percorso del report precedente (per i trend)
const PREVIOUS_REPORT_PATH = path.join(__dirname, 'performance-latest.json');

async function runLighthouse(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const port = browser.wsEndpoint().split(':')[2].split('/')[0];

    const config = {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
        formFactor: 'mobile',
        throttling: 'simulate4G',
        screenEmulation: { mobile: true, width: 375, height: 667 },
        emulatedUserAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        skipAudits: [] // esegui tutti gli audit
      }
    };

    const runnerResult = await lighthouse(url, { port, output: 'json' }, config);
    const report = runnerResult.lhr;

    return {
      performanceScore: Math.round(report.categories.performance.score * 100),
      accessibilityScore: Math.round(report.categories.accessibility.score * 100),
      seoScore: Math.round(report.categories.seo.score * 100),
      bestPracticesScore: Math.round(report.categories['best-practices'].score * 100),
      loadTime: report.timing.total,
      firstPaint: report.audits['first-contentful-paint']?.numericValue || null,
      speedIndex: report.audits['speed-index']?.numericValue || null,
      interactive: report.audits['interactive']?.numericValue || null,
      lastAnalyzed: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Errore nell'analisi di ${url}:`, error.message);
    return {
      performanceScore: null,
      accessibilityScore: null,
      seoScore: null,
      bestPracticesScore: null,
      loadTime: null,
      firstPaint: null,
      lastAnalyzed: new Date().toISOString(),
      error: error.message
    };
  } finally {
    if (browser) await browser.close();
  }
}

async function main() {
  console.log('🚀 Inizio analisi Lighthouse per tutte le pagine...');

  // 🔹 Leggi il report precedente per mantenere i previousScore
  let previousData = {};
  if (fs.existsSync(PREVIOUS_REPORT_PATH)) {
    try {
      const rawData = fs.readFileSync(PREVIOUS_REPORT_PATH, 'utf8');
      const json = JSON.parse(rawData);
      previousData = json.pages.reduce((acc, page) => {
        acc[page.url] = {
          performanceScore: page.performanceScore || null,
          accessibilityScore: page.accessibilityScore || null,
          seoScore: page.seoScore || null,
          bestPracticesScore: page.bestPracticesScore || null
        };
        return acc;
      }, {});
      console.log(`✅ Caricati i dati precedenti per ${Object.keys(previousData).length} pagine`);
    } catch (err) {
      console.warn('⚠️ Errore nel parsing del report precedente:', err.message);
    }
  } else {
    console.log('🟡 Nessun report precedente trovato');
  }

  // 🔹 Analizza ogni pagina
  const results = [];
  for (const page of PAGES) {
    console.log(`🔍 Analisi in corso: ${page.url}`);
    const lighthouseData = await runLighthouse(page.url);

    // 🔁 Recupera i punteggi precedenti
    const prev = previousData[page.url] || {};

    // 🔗 Unisci tutti i dati
    const fullPageData = {
      url: page.url,
      label: page.label,
      slug: page.slug,
      category: page.category,
      ...lighthouseData,
      // ✅ Aggiungi i previousScore per il trend
      previousPerformanceScore: prev.performanceScore,
      previousAccessibilityScore: prev.accessibilityScore,
      previousSeoScore: prev.seoScore,
      previousBestPracticesScore: prev.bestPracticesScore
    };

    results.push(fullPageData);
  }

  // 🔹 Crea il report finale
  const finalReport = {
    lastUpdated: new Date().toISOString(),
    summary: {
      totalPages: PAGES.length,
      analyzed: results.filter(r => !r.error).length,
      failed: results.filter(r => r.error).length,
      ...(results.filter(r => !r.error).length > 0 && {
        averagePerformance: Math.round(
          results
            .filter(r => r.performanceScore !== null)
            .reduce((sum, r) => sum + r.performanceScore, 0) / results.filter(r => r.performanceScore !== null).length
        ),
        averageAccessibility: Math.round(
          results
            .filter(r => r.accessibilityScore !== null)
            .reduce((sum, r) => sum + r.accessibilityScore, 0) / results.filter(r => r.accessibilityScore !== null).length
        )
      })
    },
    pages: results
  };

  // 🔹 Salva il nuovo report
  const OUTPUT_PATH = path.join(__dirname, 'performance-data.json');
  try {
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalReport, null, 2), 'utf8');
    console.log(`✅ Report generato con successo: ${OUTPUT_PATH}`);
    console.log(`📈 Pagine analizzate: ${finalReport.summary.analyzed}/${finalReport.summary.totalPages}`);
    if (finalReport.summary.failed > 0) {
      console.warn(`⚠️  Pagine fallite: ${finalReport.summary.failed}`);
    }
  } catch (err) {
    console.error('❌ Errore nel salvataggio del report:', err.message);
    process.exit(1);
  }
}

// 🚀 Esegui
main().catch(err => {
  console.error('❌ Errore fatale:', err);
  process.exit(1);
});   