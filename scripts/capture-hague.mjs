import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = 'https://hague-export.lovable.app';
const OUT = path.resolve('.arena-captures');
const IMG = path.join(OUT, 'images');
await fs.mkdir(IMG, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  colorScheme: 'light',
});
const page = await context.newPage();
const report = { capturedAt: new Date().toISOString(), publicPages: [], homeSections: [], workspaces: {} };

const cleanName = (value) => value.replace(/^https?:\/\/[^/]+\/?/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home';
const settle = async (p = page) => {
  await p.waitForLoadState('domcontentloaded');
  await p.waitForTimeout(1400);
  await p.addStyleTag({ content: `
    *, *::before, *::after { animation-duration: 0s !important; animation-delay: 0s !important; transition-duration: 0s !important; caret-color: transparent !important; }
    html { scroll-behavior: auto !important; }
  `}).catch(() => {});
};
const snapshotData = async (p = page) => p.evaluate(() => ({
  url: location.href,
  title: document.title,
  headings: [...document.querySelectorAll('h1,h2,h3')].map((el) => ({ level: el.tagName, text: el.innerText.trim() })).filter((x) => x.text),
  links: [...document.querySelectorAll('a[href]')].map((a) => ({ text: a.innerText.trim(), href: a.href })).filter((x) => x.text || x.href),
  buttons: [...document.querySelectorAll('button')].map((b) => b.innerText.trim()).filter(Boolean),
  bodyText: document.body.innerText,
}));
const fullPage = async (name, p = page) => {
  const file = path.join(IMG, `${name}.jpg`);
  await p.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 84, animations: 'disabled' });
  return path.relative(OUT, file);
};
const viewportShot = async (name, p = page) => {
  const file = path.join(IMG, `${name}.jpg`);
  await p.screenshot({ path: file, fullPage: false, type: 'jpeg', quality: 88, animations: 'disabled' });
  return path.relative(OUT, file);
};
const elementShot = async (name, selector, p = page) => {
  const loc = p.locator(selector).first();
  if (!(await loc.count()) || !(await loc.isVisible().catch(() => false))) return null;
  const file = path.join(IMG, `${name}.png`);
  await loc.scrollIntoViewIfNeeded();
  await p.waitForTimeout(200);
  await loc.screenshot({ path: file, animations: 'disabled' });
  return path.relative(OUT, file);
};

// Homepage: a clean full-page capture plus each visible section.
await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
await settle();
report.homeFullPage = await fullPage('00-home-full');
for (const [name, selector] of [
  ['01-home-header', 'header'],
  ['02-home-live-prices', 'header + *'],
]) {
  const image = await elementShot(name, selector);
  if (image) report.homeSections.push({ name, selector, image });
}
const sectionCount = await page.locator('section').count();
for (let i = 0; i < sectionCount; i += 1) {
  const locator = page.locator('section').nth(i);
  const heading = ((await locator.locator('h1,h2,h3').first().innerText().catch(() => '')) || `Section ${i + 1}`).trim();
  const name = `${String(i + 3).padStart(2, '0')}-home-${cleanName(heading).slice(0, 44)}`;
  const file = path.join(IMG, `${name}.png`);
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await locator.screenshot({ path: file, animations: 'disabled' });
  report.homeSections.push({ index: i + 1, heading, selector: `section:nth-of-type(${i + 1})`, image: path.relative(OUT, file) });
}
const footerImage = await elementShot(`${String(sectionCount + 3).padStart(2, '0')}-home-footer`, 'footer');
if (footerImage) report.homeSections.push({ name: 'Footer', selector: 'footer', image: footerImage });

// Capture the AI assistant opened as a distinct interactive feature.
await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
await settle();
const kemiButton = page.getByRole('button', { name: /Hi! I'm Kemi|Kemi/i }).last();
if (await kemiButton.count()) {
  await kemiButton.click().catch(() => {});
  await page.waitForTimeout(500);
  report.kemiAssistant = await viewportShot('14-kemi-ai-assistant-open');
}

// Core public pages.
const publicPaths = ['/marketplace', '/product/sesame-seeds', '/how-it-works', '/verification', '/membership', '/about', '/register', '/sign-in'];
let publicIndex = 20;
for (const route of publicPaths) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await settle();
  const data = await snapshotData();
  const image = await fullPage(`${String(publicIndex).padStart(2, '0')}-${cleanName(route)}`);
  report.publicPages.push({ route, image, ...data });
  publicIndex += 1;
}

// Marketplace controls close-up.
await page.goto(`${BASE}/marketplace`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await settle();
report.marketplaceControls = await viewportShot('28-marketplace-search-filter-controls');

// Product RFQ interaction for a signed-in buyer is captured later.

async function openDemo(role) {
  await page.goto(`${BASE}/sign-in`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await settle();
  const pattern = role === 'exporter' ? /Top-Tier Exporter/i : /Global Commodity Buyer/i;
  const button = page.getByRole('button', { name: pattern });
  await button.click();
  await page.waitForTimeout(1800);
  await settle();
}

async function captureWorkspace(role, startIndex) {
  await openDemo(role);
  const landing = await snapshotData();
  const workspace = { landing, pages: [] };
  const landingImage = await fullPage(`${startIndex}-${role}-workspace-overview`);
  workspace.pages.push({ label: 'Workspace overview', route: new URL(page.url()).pathname, image: landingImage, ...landing });

  // Discover same-origin workspace links from the visible sidebar/navigation.
  const discovered = await page.evaluate((base) => {
    const current = new URL(location.href);
    const seen = new Map();
    for (const a of document.querySelectorAll('a[href]')) {
      const u = new URL(a.href, location.href);
      if (u.origin !== base) continue;
      const text = a.innerText.trim();
      if (!text) continue;
      if (['/', '/marketplace', '/how-it-works', '/verification', '/membership', '/about', '/register', '/sign-in'].includes(u.pathname)) continue;
      seen.set(u.pathname + u.search, { route: u.pathname + u.search, label: text });
    }
    return [...seen.values()];
  }, BASE);
  workspace.discoveredLinks = discovered;

  let i = Number(startIndex) + 1;
  const visited = new Set([new URL(page.url()).pathname]);
  for (const item of discovered.slice(0, 12)) {
    if (visited.has(item.route)) continue;
    visited.add(item.route);
    await page.goto(`${BASE}${item.route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await settle();
    if (page.url().includes('/sign-in')) {
      await openDemo(role);
      await page.goto(`${BASE}${item.route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await settle();
    }
    const data = await snapshotData();
    const image = await fullPage(`${String(i).padStart(2, '0')}-${role}-${cleanName(item.route)}`);
    workspace.pages.push({ label: item.label, route: item.route, image, ...data });
    i += 1;
  }
  return { workspace, nextIndex: i };
}

const exporterResult = await captureWorkspace('exporter', '30');
report.workspaces.exporter = exporterResult.workspace;
const buyerStart = Math.max(45, exporterResult.nextIndex);
const buyerResult = await captureWorkspace('buyer', String(buyerStart));
report.workspaces.buyer = buyerResult.workspace;

// Capture the structured RFQ modal while authenticated as the buyer.
await page.goto(`${BASE}/product/sesame-seeds`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await settle();
const rfq = page.getByRole('button', { name: /Request Formal Quotation|Request Quote/i }).first();
if (await rfq.count()) {
  await rfq.click().catch(() => {});
  await page.waitForTimeout(700);
  const dialog = page.getByRole('dialog');
  if (await dialog.count()) {
    const file = path.join(IMG, '60-buyer-structured-rfq-form.png');
    await dialog.screenshot({ path: file, animations: 'disabled' });
    report.rfqDialog = { image: path.relative(OUT, file), text: await dialog.innerText() };
  } else {
    report.rfqAfterClick = { url: page.url(), image: await viewportShot('60-buyer-rfq-after-click') };
  }
}

await fs.writeFile(path.join(OUT, 'site-report.json'), JSON.stringify(report, null, 2));
await browser.close();
console.log(`Captured ${report.homeSections.length} homepage parts, ${report.publicPages.length} public pages, ${report.workspaces.exporter.pages.length} exporter pages, and ${report.workspaces.buyer.pages.length} buyer pages.`);
