'use client';

import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { grainOpacity, GRAIN_HOLD_MS, GRAIN_FADE_MS } from './grain';

type Grain = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  born: number;
  alpha: number;
  color: string;
};
const gold = ['#b48b3e', '#c6a25c', '#d0b077', '#a98342', '#debf82'];

export function GoldGrainCursor({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!mounted || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (!active) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    let width = window.innerWidth,
      height = window.innerHeight,
      frame = 0;
    let particles: Grain[] = [];
    let previous: { x: number; y: number; time: number } | null = null;
    let budget = 140,
      lastSample = performance.now(),
      seed = 314159;
    const eligibleAt = performance.now() + 280;
    const random = () => {
      seed = (1664525 * seed + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(2, window.devicePixelRatio);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    const draw = (now: number) => {
      frame = 0;
      ctx.clearRect(0, 0, width, height);
      particles = particles.filter(
        (p) => now - p.born < GRAIN_HOLD_MS + GRAIN_FADE_MS,
      );
      for (const p of particles) {
        const age = now - p.born;
        const settle = reduced.matches ? 0 : 1 - Math.exp(-age / 120);
        ctx.save();
        ctx.translate(p.x + p.vx * settle, p.y + p.vy * settle);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha * grainOpacity(age);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(-p.size * 0.65, -p.size * 0.3);
        ctx.lineTo(p.size * 0.4, -p.size * 0.8);
        ctx.lineTo(p.size, p.size * 0.25);
        ctx.lineTo(-p.size * 0.25, p.size * 0.55);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      if (particles.length) frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || document.hidden) return;
      const now = performance.now();
      if (now < eligibleAt) return;
      budget = Math.min(140, budget + (now - lastSample) * 0.9);
      lastSample = now;
      const start =
        previous && now - previous.time < 120
          ? previous
          : { x: event.clientX, y: event.clientY, time: now };
      const dx = event.clientX - start.x,
        dy = event.clientY - start.y,
        distance = Math.hypot(dx, dy);
      const count = Math.min(
        Math.floor(budget),
        110,
        Math.max(10, Math.ceil(distance * 3.2)),
      );
      const tx = distance ? dx / distance : 1,
        ty = distance ? dy / distance : 0;
      for (let i = 0; i < count; i++) {
        const t = random(),
          spread = (random() + random() + random() - 1.5) * 22;
        particles.push({
          x: start.x + dx * t - ty * spread + tx * (random() - 0.5) * 5,
          y: start.y + dy * t + tx * spread + ty * (random() - 0.5) * 5,
          vx: (random() - 0.5) * 4,
          vy: 3 + random() * 7,
          size: 0.4 + Math.pow(random(), 2) * 1.65,
          angle: random() * Math.PI * 2,
          born: now,
          alpha: 0.35 + random() * 0.45,
          color: gold[Math.floor(random() * gold.length)],
        });
      }
      budget -= count;
      previous = { x: event.clientX, y: event.clientY, time: now };
      // The rate limit keeps all grains for their full lifetime without dropping old ones.
      if (!frame && particles.length) frame = requestAnimationFrame(draw);
    };
    const clear = () => {
      previous = null;
      particles = [];
      cancelAnimationFrame(frame);
      frame = 0;
      ctx.clearRect(0, 0, width, height);
    };
    const visibility = () => {
      if (document.hidden) clear();
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
      clear();
    };
  }, [active, mounted]);

  return mounted
    ? createPortal(
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9998,
            mixBlendMode: 'multiply',
          }}
        />,
        document.body,
      )
    : null;
}
