import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(repositoryRoot, 'index.html'), 'utf8');

test('landing page has its required entry points', () => {
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /href="\.\/styles\.css"/);
  assert.match(html, /src="\.\/script\.js"/);
});

test('all local HTML assets exist inside the repository', () => {
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((reference) => !reference.startsWith('#') && !reference.includes('://'));

  assert.ok(references.length > 2, 'expected local assets in index.html');

  for (const reference of references) {
    const assetPath = resolve(repositoryRoot, reference.replace(/^\.\//, ''));
    assert.ok(assetPath.startsWith(`${repositoryRoot}/`), `${reference} escapes the repository`);
    assert.ok(existsSync(assetPath), `${reference} does not exist`);
  }
});
