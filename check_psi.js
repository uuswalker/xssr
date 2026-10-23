const https = require('https');

async function getPSI(strategy) {
  const url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https%3A%2F%2Fxlhomesolo.com%2F&strategy=' + strategy + '&category=performance&category=accessibility&category=best-practices&category=seo';
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

(async () => {
  try {
    console.log('Fetching Mobile PSI...');
    const mobile = await getPSI('mobile');
    if (mobile.error) {
      console.error('Mobile Error:', JSON.stringify(mobile.error));
    } else {
      const cats = mobile.lighthouseResult.categories;
      console.log('=== MOBILE SCORES ===');
      console.log('Performance:', cats.performance ? Math.round(cats.performance.score * 100) : 'N/A');
      console.log('Accessibility:', cats.accessibility ? Math.round(cats.accessibility.score * 100) : 'N/A');
      console.log('Best Practices:', cats['best-practices'] ? Math.round(cats['best-practices'].score * 100) : 'N/A');
      console.log('SEO:', cats.seo ? Math.round(cats.seo.score * 100) : 'N/A');
      
      const audits = mobile.lighthouseResult.audits;
      console.log('\n--- Core Web Vitals (Mobile) ---');
      console.log('FCP:', audits['first-contentful-paint']?.displayValue);
      console.log('LCP:', audits['largest-contentful-paint']?.displayValue);
      console.log('TBT:', audits['total-blocking-time']?.displayValue);
      console.log('CLS:', audits['cumulative-layout-shift']?.displayValue);
      console.log('Speed Index:', audits['speed-index']?.displayValue);

      console.log('\n--- Failing / Warning Audits (Mobile) ---');
      for (const [key, audit] of Object.entries(audits)) {
        if (audit.score !== null && audit.score < 0.95 && audit.scoreDisplayMode !== 'notApplicable' && audit.scoreDisplayMode !== 'informative') {
          console.log('[' + audit.score + '] ' + audit.title + ' (' + key + '): ' + (audit.displayValue || ''));
          if (audit.explanation) console.log('   Explanation: ' + audit.explanation);
          if (audit.details && audit.details.items && audit.details.items.length) {
            console.log('   Items:', JSON.stringify(audit.details.items.slice(0, 5)));
          }
        }
      }
    }

    console.log('\nFetching Desktop PSI...');
    const desktop = await getPSI('desktop');
    if (desktop.error) {
      console.error('Desktop Error:', JSON.stringify(desktop.error));
    } else {
      const cats = desktop.lighthouseResult.categories;
      console.log('=== DESKTOP SCORES ===');
      console.log('Performance:', cats.performance ? Math.round(cats.performance.score * 100) : 'N/A');
      console.log('Accessibility:', cats.accessibility ? Math.round(cats.accessibility.score * 100) : 'N/A');
      console.log('Best Practices:', cats['best-practices'] ? Math.round(cats['best-practices'].score * 100) : 'N/A');
      console.log('SEO:', cats.seo ? Math.round(cats.seo.score * 100) : 'N/A');

      const audits = desktop.lighthouseResult.audits;
      console.log('\n--- Core Web Vitals (Desktop) ---');
      console.log('FCP:', audits['first-contentful-paint']?.displayValue);
      console.log('LCP:', audits['largest-contentful-paint']?.displayValue);
      console.log('TBT:', audits['total-blocking-time']?.displayValue);
      console.log('CLS:', audits['cumulative-layout-shift']?.displayValue);
      console.log('Speed Index:', audits['speed-index']?.displayValue);

      console.log('\n--- Failing / Warning Audits (Desktop) ---');
      for (const [key, audit] of Object.entries(audits)) {
        if (audit.score !== null && audit.score < 0.95 && audit.scoreDisplayMode !== 'notApplicable' && audit.scoreDisplayMode !== 'informative') {
          console.log('[' + audit.score + '] ' + audit.title + ' (' + key + '): ' + (audit.displayValue || ''));
          if (audit.explanation) console.log('   Explanation: ' + audit.explanation);
          if (audit.details && audit.details.items && audit.details.items.length) {
            console.log('   Items:', JSON.stringify(audit.details.items.slice(0, 5)));
          }
        }
      }
    }
  } catch(err) {
    console.error('Error:', err);
  }
})();
