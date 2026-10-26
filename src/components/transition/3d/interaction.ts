export const cubeDestinations = [
  { key: 'B', label: 'Business', href: '/business' },
  { key: 'J', label: 'Journey', href: '/journey' },
  { key: 'W', label: 'Work', href: '/work' },
] as const;
export type CubeDestination = (typeof cubeDestinations)[number];
export const cubeFaces = [
  { ...cubeDestinations[0], id: 'B', normal: [0, 0, 1] },
  { ...cubeDestinations[0], id: 'B_back', normal: [0, 0, -1] },
  { ...cubeDestinations[1], id: 'J', normal: [0, 1, 0] },
  { ...cubeDestinations[1], id: 'J_bottom', normal: [0, -1, 0] },
  { ...cubeDestinations[2], id: 'W', normal: [1, 0, 0] },
  { ...cubeDestinations[2], id: 'W_left', normal: [-1, 0, 0] },
] as const;
export type CubeFace = (typeof cubeFaces)[number];
export type Offset = { x: number; y: number };
export type CubeRotation = { x: number; y: number; z: number; w: number };

function multiply(a: CubeRotation, b: CubeRotation): CubeRotation {
  const q = {
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
  };
  const length = Math.hypot(q.x, q.y, q.z, q.w);
  return { x: q.x / length, y: q.y / length, z: q.z / length, w: q.w / length };
}
function yawPitch(yaw: number, pitch: number): CubeRotation {
  return multiply(
    { x: 0, y: Math.sin(yaw / 2), z: 0, w: Math.cos(yaw / 2) },
    { x: Math.sin(pitch / 2), y: 0, z: 0, w: Math.cos(pitch / 2) },
  );
}
export const initialCubeRotation = yawPitch(-0.62, 0.5);

// Dragging rotates the object around the screen's axes; its center never moves.
export function rotateCube(start: CubeRotation, delta: Offset): CubeRotation {
  return multiply(yawPitch(delta.x * 0.012, delta.y * 0.012), start);
}
export function resolveCubeFace(rotation: CubeRotation): CubeFace | null {
  const { x, y, z, w } = rotation;
  let best: CubeFace | null = null;
  let facing = Math.cos((24 * Math.PI) / 180);
  for (const destination of cubeFaces) {
    const [nx, ny, nz] = destination.normal;
    const forward =
      2 * (x * z - y * w) * nx +
      2 * (y * z + x * w) * ny +
      (1 - 2 * (x * x + y * y)) * nz;
    if (forward > facing) {
      facing = forward;
      best = destination;
    }
  }
  return best;
}
export function faceCubeRotation(key: CubeFace['id']): CubeRotation {
  if (key === 'B_back') return yawPitch(Math.PI, 0);
  if (key === 'J_bottom') return yawPitch(0, -Math.PI / 2);
  if (key === 'W_left') return yawPitch(Math.PI / 2, 0);
  if (key === 'J') return yawPitch(0, Math.PI / 2);
  if (key === 'W') return yawPitch(-Math.PI / 2, 0);
  return { x: 0, y: 0, z: 0, w: 1 };
}

export function cubeHoverImpulse(
  elapsed: number,
  reducedMotion = false,
): number {
  if (reducedMotion || elapsed < 0 || elapsed > 650) return 0;
  const time = elapsed / 1000;
  return Math.exp(-time * 11) * Math.sin(time * 32);
}

// Same rotation in the CSS fallback, accounting for CSS's downward Y axis.
export function cubeRotationCss({ x, y, z, w }: CubeRotation): string {
  return `matrix3d(${[
    1 - 2 * (y * y + z * z),
    -2 * (x * y + z * w),
    2 * (x * z - y * w),
    0,
    -2 * (x * y - z * w),
    1 - 2 * (x * x + z * z),
    -2 * (y * z + x * w),
    0,
    2 * (x * z + y * w),
    -2 * (y * z - x * w),
    1 - 2 * (x * x + y * y),
    0,
    0,
    0,
    0,
    1,
  ].join(',')})`;
}

export function cubeTransitionFrame(elapsed: number, reducedMotion = false) {
  const duration = reducedMotion ? 220 : 1450;
  const progress = Math.max(0, Math.min(1, elapsed / duration));
  const focus = 1 - Math.pow(1 - Math.min(1, progress / 0.2), 3);
  const compression = reducedMotion
    ? 1
    : 1 - 0.27 * Math.sin(progress * Math.PI * 0.85);
  return {
    progress,
    focus,
    compression,
    complete: elapsed >= duration,
  };
}
