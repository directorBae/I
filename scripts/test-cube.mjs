import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Vector3, Quaternion } from 'three';
import {
  cubeFaces,
  initialCubeRotation,
  rotateCube,
  resolveCubeFace,
  faceCubeRotation,
  cubeTransitionFrame,
  cubeHoverImpulse,
} from '../src/components/transition/3d/interaction.ts';

test('all six faces select their correct page without flipping to the opposite face', () => {
  for (const face of cubeFaces) {
    const selected = resolveCubeFace(faceCubeRotation(face.id));
    assert.equal(selected?.id, face.id);
    assert.equal(selected?.href, face.href);
  }
});
test('drag rotations expose B, J and W while preserving normalized rotation', () => {
  for (const [x, y, key] of [
    [52, -42, 'B'],
    [52, 90, 'J'],
    [-80, 0, 'W'],
  ]) {
    const rotation = rotateCube(initialCubeRotation, { x, y });
    assert.equal(resolveCubeFace(rotation)?.key, key);
    assert(
      Math.abs(Math.hypot(rotation.x, rotation.y, rotation.z, rotation.w) - 1) <
        1e-10,
    );
  }
});
test('edges do not navigate; the back face now also selects B', () => {
  assert.equal(resolveCubeFace(initialCubeRotation), null);
  assert.equal(
    resolveCubeFace({
      x: 0,
      y: Math.sin(Math.PI / 8),
      z: 0,
      w: Math.cos(Math.PI / 8),
    }),
    null,
  );
  assert.equal(resolveCubeFace({ x: 0, y: 1, z: 0, w: 0 })?.id, 'B_back');
});
test('hover recoils briefly, settles and respects reduced motion', () => {
  assert.equal(cubeHoverImpulse(0), 0);
  assert(cubeHoverImpulse(40) > 0.4);
  assert(cubeHoverImpulse(150) < 0);
  assert(Math.abs(cubeHoverImpulse(550)) < 0.01);
  assert.equal(cubeHoverImpulse(700), 0);
  assert.equal(cubeHoverImpulse(40, true), 0);
});
test('face alignment and pressure complete without a recoloring phase', () => {
  assert.equal(cubeTransitionFrame(0).complete, false);
  assert.equal('inversion' in cubeTransitionFrame(260), false);
  assert.equal(cubeTransitionFrame(300).focus, 1);
  assert(cubeTransitionFrame(700).compression < 1);
  assert.equal(cubeTransitionFrame(1450).complete, true);
  assert.equal(cubeTransitionFrame(100, true).compression, 1);
  assert.equal(cubeTransitionFrame(220, true).complete, true);
});
test('GLB contains six real raised surfaces that fill the faces, with no textures', async () => {
  const bytes = await readFile(
    new URL('../public/models/bjw.glb', import.meta.url),
  );
  assert(bytes.length < 64 * 1024);
  assert.equal(bytes.toString('utf8', 0, 4), 'glTF');
  assert.equal(bytes.readUInt32LE(8), bytes.length);
  const json = JSON.parse(
    bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)),
  );
  assert.equal(json.images, undefined);
  assert.equal(json.textures, undefined);
  assert.equal(
    json.materials.length,
    2,
    'white body and contrasting black relief',
  );
  const { scene } = await new GLTFLoader().parseAsync(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    '',
  );
  scene.updateMatrixWorld(true);
  const body = scene.getObjectByName('Cube');
  assert.equal(body.material.color.getHex(), 0xfafafa);
  let letters = 0;
  scene.traverse((mesh) => {
    if (mesh.userData.kind === 'letter') letters++;
  });
  assert.equal(letters, 6);
  for (const face of cubeFaces) {
    const letter = scene.getObjectByName(face.id);
    assert(letter);
    assert.equal(letter.userData.href, face.href);
    assert.notEqual(letter.material, body.material);
    assert.equal(letter.material.color.getHex(), 0x101010);
    letter.geometry.computeBoundingBox();
    const size = letter.geometry.boundingBox.getSize(new Vector3());
    assert(
      size.x >= 1.29 && size.y >= 1.29,
      'raised type covers the full face',
    );
    assert(
      size.z > 0.27 && size.z < 0.34,
      'real extrusion depth, not a flat graphic',
    );
    const normal = new Vector3(0, 0, 1).transformDirection(letter.matrixWorld);
    assert(normal.distanceTo(new Vector3(...face.normal)) < 0.001);
    normal.applyQuaternion(new Quaternion().copy(faceCubeRotation(face.id)));
    assert(
      normal.distanceTo(new Vector3(0, 0, 1)) < 0.001,
      `${face.id} faces the camera`,
    );
  }
  console.log(`Relief GLB: ${(bytes.length / 1024).toFixed(1)} KB.`);
});
