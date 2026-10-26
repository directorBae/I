import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const require = createRequire(import.meta.url);
const rows = Object.fromEntries(
  [1, 2, 3, 4, 36, 6, 7].map((id) => [
    String(id),
    JSON.parse(
      fs.readFileSync(
        new URL(
          `../public/jsons/work/articles/${String(id).padStart(3, '0')}.json`,
          import.meta.url,
        ),
        'utf8',
      ),
    ),
  ]),
);
function load(file, mocks = {}, globals = {}) {
  const source = fs.readFileSync(new URL(file, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  const mockedRequire = (id) =>
    Object.hasOwn(mocks, id)
      ? mocks[id]
      : id.endsWith('.module.css')
        ? new Proxy(
            {},
            { get: (_, key) => (key === '__esModule' ? false : String(key)) },
          )
        : require(id);
  vm.runInNewContext(code, {
    module,
    exports: module.exports,
    require: mockedRequire,
    ...globals,
  });
  return module.exports;
}
test('star links use the existing detail selection and preserve modified clicks', () => {
  const selected = [];
  const { StarLink } = load('../src/app/work/components/StarLink.tsx', {
    '@/context/GraphContext': {
      useGraphState: () => ({ clickNode: (id) => selected.push(id) }),
    },
  });
  const link = StarLink({ href: '/work?id=36', children: 'LoL' });
  let prevented = 0;
  link.props.onClick({ button: 0, preventDefault: () => prevented++ });
  assert.equal(prevented, 1);
  assert.deepEqual(selected, ['36']);
  link.props.onClick({
    button: 0,
    ctrlKey: true,
    preventDefault: () => prevented++,
  });
  assert.equal(selected.length, 1);
  assert.equal(prevented, 1);
  const markup = renderToStaticMarkup(link);
  assert(markup.includes('data-star-link="true"'));
  assert(markup.includes('<svg'));
  assert(markup.includes('viewBox="0 0 24 24"'));
});
test('detail-to-detail selection changes URL through native history without a route reload', () => {
  const history = [],
    updates = [];
  let stateIndex = 0;
  const window = {
    location: { pathname: '/work', search: '?id=4' },
    history: { pushState: (_, __, url) => history.push(url) },
  };
  const { GraphStateProvider } = load(
    '../src/context/GraphContext.tsx',
    {
      react: {
        ...React,
        useState: (initial) => {
          const index = stateIndex++;
          return [
            index === 5 ? rows : initial,
            (value) => updates.push({ index, value }),
          ];
        },
        useEffect: () => {},
        useCallback: (fn) => fn,
      },
      'next/navigation': { useSearchParams: () => new URLSearchParams('id=4') },
      '@/model/graph': class {},
    },
    { window },
  );
  const context = GraphStateProvider({ children: null }).props.value;
  context.clickNode('36');
  assert.equal(history[0], '/work?id=36');
  assert(updates.some((x) => x.index === 0 && x.value === '36'));
  context.clickNode('8');
  assert.equal(history.length, 1, 'removed Pando cannot be opened');
});
test('changing project preserves the same animated panel identity', () => {
  const react = {
    ...React,
    useEffect: () => {},
    useRef: () => ({ current: null }),
  };
  const empty = () => null;
  const { Article } = load('../src/app/work/components/article.tsx', {
    react,
    'framer-motion': { AnimatePresence: 'div', motion: { aside: 'aside' } },
    'next/image': empty,
    '@/context/GraphContext': {
      useGraphState: () => ({
        contentsData: rows,
        setHoveredNode: () => {},
        closeProject: () => {},
        parseNearbyNodesWithTitle: () => [],
      }),
    },
    '@public/svgs/swipeHolder.svg': {},
    '@/components/ui/renderer/MdRenderer': empty,
    '@/components/ui/assets/clipLoader': empty,
    './StarLink': { StarLink: empty },
  });
  const first = Article({ id: '4' }).props.children,
    second = Article({ id: '36' }).props.children;
  assert.equal(first.key, second.key);
  assert.equal(first.type, second.type);
  assert.notEqual(first.props['aria-label'], second.props['aria-label']);
});
