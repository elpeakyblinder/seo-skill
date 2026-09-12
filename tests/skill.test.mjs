import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, mkdtempSync, cpSync, rmSync } from 'node:fs';
import { resolve, dirname, join, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skill = join(root, 'seo-production-guard');
const read = (path) => readFileSync(path, 'utf8');
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]);
}
function moduleFromGuide(name, context = {}) {
  const source = read(join(skill, 'references', name));
  const blocks = [...source.matchAll(/```typescript\n([\s\S]*?)\n```/g)]
    .map(match => match[1]).filter(block => block.includes('export function'));
  const code = stripTypeScriptTypes(blocks.join('\n')).replace(/export /g, '');
  const sandbox = { URL, ...context };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox;
}

test('the skill works as a standalone copied folder; every local link stays inside it', () => {
  const temp = mkdtempSync(join(tmpdir(), 'seo-skill-test-'));
  try {
    const copy = join(temp, 'seo-production-guard');
    cpSync(skill, copy, { recursive: true });
    for (const file of files(copy)) {
      const text = read(file);
      assert.ok(!text.includes('file:///'), file);
      for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
        const target = match[1];
        if (/^(https?:|mailto:|#)/.test(target)) continue;
        const path = resolve(dirname(file), target.split('#')[0]);
        const rel = relative(copy, path);
        assert.ok(rel !== '..' && !rel.startsWith('..' + sep), target);
        assert.ok(existsSync(path), `${file}: ${target}`);
      }
    }
  } finally { rmSync(temp, { recursive: true, force: true }); }
});

test('repository Markdown file links resolve', () => {
  for (const file of files(root).filter(p => p.endsWith('.md'))) {
    for (const match of read(file).matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(https?:|mailto:|#)/.test(match[1])) continue;
      assert.ok(existsSync(resolve(dirname(file), match[1].split('#')[0])), `${file}: ${match[1]}`);
    }
  }
});

test('README files contain no emoji or decorative emoji symbols', () => {
  const emoji = /[🀀-🫿☀-➿]/u;
  for (const name of ['README.md', 'README.en.md']) {
    assert.doesNotMatch(read(join(root, name)), emoji, name);
  }
});

test('localized README banners are present and accessible', () => {
  for (const [readme, banner] of [
    ['README.md', 'assets/banner.svg'],
    ['README.en.md', 'assets/banner.en.svg'],
  ]) {
    assert.ok(read(join(root, readme)).includes(`src="${banner}"`), readme);
    const svg = read(join(root, banner));
    assert.match(svg, /^<svg /);
    assert.match(svg, /role="img"/);
    assert.match(svg, /<title /);
    assert.match(svg, /<desc /);
  }
});

test('repository governance files and contribution templates are present', () => {
  for (const path of [
    'CONTRIBUTING.md',
    'SECURITY.md',
    'PUBLICAR.md',
    '.github/pull_request_template.md',
    '.github/ISSUE_TEMPLATE/bug_report.md',
    '.github/ISSUE_TEMPLATE/proposal.md',
    '.github/ISSUE_TEMPLATE/config.yml',
  ]) {
    assert.ok(existsSync(join(root, path)), path);
  }
});

test('release version and required frontmatter agree', () => {
  const text = read(join(skill, 'SKILL.md'));
  assert.match(text, /^---\nname: seo-production-guard\n/);
  const description = text.match(/^description: (.+)$/m)?.[1];
  assert.ok(description && description.length <= 1024);
  assert.equal(text.match(/version: "([^"]+)"/)?.[1], read(join(root, 'VERSION')).trim());
});

test('origin configuration normalizes hosts and refuses malformed or missing configuration', () => {
  const api = moduleFromGuide('nextjs-seo-guide.md', { process: { env: {} } });
  assert.equal(api.normalizeSiteUrl(' app.example.org ').href, 'https://app.example.org/');
  for (const bad of ['', 'http://example.org', 'https://u:p@example.org', 'https://example.org/path', 'https://example.org/?q=1', 'https://example.org/#x']) {
    assert.throws(() => api.normalizeSiteUrl(bad), bad);
  }
  assert.throws(() => api.getSiteUrl());
});

test('interior metadata preserves its canonical and declared image properties', () => {
  const api = moduleFromGuide('nextjs-seo-guide.md', { process: { env: {} } });
  const canonicalUrl = 'https://example.org/catalog?page=2';
  const image = { url: 'https://example.org/cover.png', width: 1200, height: 634, type: 'image/png', alt: 'Portada' };
  const result = api.buildPageMetadata({ title: 'Página dos', description: 'Contenido', canonicalUrl, siteName: 'Sitio', ogLocale: 'es_MX', image });
  assert.equal(result.alternates.canonical, canonicalUrl);
  assert.equal(result.openGraph.url, canonicalUrl);
  assert.equal(result.openGraph.images[0].height, 634);
  assert.equal(result.twitter.images[0].alt, image.alt);
  assert.ok(!('languages' in result.alternates));
});

test('sitemap preserves partial translations and does not invent modification dates', () => {
  const api = moduleFromGuide('nextjs-seo-guide.md', { process: { env: {} } });
  const pages = [{ canonicalUrl: 'https://example.org/es/uno', languages: { es: 'https://example.org/es/uno', en: 'https://example.org/en/one' } }, { canonicalUrl: 'https://example.org/es/dos', updatedAt: '2026-09-01' }];
  const result = api.buildSitemapEntries(pages);
  assert.equal(result.length, 2);
  assert.ok(!('lastModified' in result[0]));
  assert.equal(result[1].lastModified, '2026-09-01');
  assert.ok(!('alternates' in result[1]));
  assert.ok(!('fr' in result[0].alternates.languages));
});

test('JSON-LD escapes script termination without corrupting text or relationships', () => {
  const api = moduleFromGuide('structured-data-jsonld.md');
  const title = '</script><script>alert(1)</script> & café';
  const nodes = api.buildPageNodes({ siteUrl: 'https://example.org/', canonicalUrl: 'https://example.org/article/', siteName: 'Sitio', title, description: 'Texto', language: 'es' });
  const serialized = api.serializeJsonLd(api.buildGraph(nodes));
  assert.ok(!serialized.includes('<'));
  const result = JSON.parse(serialized);
  assert.equal(result['@context'], 'https://schema.org');
  assert.equal(result['@graph'][1].name, title);
  assert.equal(result['@graph'][1].isPartOf['@id'], result['@graph'][0]['@id']);
  assert.throws(() => api.serializeJsonLd(undefined));
});
