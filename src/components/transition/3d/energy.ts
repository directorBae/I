// Deterministic particles: no remote textures or post-processing dependencies.
const particles = Array.from({ length: 160 }, (_, i) => ({
  angle: i * 2.3999632297,
  radius: 0.35 + (((i * 73) % 157) / 157) * 0.8,
  speed: 0.55 + ((i * 31) % 113) / 113,
  seed: ((i * 0.6180339887) % 1 + 1) % 1,
}));

export type ThemeKey = 'B' | 'J' | 'W';
export type ThemeMix = Record<ThemeKey, number>;
type Rgb = [number, number, number];

// Business: honey and baked bread. Journey: a lone photon over still water.
// Work: the project constellation.
export const themes: Record<ThemeKey, { bg: Rgb; core: Rgb; halo: Rgb }> = {
  B: { bg: [17, 9, 2], core: [74, 38, 4], halo: [255, 168, 40] },
  J: { bg: [2, 8, 13], core: [8, 38, 52], halo: [130, 214, 240] },
  W: { bg: [4, 5, 14], core: [22, 24, 66], halo: [150, 170, 255] },
};
const keys: ThemeKey[] = ['B', 'J', 'W'];

function blend(mix: ThemeMix, pick: (key: ThemeKey) => Rgb): Rgb {
  const total = keys.reduce((sum, key) => sum + mix[key], 0) || 1;
  return [0, 1, 2].map((c) =>
    Math.round(
      keys.reduce((sum, key) => sum + pick(key)[c] * mix[key], 0) / total,
    ),
  ) as Rgb;
}
const rgba = ([r, g, b]: Rgb, a: number) =>
  `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;

type Frame = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  extent: number;
  charge: number;
  phase: number;
  time: number;
  flight: number;
};

function hexagon(ctx: CanvasRenderingContext2D, radius: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    if (i) ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
    else ctx.moveTo(radius, 0);
  }
  ctx.closePath();
}

// Sparks pulled inward through collapsing honeycomb rings; embers rise.
function drawBusiness({ ctx, width, height, extent, charge, phase, time }: Frame) {
  for (const p of particles) {
    const cycle = (p.radius + phase * p.speed * 1.3) % 1;
    const radius = (1 - cycle) * (1 - cycle) * extent + 16;
    const angle = p.angle + phase * 0.22;
    const tail =
      Math.min(95, (3 + charge * 40) * p.speed) * (radius / extent + 0.1);
    const dx = Math.cos(angle),
      dy = Math.sin(angle);
    ctx.strokeStyle = `rgba(255,${190 + Math.round(p.seed * 50)},110,${Math.min(0.7, (0.07 + charge * 0.65) * (1 - radius / (extent * 1.3)))})`;
    ctx.lineWidth = 0.5 + charge * 0.6;
    ctx.beginPath();
    ctx.moveTo(dx * radius, dy * radius);
    ctx.lineTo(dx * (radius + tail), dy * (radius + tail));
    ctx.stroke();
  }
  for (let i = 0; i < 4; i++) {
    const cycle = (phase * 0.8 + i * 0.25) % 1;
    ctx.save();
    ctx.rotate(phase * 0.1 + i * 0.12);
    ctx.strokeStyle = `rgba(255,170,40,${charge * 0.2 * Math.sin(cycle * Math.PI)})`;
    ctx.lineWidth = 1;
    hexagon(ctx, 60 + (1 - cycle) * extent * 0.6);
    ctx.stroke();
    ctx.restore();
  }
  for (let i = 0; i < 70; i++) {
    const p = particles[i];
    const rise = (p.radius + time * 0.05 * p.speed) % 1;
    const x = (p.seed - 0.5) * width + Math.sin(time * p.speed + i) * 14;
    const y = height * (0.6 - rise * 1.25);
    const flicker = 0.55 + 0.45 * Math.sin(time * 5 * p.speed + i * 1.7);
    ctx.fillStyle = `rgba(255,${150 + Math.round(p.seed * 70)},50,${(0.12 + charge * 0.5) * flicker * Math.sin(rise * Math.PI)})`;
    ctx.beginPath();
    ctx.arc(x, y, 0.8 + p.seed * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Photons wander out along bending paths; ripples spread like a dropped stone.
function drawJourney({ ctx, extent, charge, phase, time, flight }: Frame) {
  particles.forEach((p, i) => {
    const cycle = (p.radius + phase * 0.32 * p.speed) % 1;
    const radius = 24 + cycle * extent * (1 - flight * 0.45);
    const bend = (i % 2 ? 1 : -1) * (0.9 + p.seed);
    const angle = p.angle + cycle * bend;
    const trail = 0.05 + charge * 0.2;
    const alpha = (0.1 + charge * 0.6) * Math.sin(cycle * Math.PI);
    ctx.strokeStyle = `rgba(170,228,255,${alpha * 0.8})`;
    ctx.lineWidth = 0.6 + charge * 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, angle - trail * Math.sign(bend), angle, bend < 0);
    ctx.stroke();
    ctx.fillStyle = `rgba(225,248,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0.9 + p.seed * 1.1,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  });
  ctx.save();
  ctx.scale(1, 0.36);
  for (let i = 0; i < 5; i++) {
    const cycle = (time * 0.11 + phase * 0.5 + i / 5) % 1;
    ctx.strokeStyle = `rgba(150,220,240,${(0.05 + charge * 0.22) * (1 - cycle)})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, extent * 0.55, 40 + cycle * extent * 0.9, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// Twinkling stars linked into constellations, warping inward on departure.
function drawWork({ ctx, extent, charge, phase, time, flight }: Frame) {
  const stars = particles.slice(0, 90).map((p, i) => {
    const spread = (p.radius - 0.35) / 0.8;
    const radius = (0.1 + spread * 0.9) * extent * (1 - flight * 0.5);
    const angle = p.angle + phase * 0.06 * (1 + p.seed);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      radius,
      angle,
      glow: 0.55 + 0.45 * Math.sin(time * 2.4 * p.speed + i * 2.1),
      size: 0.9 + p.speed * 1.1,
    };
  });
  ctx.lineWidth = 0.6;
  for (let i = 0; i < stars.length; i++)
    for (let j = i + 1; j < stars.length; j++) {
      const a = stars[i],
        b = stars[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance > 150) continue;
      ctx.strokeStyle = `rgba(150,175,255,${(1 - distance / 150) * (0.1 + charge * 0.25)})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  for (const star of stars) {
    if (flight > 0.05) {
      const tail = flight * flight * 120 * (star.radius / extent);
      ctx.strokeStyle = `rgba(210,222,255,${0.15 + flight * 0.4})`;
      ctx.lineWidth = star.size * 0.7;
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(
        star.x + Math.cos(star.angle) * tail,
        star.y + Math.sin(star.angle) * tail,
      );
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(225,233,255,${(0.4 + charge * 0.6) * star.glow})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.rotate(-0.35 + i * 0.4 + phase * 0.05);
    ctx.scale(1, 0.3 + i * 0.08);
    ctx.strokeStyle = `rgba(150,170,255,${0.04 + charge * 0.12})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, 120 + i * extent * 0.22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

const painters: Record<ThemeKey, (frame: Frame) => void> = {
  B: drawBusiness,
  J: drawJourney,
  W: drawWork,
};

export function drawEnergy(
  canvas: HTMLCanvasElement,
  progress: number,
  reduced: boolean,
  center: { x: number; y: number } | undefined,
  mix: ThemeMix,
  time: number,
  motion?: { strength: number },
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = Math.min(window.devicePixelRatio, 1.5);
  if (
    canvas.width !== Math.round(width * ratio) ||
    canvas.height !== Math.round(height * ratio)
  ) {
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
  }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const cx = center?.x ?? width / 2,
    cy = center?.y ?? height / 2;
  const extent = Math.hypot(width, height) * 0.58;
  const charge = motion
    ? Math.max(0.08, motion.strength)
    : Math.pow(progress, 0.7);
  const flight = motion ? 0 : progress;
  // Phase keeps flowing from the drag into the departure, then accelerates.
  const phase = time * 0.24 + flight * 0.9;
  const bg = blend(mix, (key) => themes[key].bg);
  const core = blend(mix, (key) => themes[key].core);
  const halo = blend(mix, (key) => themes[key].halo);
  const ground = ctx.createRadialGradient(cx, cy, 0, cx, cy, extent);
  ground.addColorStop(0, rgba(core, 0.55 + charge * 0.45));
  ground.addColorStop(0.55, rgba(bg, 1));
  ground.addColorStop(1, rgba(bg, 1));
  ctx.fillStyle = ground;
  ctx.fillRect(0, 0, width, height);
  const glow = ctx.createRadialGradient(cx, cy, 8, cx, cy, 220 + charge * 220);
  glow.addColorStop(0, rgba(halo, 0.08 + charge * 0.2));
  glow.addColorStop(0.35, rgba(halo, charge * 0.08));
  glow.addColorStop(1, rgba(halo, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  if (reduced) return;
  ctx.save();
  ctx.translate(cx, cy);
  const frame = { ctx, width, height, extent, charge, phase, time, flight };
  for (const key of keys) {
    if (mix[key] < 0.01) continue;
    ctx.globalAlpha = mix[key];
    painters[key](frame);
  }
  ctx.globalAlpha = 1;
  // A single restrained pressure wave at the end, rather than flashing.
  if (flight > 0.84) {
    const pulse = (flight - 0.84) / 0.16;
    ctx.strokeStyle = rgba(halo, (1 - pulse) * 0.3);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 38 + pulse * extent * 0.5, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}
