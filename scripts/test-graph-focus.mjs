import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRequire } from 'node:module';
import { focusConstellation } from '../src/model/graphFocus.ts';
const { Graph } = createRequire(import.meta.url)('react-d3-graph');
const graph = {
  nodes: [1, 2, 3, 4, 5, 6, 7].map((id) => ({
    id: String(id),
    x: 80 + id * 25,
    y: 120 + (id % 3) * 70,
  })),
  links: [
    { source: '2', target: '3' },
    { source: '4', target: '5' },
  ],
};
const bright = (data) =>
  data.nodes
    .filter((node) => node.opacity > 0.5)
    .map((node) => node.id)
    .sort();

test('open detail highlights its star and direct relation without requiring a sidebar hover', () => {
  const data = focusConstellation(graph, '4', null);
  assert.deepEqual(bright(data), ['4', '5']);
  assert.equal(data.nodes.find((n) => n.id === '4').opacity, 1);
  assert(data.links.find((e) => e.source === '4').opacity > 0.9);
  assert(data.links.find((e) => e.source === '2').opacity < 0.1);
});
test('a hovered star does not replace the currently open detail focus', () => {
  assert.deepEqual(bright(focusConstellation(graph, '4', '2')), ['4', '5']);
  assert.deepEqual(bright(focusConstellation(graph, '2', '4')), ['2', '3']);
});
test('overview hover highlights the related constellation and mouse-out restores the overview', () => {
  assert.deepEqual(bright(focusConstellation(graph, null, '2')), ['2', '3']);
  assert.equal(bright(focusConstellation(graph, null, null)).length, 7);
});
test('an isolated project lights only itself and leaves all connecting lines dim', () => {
  const data = focusConstellation(graph, '1', null);
  assert.deepEqual(bright(data), ['1']);
  assert(data.links.every((edge) => edge.opacity < 0.1));
});
test('D3 object endpoints retain the same direct-connection focus', () => {
  const data = focusConstellation(
    {
      ...graph,
      links: [
        { source: { id: 2 }, target: { id: 3 } },
        { source: 4, target: 5 },
      ],
    },
    '3',
    null,
  );
  assert.deepEqual(bright(data), ['2', '3']);
  assert.equal(data.links[0].opacity, 0.95);
});
test('the actual graph renderer uses the focused image and line opacities', () => {
  const data = focusConstellation(graph, '4', null);
  const html = renderToStaticMarkup(
    React.createElement(Graph, {
      id: 'focus-check',
      data,
      config: {
        node: { svg: '/svgs/node.svg', opacity: 0.9, renderLabel: false },
        width: 400,
        height: 500,
        nodeHighlightBehavior: false,
        linkHighlightBehavior: false,
      },
    }),
  );
  assert.equal((html.match(/<image[^>]*opacity="0\.12"/g) || []).length, 5);
  assert.equal((html.match(/<image[^>]*opacity="1"/g) || []).length, 1);
  assert.equal((html.match(/<image[^>]*opacity="0\.85"/g) || []).length, 1);
  assert(html.includes('opacity:0.95'));
  assert(html.includes('opacity:0.04'));
});
