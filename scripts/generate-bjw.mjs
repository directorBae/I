// Texture-free sculpted cube: raised B, J and W on all six faces.
import { mkdir, writeFile } from 'node:fs/promises';
import {
  Scene,
  Group,
  Shape,
  Path,
  Mesh,
  ExtrudeGeometry,
  MeshStandardMaterial,
  Vector3,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onloadend?.();
    });
  }
};
const b = new Shape();
b.moveTo(0, 0);
b.lineTo(0, 1);
b.lineTo(0.43, 1);
b.bezierCurveTo(0.84, 1, 0.87, 0.58, 0.6, 0.51);
b.bezierCurveTo(0.94, 0.42, 0.86, 0, 0.44, 0);
b.closePath();
const upper = new Path();
upper.moveTo(0.23, 0.79);
upper.lineTo(0.23, 0.6);
upper.lineTo(0.42, 0.6);
upper.bezierCurveTo(0.6, 0.6, 0.6, 0.79, 0.42, 0.79);
upper.closePath();
const lower = new Path();
lower.moveTo(0.23, 0.41);
lower.lineTo(0.23, 0.21);
lower.lineTo(0.44, 0.21);
lower.bezierCurveTo(0.63, 0.21, 0.63, 0.41, 0.44, 0.41);
lower.closePath();
b.holes.push(upper, lower);
const j = new Shape();
j.moveTo(0.85, 1);
j.lineTo(0.85, 0.31);
j.bezierCurveTo(0.85, -0.13, 0.1, -0.13, 0.08, 0.3);
j.lineTo(0.32, 0.3);
j.bezierCurveTo(0.33, 0.12, 0.61, 0.13, 0.61, 0.32);
j.lineTo(0.61, 0.77);
j.lineTo(0.35, 0.77);
j.lineTo(0.35, 1);
j.closePath();
const w = new Shape();
[
  [0, 1],
  [0.25, 1],
  [0.4, 0.34],
  [0.6, 1],
  [0.82, 1],
  [1.02, 0.34],
  [1.17, 1],
  [1.42, 1],
  [1.16, 0],
  [0.9, 0],
  [0.71, 0.62],
  [0.52, 0],
  [0.26, 0],
].forEach(([x, y], i) => (i ? w.lineTo(x, y) : w.moveTo(x, y)));
w.closePath();
const scene = new Scene();
const cube = new Group();
cube.name = 'BJW_Cube';
scene.add(cube);
const bodyMaterial = new MeshStandardMaterial({
  color: 0xfafafa,
  metalness: 0.05,
  roughness: 0.34,
});
bodyMaterial.name = 'Cube_body';
const letterMaterial = new MeshStandardMaterial({
  color: 0x101010,
  metalness: 0.12,
  roughness: 0.3,
});
letterMaterial.name = 'Black_raised_type';
const bodyGeometry = new RoundedBoxGeometry(1.4, 1.4, 1.4, 2, 0.045);
bodyGeometry.deleteAttribute('uv');
bodyGeometry.normalizeNormals();
// One material for all six sides; remove BoxGeometry's redundant material groups.
bodyGeometry.clearGroups();
const body = new Mesh(mergeVertices(bodyGeometry), bodyMaterial);
body.name = 'Cube';
body.userData = { kind: 'body' };
cube.add(body);
for (const [letter, shape, href, faces] of [
  [
    'B',
    b,
    '/business',
    [
      ['B', [0, 0, 1], [0, 0, 0]],
      ['B_back', [0, 0, -1], [0, Math.PI, 0]],
    ],
  ],
  [
    'J',
    j,
    '/journey',
    [
      ['J', [0, 1, 0], [-Math.PI / 2, 0, 0]],
      ['J_bottom', [0, -1, 0], [Math.PI / 2, 0, 0]],
    ],
  ],
  [
    'W',
    w,
    '/work',
    [
      ['W', [1, 0, 0], [0, Math.PI / 2, 0]],
      ['W_left', [-1, 0, 0], [0, -Math.PI / 2, 0]],
    ],
  ],
]) {
  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.26,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.015,
    bevelSegments: 1,
    curveSegments: 7,
  });
  geometry.deleteAttribute('uv');
  geometry.computeBoundingBox();
  const size = geometry.boundingBox.getSize(new Vector3());
  const center = geometry.boundingBox.getCenter(new Vector3());
  geometry.translate(-center.x, -center.y, 0);
  geometry.scale(1.3 / size.x, 1.3 / size.y, 1);
  geometry.clearGroups();
  geometry.normalizeNormals();
  const solid = mergeVertices(geometry);
  for (const [id, normal, rotation] of faces) {
    const mesh = new Mesh(solid, letterMaterial);
    mesh.name = id;
    mesh.userData = {
      kind: 'letter',
      letter,
      href,
      faceNormal: normal,
      reliefDepth: 0.26,
    };
    mesh.rotation.set(...rotation);
    mesh.position.set(...normal).multiplyScalar(0.696);
    cube.add(mesh);
  }
}
scene.updateMatrixWorld(true);
const binary = await new GLTFExporter().parseAsync(scene, { binary: true });
await mkdir(new URL('../public/models/', import.meta.url), { recursive: true });
await writeFile(
  new URL('../public/models/bjw.glb', import.meta.url),
  Buffer.from(binary),
);
console.log(
  `BJW relief cube: ${(binary.byteLength / 1024).toFixed(1)} KB, white body, black 0.26-depth raised type, no textures`,
);
