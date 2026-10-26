'use client';

import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  cubeDestinations,
  initialCubeRotation,
  rotateCube,
  resolveCubeFace,
  faceCubeRotation,
  cubeRotationCss,
  type CubeFace,
  type CubeRotation,
} from './interaction';
import type { CubeScene } from './cube-scene';
import styles from './section.module.css';
import { GoldGrainCursor } from './GoldGrainCursor';
import { MeteorNews } from '@/components/ui/home/MeteorNews';

type Gesture = { id: number; x: number; y: number; start: CubeRotation };

export const D3Section = () => {
  const stage = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const energyCanvas = useRef<HTMLCanvasElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const runtime = useRef<CubeScene | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const rotation = useRef<CubeRotation>({ ...initialCubeRotation });
  const hovered = useRef(false);
  const busy = useRef(false);
  const flight = useRef<{ face: CubeFace['id']; started: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyboardTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startFrame = useRef(0);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [displayRotation, setDisplayRotation] = useState<CubeRotation>({
    ...initialCubeRotation,
  });
  const [departure, setDeparture] = useState<CubeFace | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const controller = new AbortController();
    const element = host.current;
    if (!element) return;
    import('./cube-scene')
      .then(({ createCubeScene }) =>
        createCubeScene(
          element,
          controller.signal,
          () => energyCanvas.current,
          () => hint.current,
          () => {
            runtime.current = null;
            setReady(false);
          },
        ),
      )
      .then((scene) => {
        if (controller.signal.aborted) {
          scene.dispose();
          return;
        }
        runtime.current = scene;
        scene.rotate(rotation.current);
        scene.interact(!!gesture.current);
        scene.hover(hovered.current);
        if (flight.current)
          scene.begin(flight.current.face, flight.current.started);
        setReady(true);
      })
      .catch(() => {
        if (!controller.signal.aborted) setReady(false);
      });
    return () => {
      controller.abort();
      runtime.current?.dispose();
      runtime.current = null;
    };
  }, []);

  const setRotation = (next: CubeRotation) => {
    rotation.current = next;
    setDisplayRotation(next);
    runtime.current?.rotate(next);
  };
  const setHover = (active: boolean) => {
    if (hovered.current === active) return;
    hovered.current = active;
    setHovering(active);
    runtime.current?.hover(active);
  };
  const cancelDrag = () => {
    const current = gesture.current;
    if (!current) return;
    gesture.current = null;
    setRotation(current.start);
    runtime.current?.interact(false);
    setDragging(false);
    setHover(false);
  };

  useEffect(() => {
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && gesture.current && !busy.current) {
        const previous = gesture.current.start;
        gesture.current = null;
        rotation.current = previous;
        setDisplayRotation(previous);
        runtime.current?.rotate(previous);
        runtime.current?.interact(false);
        setDragging(false);
      }
    };
    window.addEventListener('keydown', escape);
    return () => {
      window.removeEventListener('keydown', escape);
      if (timer.current) clearTimeout(timer.current);
      if (keyboardTimer.current) clearTimeout(keyboardTimer.current);
      cancelAnimationFrame(startFrame.current);
    };
  }, []);

  const leaveFor = (face: CubeFace) => {
    if (busy.current) return;
    busy.current = true;
    flight.current = { face: face.id, started: performance.now() };
    setDragging(false);
    setHover(false);
    setDeparture(face);
    router.prefetch(face.href);
    startFrame.current = requestAnimationFrame(() => {
      if (flight.current)
        runtime.current?.begin(flight.current.face, flight.current.started);
    });
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    timer.current = setTimeout(
      () => router.push(face.href),
      reduced ? 220 : 1450,
    );
  };
  const hitTest = (x: number, y: number) => {
    if (runtime.current) return runtime.current.hitTest(x, y);
    const rect = stage.current?.getBoundingClientRect();
    if (!rect) return false;
    const radius = Math.min(260, Math.min(rect.width, rect.height) * 0.36);
    return (
      Math.abs(x - rect.left - rect.width / 2) < radius &&
      Math.abs(y - rect.top - rect.height / 2) < radius
    );
  };
  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      busy.current ||
      gesture.current ||
      !event.isPrimary ||
      event.button !== 0 ||
      !hitTest(event.clientX, event.clientY)
    )
      return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus({ preventScroll: true });
    gesture.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      start: { ...rotation.current },
    };
    setHover(false);
    setDragging(true);
    runtime.current?.interact(true);
    cubeDestinations.forEach((destination) =>
      router.prefetch(destination.href),
    );
  };
  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (busy.current) return;
    const current = gesture.current;
    if (!current) {
      const hit = hitTest(event.clientX, event.clientY);
      event.currentTarget.style.cursor = hit ? 'grab' : '';
      if (event.pointerType !== 'touch') setHover(hit);
      return;
    }
    if (current.id !== event.pointerId) return;
    setRotation(
      rotateCube(current.start, {
        x: event.clientX - current.x,
        y: event.clientY - current.y,
      }),
    );
  };
  const pointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    const delta = {
      x: event.clientX - current.x,
      y: event.clientY - current.y,
    };
    const next = rotateCube(current.start, delta);
    gesture.current = null;
    setRotation(next);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    const destination =
      Math.hypot(delta.x, delta.y) >= 6 ? resolveCubeFace(next) : null;
    if (destination) leaveFor(destination);
    else {
      setDragging(false);
      runtime.current?.interact(false);
    }
  };
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Keys pressed on the news links belong to those links, not the cube.
    if (busy.current || event.target !== event.currentTarget) return;
    if (event.key === 'Enter') {
      const face = resolveCubeFace(rotation.current);
      if (face) {
        event.preventDefault();
        leaveFor(face);
      }
      return;
    }
    const keys: Record<string, { x: number; y: number }> = {
      ArrowLeft: { x: -18, y: 0 },
      ArrowRight: { x: 18, y: 0 },
      ArrowUp: { x: 0, y: -18 },
      ArrowDown: { x: 0, y: 18 },
    };
    const delta = keys[event.key];
    if (!delta) return;
    event.preventDefault();
    runtime.current?.interact(true);
    setDragging(true);
    setRotation(rotateCube(rotation.current, delta));
    if (keyboardTimer.current) clearTimeout(keyboardTimer.current);
    keyboardTimer.current = setTimeout(() => {
      if (!busy.current && !gesture.current) {
        runtime.current?.interact(false);
        setDragging(false);
      }
    }, 180);
  };
  const active = dragging || !!departure;

  return (
    <div
      ref={stage}
      className={`relative flex h-4/5 min-h-0 w-full ${styles.stage}`}
      data-dragging={dragging}
      data-hovered={hovering}
      aria-busy={!!departure}
      role="group"
      aria-label="BJW 큐브"
      aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Enter"
      tabIndex={0}
      onKeyDown={keyDown}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerLeave={() => {
        if (!gesture.current) setHover(false);
      }}
      onPointerCancel={(event) => {
        if (gesture.current?.id === event.pointerId) cancelDrag();
      }}
      onLostPointerCapture={(event) => {
        if (gesture.current?.id === event.pointerId) cancelDrag();
      }}
    >
      <div
        ref={host}
        className={styles.canvas}
        style={{ opacity: ready ? 1 : 0 }}
      />
      {!ready && (
        <div
          className={`${styles.fallbackPosition} ${departure ? styles.compress : ''}`}
          aria-hidden="true"
        >
          <div className={styles.fallbackMotion}>
            <div
              className={styles.fallbackCube}
              style={{
                transform: cubeRotationCss(
                  departure ? faceCubeRotation(departure.id) : displayRotation,
                ),
              }}
            >
              <span className={styles.front}>B</span>
              <span className={styles.top}>J</span>
              <span className={styles.right}>W</span>
              <span className={styles.back}>B</span>
              <span className={styles.left}>W</span>
              <span className={styles.bottom}>J</span>
            </div>
          </div>
        </div>
      )}
      <MeteorNews />
      <div
        ref={hint}
        className={styles.hint}
        data-active={active && ready}
        aria-hidden="true"
      >
        {cubeDestinations.map((destination) => (
          <span
            key={destination.key}
            className={styles.hintWord}
            data-key={destination.key}
          >
            {destination.label.slice(1).toLowerCase()}
          </span>
        ))}
      </div>
      <GoldGrainCursor active={!active} />
      {mounted &&
        createPortal(
          <div
            className={styles.backdrop}
            data-active={active}
            data-departure={!!departure}
            aria-hidden={!departure}
          >
            <canvas
              ref={energyCanvas}
              className={styles.energy}
              aria-hidden="true"
            />
            {departure && (
              <span className={styles.srOnly} role="status">
                {departure.label} 페이지로 이동합니다.
              </span>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};
