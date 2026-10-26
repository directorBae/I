import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import {
  grainOpacity,
  GRAIN_HOLD_MS,
  GRAIN_FADE_MS,
} from '../src/components/transition/3d/grain.ts';

test('gold grains hold for two seconds then fade for one second', () => {
  assert.equal(GRAIN_HOLD_MS, 2000);
  assert.equal(GRAIN_FADE_MS, 1000);
  for (const age of [0, 1000, 1999, 2000]) assert.equal(grainOpacity(age), 1);
  assert(grainOpacity(2100) < 1);
  assert.equal(grainOpacity(2500), 0.5);
  assert.equal(grainOpacity(3000), 0);
});
test('Work articles have unique ids, valid links and no duplicate edges, and exclude Pando', async () => {
  const folder = new URL('../public/jsons/work/articles/', import.meta.url);
  const files = (await readdir(folder)).filter(
    (f) => f.endsWith('.json') && f !== 'template.json',
  );
  const rows = await Promise.all(
    files.map((f) => readFile(new URL(f, folder), 'utf8').then(JSON.parse)),
  );
  const ids = new Set(rows.map((row) => row.id)),
    pairs = new Set();
  assert.equal(ids.size, rows.length);
  const pair = (a, b) => [a, b].sort((a, b) => a - b).join(':');
  for (const row of rows) {
    assert(row.title && row.content.startsWith('# '));
    assert(!row.content.includes('Pando'));
    assert.notEqual(row.id, 8);
    for (const edge of row.edge) {
      assert(ids.has(edge.id));
      assert.notEqual(edge.id, row.id);
      assert(!pairs.has(pair(row.id, edge.id)));
      pairs.add(pair(row.id, edge.id));
    }
    for (const [, id] of row.content.matchAll(/\/work\?id=(\d+)/g))
      assert(ids.has(Number(id)));
  }
});
test('Business and Journey keep their original content', async () => {
  for (const [name, title] of [
    ['business', '허니브레드의 색상'],
    ['journey', '몽돌'],
  ]) {
    const data = JSON.parse(
      await readFile(
        new URL(`../public/jsons/${name}/${name}.json`, import.meta.url),
        'utf8',
      ),
    );
    assert.equal(data.popup.title, title);
    assert(data.contexts.length > 0);
    for (const section of data.contexts)
      assert.notEqual(section.context, '');
  }
});
