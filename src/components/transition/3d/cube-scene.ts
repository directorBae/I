import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {
  cubeTransitionFrame,
  initialCubeRotation,
  faceCubeRotation,
  cubeHoverImpulse,
  cubeFaces,
  type CubeRotation,
  type CubeFace,
} from './interaction';
import { drawEnergy, type ThemeKey, type ThemeMix } from './energy';

const smoothstep = (from: number, to: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

export interface CubeScene {
  hitTest: (x: number, y: number) => boolean;
  rotate: (rotation: CubeRotation) => void;
  hover: (active: boolean) => void;
  interact: (active: boolean) => void;
  begin: (face: CubeFace['id'], startedAt?: number) => void;
  dispose: () => void;
}

export async function createCubeScene(
  host: HTMLDivElement,
  signal: AbortSignal,
  getEnergyCanvas: () => HTMLCanvasElement | null,
  getHint: () => HTMLElement | null,
  onContextLost: () => void,
): Promise<CubeScene> {
  let destroyed = false;
  const releases: (() => void)[] = [];
  const dispose = () => {
    if (destroyed) return;
    destroyed = true;
    signal.removeEventListener('abort', dispose);
    releases
      .splice(0)
      .reverse()
      .forEach((release) => release());
  };
  signal.addEventListener('abort', dispose, { once: true });
  try {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    releases.push(() => {
      renderer.dispose();
      renderer.domElement.remove();
    });
    renderer.setClearColor(0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute(
      'aria-label',
      '여섯 면 전체가 B, J, W 양각으로 이루어진 큐브',
    );
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0.1, 100);
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld(true);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x929292, 1.2));
    const key = new THREE.DirectionalLight(0xffffff, 3.4);
    key.position.set(-3, 7, 5);
    scene.add(key);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, {
      left: -3,
      right: 3,
      top: 3,
      bottom: -3,
      near: 0.1,
      far: 20,
    });
    key.shadow.normalBias = 0.006;
    key.shadow.bias = -0.0001;
    releases.push(() => key.shadow.map?.dispose());
    const rim = new THREE.DirectionalLight(0xffffff, 0.65);
    rim.position.set(5, 0, -4);
    scene.add(rim);
    const root = new THREE.Group();
    scene.add(root);
    const desired = new THREE.Quaternion().copy(initialCubeRotation);
    root.quaternion.copy(desired);
    let baseScale = 1;
    let cubePixels = 100;
    let frame = 0;
    let visible = true;
    let interacting = false,
      activity = 0,
      motion = 0,
      motionTarget = 0,
      lastTime = performance.now();
    let hovered = false,
      hoverStarted = -1000;
    const mix: ThemeMix = { B: 0, J: 0, W: 0 };
    const facing: ThemeMix = { B: 0, J: 0, W: 0 };
    const normal = new THREE.Vector3();
    const bounds = new THREE.Box3();
    const kickRotation = new THREE.Quaternion();
    const kickEuler = new THREE.Euler();
    let flight: {
      started: number;
      from: THREE.Quaternion;
      to: THREE.Quaternion;
    } | null = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const resize = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const aspect = rect.width / rect.height;
      camera.left = -3 * aspect;
      camera.right = 3 * aspect;
      camera.updateProjectionMatrix();
      if (!flight)
        cubePixels = Math.min(560, Math.min(rect.width, rect.height) * 0.9);
      baseScale = (cubePixels * 6) / (rect.height * 3.0);
      // Lets the page lay things out around the cube's real on-screen size.
      host.parentElement?.style.setProperty(
        '--cube-face',
        `${(baseScale * 1.4 * (rect.height / 6)).toFixed(1)}px`,
      );
      renderer.setSize(rect.width, rect.height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    releases.push(() => observer.disconnect());
    resize();
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(host);
    releases.push(() => visibility.disconnect());
    const lost = (event: Event) => {
      event.preventDefault();
      dispose();
      onContextLost();
    };
    renderer.domElement.addEventListener('webglcontextlost', lost);
    releases.push(() =>
      renderer.domElement.removeEventListener('webglcontextlost', lost),
    );
    const response = await fetch('/models/bjw.glb', { signal });
    if (!response.ok) throw new Error('Cube model unavailable');
    const gltf = await new GLTFLoader().parseAsync(
      await response.arrayBuffer(),
      '',
    );
    const releaseModel = () => {
      const materials = new Set<THREE.Material>();
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (Array.isArray(child.material)
            ? child.material
            : [child.material]
          ).forEach((material) => materials.add(material));
        }
      });
      materials.forEach((material) => material.dispose());
    };
    if (destroyed) {
      releaseModel();
      throw new DOMException('Aborted', 'AbortError');
    }
    releases.push(releaseModel);
    root.add(gltf.scene);
    gltf.scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });
    const apply = (time: number) => {
      const delta = Math.min(0.05, Math.max(0, (time - lastTime) / 1000));
      lastTime = time;
      activity +=
        ((interacting || flight ? 1 : 0) - activity) *
        (1 - Math.exp(-delta * 12));
      motionTarget *= Math.exp(-delta * 5);
      motion += (motionTarget - motion) * (1 - Math.exp(-delta * 10));
      let compression = 1;
      let impulse = 0;
      if (flight) {
        const state = cubeTransitionFrame(
          time - flight.started,
          reduced.matches,
        );
        root.quaternion.slerpQuaternions(flight.from, flight.to, state.focus);
        compression = state.compression;
        const canvas = getEnergyCanvas();
        if (canvas) {
          const rect = host.getBoundingClientRect();
          drawEnergy(
            canvas,
            state.progress,
            reduced.matches,
            { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
            mix,
            time / 1000,
          );
        }
      } else {
        root.quaternion.copy(desired);
        if (!interacting) {
          impulse = cubeHoverImpulse(time - hoverStarted, reduced.matches);
          kickEuler.set(0.11 * impulse, -0.12 * impulse, 0.035 * impulse);
          root.quaternion.multiply(kickRotation.setFromEuler(kickEuler));
        }
        const canvas = getEnergyCanvas();
        if (canvas) {
          if (activity > 0.002) {
            const rect = host.getBoundingClientRect();
            drawEnergy(
              canvas,
              0.4,
              reduced.matches,
              { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
              mix,
              time / 1000,
              { strength: activity * (0.2 + motion * 0.8) },
            );
          } else
            canvas
              .getContext('2d')
              ?.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      root.position.set(0, 0, 0);
      const scale =
        baseScale *
        compression *
        (1 +
          impulse * 0.055 +
          (hovered && !interacting && !flight ? 0.012 : 0));
      root.scale.setScalar(scale);
      root.updateMatrixWorld(true);
      theme(delta, scale);
    };
    // The face turned toward the viewer picks the backdrop theme and hints
    // the rest of its page name beside the cube.
    const theme = (delta: number, scale: number) => {
      facing.B = facing.J = facing.W = -1;
      for (const face of cubeFaces) {
        const z = normal
          .fromArray(face.normal)
          .applyQuaternion(root.quaternion).z;
        if (z > facing[face.key]) facing[face.key] = z;
      }
      const nearest = (['B', 'J', 'W'] as ThemeKey[]).reduce((best, key) =>
        facing[key] > facing[best] ? key : best,
      );
      const snap = activity < 0.02;
      const ease = 1 - Math.exp(-delta * 3.5);
      for (const key of ['B', 'J', 'W'] as ThemeKey[]) {
        const target = key === nearest ? 1 : 0;
        mix[key] = snap ? target : mix[key] + (target - mix[key]) * ease;
      }
      const hint = getHint();
      if (!hint) return;
      const rect = host.getBoundingClientRect();
      const face = scale * 1.4 * (rect.height / 6);
      // World x maps straight to screen x under the fixed orthographic camera.
      const edge = bounds.setFromObject(root).max.x * (rect.height / 6);
      const room = window.innerWidth - (rect.left + rect.width / 2) - edge - 40;
      hint.style.setProperty('--face', `${face.toFixed(1)}px`);
      hint.style.setProperty('--edge', `${edge.toFixed(1)}px`);
      hint.style.setProperty(
        '--size',
        `${Math.max(18, Math.min((face * 0.93) / 0.72, room / 4.5)).toFixed(1)}px`,
      );
      for (const key of ['B', 'J', 'W'] as ThemeKey[])
        hint.style.setProperty(
          `--${key.toLowerCase()}`,
          (smoothstep(0.7, 0.975, facing[key]) * activity).toFixed(3),
        );
    };
    const draw = (time: number) => {
      if (destroyed) return;
      frame = requestAnimationFrame(draw);
      if ((!visible && !flight) || document.hidden) return;
      apply(time);
      renderer.render(scene, camera);
    };
    releases.push(() => cancelAnimationFrame(frame));
    apply(performance.now());
    renderer.render(scene, camera);
    frame = requestAnimationFrame(draw);
    const raycaster = new THREE.Raycaster();
    return {
      hitTest(x, y) {
        if (destroyed || flight) return false;
        const rect = host.getBoundingClientRect();
        raycaster.setFromCamera(
          new THREE.Vector2(
            ((x - rect.left) / rect.width) * 2 - 1,
            (-(y - rect.top) / rect.height) * 2 + 1,
          ),
          camera,
        );
        return raycaster.intersectObject(root, true).length > 0;
      },
      rotate(rotation) {
        if (!flight) {
          motionTarget = Math.min(
            1,
            desired.angleTo(new THREE.Quaternion().copy(rotation)) * 7 +
              motionTarget * 0.45,
          );
          desired.copy(rotation);
          root.quaternion.copy(desired);
          root.updateMatrixWorld(true);
        }
      },
      hover(active) {
        const now = performance.now();
        if (active && !hovered && !interacting && now - hoverStarted > 650)
          hoverStarted = now;
        hovered = active;
      },
      interact(active) {
        interacting = active;
        if (active) hovered = false;
      },
      begin(face, startedAt = performance.now()) {
        flight = {
          started: startedAt,
          from: root.quaternion.clone(),
          to: new THREE.Quaternion().copy(faceCubeRotation(face)),
        };
        resize();
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
