import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { launch } from 'chrome-launcher';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('tmp/qa', { recursive: true });
const chrome = await launch({
  chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
  chromePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
try {
  for (const formFactor of ['desktop', 'mobile']) {
    const result = await lighthouse(
      process.env.TEST_URL || 'http://127.0.0.1:3000',
      {
        port: chrome.port,
        output: ['html', 'json'],
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor,
        screenEmulation:
          formFactor === 'desktop'
            ? { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }
            : { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false },
      },
      formFactor === 'desktop' ? desktopConfig : undefined,
    );
    await writeFile(`tmp/qa/lighthouse-${formFactor}.html`, result.report[0]);
    await writeFile(`tmp/qa/lighthouse-${formFactor}.json`, result.report[1]);
    console.log(
      formFactor,
      JSON.stringify(
        Object.fromEntries(
          Object.entries(result.lhr.categories).map(([id, category]) => [
            id,
            Math.round(category.score * 100),
          ]),
        ),
      ),
    );
    console.log(
      'Metrics',
      JSON.stringify(
        Object.fromEntries(
          [
            'first-contentful-paint',
            'largest-contentful-paint',
            'total-blocking-time',
            'cumulative-layout-shift',
          ].map((id) => [id, result.lhr.audits[id].displayValue]),
        ),
      ),
    );
  }
} finally {
  await chrome.kill();
}
