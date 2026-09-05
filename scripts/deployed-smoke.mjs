import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:5173/';
console.log('[smoke] target:', url);
console.log(`[smoke] launching chromium...`);
const browser = await chromium.launch({
  channel: undefined,
  executablePath: '/Users/bikashtalukder/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
});
const ctx = await browser.newContext();
const pLogs = [];
const pErrors = [];
const pRequests = [];
const page = await ctx.newPage();
page.on('console', (m) => pLogs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => pErrors.push(`PAGEERROR ${e.message}\n${e.stack || ''}`));
page.on('requestfailed', (r) => pRequests.push(`FAILED ${r.url()} -> ${r.failure()?.errorText}`));
page.on('response', (r) => {
  if (r.status() >= 400) pRequests.push(`${r.status()} ${r.url()}`);
});
try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
} catch (e) {
  console.log('NAV_ERROR:', e.message);
}
await page.waitForTimeout(3000);
const rootLen = await page.evaluate(() => document.getElementById('root')?.innerHTML?.length ?? -1);
const bodyText = await page.evaluate(() => document.body.innerText);
console.log('TITLE:', await page.title());
console.log('ROOT_INNERHTML_LEN:', rootLen);
console.log('BODY_TEXT (first 600):', bodyText.replace(/\s+/g, ' ').slice(0, 600));
console.log('--- PAGE ERRORS ---');
for (const e of pErrors) console.log(e);
console.log('--- NON-2xx REQUESTS ---');
for (const r of pRequests) console.log(r);
console.log('--- CONSOLE (last 40) ---');
for (const l of pLogs.slice(-40)) console.log(l);
await browser.close();
