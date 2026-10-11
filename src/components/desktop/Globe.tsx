// The rotating globe, drawn the way `shell/src/globe.rs` draws it: dotted land on a
// wire sphere, with this machine and the places it is connected to marked on it.

import { useEffect, useRef } from "react";
import type { Rgb } from "../../lib/accent";

/** Land, as ranges of 10-degree cells of longitude (0 is 180°W) for each 10-degree
 *  band of latitude, from the North Pole down. Coarse on purpose. */
const LAND: [number, number][][] = [
  [[12, 14]],
  [[7, 10], [12, 15], [19, 20], [26, 32]],
  [[1, 8], [10, 11], [13, 14], [16, 16], [18, 35]],
  [[2, 2], [5, 8], [10, 11], [17, 33]],
  [[5, 11], [17, 31], [32, 32]],
  [[6, 10], [17, 19], [21, 31]],
  [[7, 8], [16, 30]],
  [[8, 9], [16, 23], [25, 25], [27, 28], [30, 30]],
  [[10, 12], [17, 22], [27, 29]],
  [[10, 14], [19, 21], [28, 33]],
  [[10, 13], [19, 22], [30, 32]],
  [[11, 13], [19, 21], [29, 33]],
  [[11, 12], [20, 20], [29, 29], [31, 33], [35, 35]],
  [[11, 11], [32, 32], [35, 35]],
  [[11, 11]],
  [[11, 12], [20, 33]],
  [[0, 35]],
  [[0, 35]],
];

const TILT = (18 * Math.PI) / 180;
const SPEED = 9;
const LIFT = 0.22;

type Vec = [number, number, number];
type Place = { lon: number; lat: number };

const HOME: Place = { lon: -0.12, lat: 51.5 };
const LINKS: Place[] = [
  { lon: -74.0, lat: 40.7 },
  { lon: -122.4, lat: 37.8 },
  { lon: -46.6, lat: -23.5 },
  { lon: 8.7, lat: 50.1 },
  { lon: 103.8, lat: 1.35 },
  { lon: 139.7, lat: 35.7 },
];

function isLand(lon: number, lat: number): boolean {
  const row = Math.min(17, Math.floor((90 - lat) / 10));
  const cell = Math.min(35, Math.floor((((lon + 180) % 360) + 360) % 360 / 10));
  return LAND[row].some(([from, to]) => cell >= from && cell <= to);
}

function sphere({ lon, lat }: Place): Vec {
  const [l, p] = [(lon * Math.PI) / 180, (lat * Math.PI) / 180];
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
}

/** Turns a point with the globe and leans it towards the viewer; null on the far side. */
function view([x, y, z]: Vec, rotation: number): [number, number] | null {
  const r = (rotation * Math.PI) / 180;
  const [tx, tz] = [x * Math.cos(r) + z * Math.sin(r), z * Math.cos(r) - x * Math.sin(r)];
  const depth = y * Math.sin(TILT) + tz * Math.cos(TILT);
  return depth > 0 ? [tx, y * Math.cos(TILT) - tz * Math.sin(TILT)] : null;
}

/** Points along the shortest path between two places, rising off the surface. */
function arc(from: Place, to: Place): Vec[] {
  const [a, b] = [sphere(from), sphere(to)];
  const angle = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
  if (angle < 1e-3 || Math.PI - angle < 1e-3) {
    return [];
  }
  return Array.from({ length: 33 }, (_, step) => {
    const t = step / 32;
    const [wa, wb] = [Math.sin((1 - t) * angle) / Math.sin(angle), Math.sin(t * angle) / Math.sin(angle)];
    const lift = 1 + LIFT * Math.sin(Math.PI * t);
    return [0, 1, 2].map((i) => (a[i] * wa + b[i] * wb) * lift) as Vec;
  });
}

const ARCS = LINKS.map((place) => arc(HOME, place));

function draw(ctx: CanvasRenderingContext2D, size: number, rotation: number, accent: Rgb) {
  const center = size / 2;
  const radius = (size / 2 - 4) / (1 + LIFT * 0.6);
  const at = ([x, y]: [number, number]): [number, number] => [center + radius * x, center - radius * y];
  const main = `rgb(${accent.join(" ")})`;

  ctx.clearRect(0, 0, size, size);
  ctx.lineWidth = 1;
  ctx.fillStyle = "#06080B";
  ctx.strokeStyle = "#2A3742";
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Lines break where they pass behind the globe.
  const path = (points: ([number, number] | null)[]) => {
    ctx.beginPath();
    let pen = false;
    for (const point of points) {
      if (!point) {
        pen = false;
        continue;
      }
      const [x, y] = at(point);
      pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      pen = true;
    }
    ctx.stroke();
  };

  ctx.strokeStyle = "#1A232B";
  for (let lon = -180; lon < 180; lon += 30) {
    path(Array.from({ length: 31 }, (_, i) => view(sphere({ lon, lat: -90 + i * 6 }), rotation)));
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    path(Array.from({ length: 61 }, (_, i) => view(sphere({ lon: -180 + i * 6, lat }), rotation)));
  }

  ctx.fillStyle = `rgb(${accent.join(" ")} / 0.5)`;
  for (let lat = -87.5; lat < 90; lat += 5) {
    for (let lon = -177.5; lon < 180; lon += 5) {
      const point = isLand(lon, lat) && view(sphere({ lon, lat }), rotation);
      if (point) {
        const [x, y] = at(point);
        ctx.beginPath();
        ctx.arc(x, y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Links first, so that this machine's mark sits on top of where they meet.
  ctx.strokeStyle = main;
  ctx.fillStyle = main;
  ctx.lineWidth = 1.2;
  LINKS.forEach((place, i) => {
    path(ARCS[i].map((point) => view(point, rotation)));
    const point = view(sphere(place), rotation);
    if (point) {
      ctx.beginPath();
      ctx.arc(...at(point), 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const home = view(sphere(HOME), rotation);
  if (home) {
    ctx.fillStyle = ctx.strokeStyle = "#DCE7EC";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(...at(home), 3.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(...at(home), 6.5, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export const LINK_COUNT = LINKS.length;

export function Globe({ size, accent }: { size: number; accent: Rgb }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const ctx = element?.getContext("2d");
    if (!element || !ctx) {
      return;
    }
    const scale = window.devicePixelRatio || 1;
    element.width = size * scale;
    element.height = size * scale;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rotation = 20;
    let frame = 0;
    let last = 0;
    let visible = true;
    const tick = (time: number) => {
      rotation += last ? ((time - last) / 1000) * SPEED : 0;
      last = time;
      draw(ctx, size, rotation, accent);
      if (visible && !still) {
        frame = requestAnimationFrame(tick);
      }
    };
    // No turning while out of sight.
    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      last = 0;
      if (visible) {
        frame = requestAnimationFrame(tick);
      }
    });
    watcher.observe(element);
    return () => {
      watcher.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [size, accent]);

  return <canvas ref={canvas} style={{ width: size, height: size }} aria-label="A rotating globe marking open connections" role="img" />;
}
