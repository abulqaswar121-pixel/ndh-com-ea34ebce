/** Read-only SSR smoke test. Run the dev server, then:
 * node scripts/check-family-pages.mjs [base-url]
 * Never submits enquiries or writes production data.
 */
import assert from 'node:assert/strict';
const base = process.argv[2] ?? 'http://localhost:3000';
const pages = [
  '/', '/about', '/contact', '/blog', '/terms', '/privacy',
  '/blog/finding-your-place-in-the-ndh-family',
  '/blog/before-your-school-adopts-a-digital-platform',
  '/blog/make-a-digital-resource-work-for-you',
];
for (const path of pages) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path}: expected HTTP 200`);
  const html = await response.text();
  assert.match(html, /class="family-footer"/, `${path}: shared footer`);
  for (const href of ['tel:+2349029932794', 'mailto:abunnajeeh7@gmail.com', 'mailto:support@ndh.com.ng', '/terms', '/privacy']) {
    assert.ok(html.includes(`href="${href}"`), `${path}: missing ${href}`);
  }
  assert.ok(html.includes('Marmaron Nufawa Western Bye Pass Sokoto, Nigeria'), `${path}: address`);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${path}: one page heading`);
  assert.equal((html.match(/class="gw-menu-trigger"/g) ?? []).length, 1, `${path}: one menu`);
  console.log(`PASS ${path}`);
}
