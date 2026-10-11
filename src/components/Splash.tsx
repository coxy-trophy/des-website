// The splash the compositor shows while the shell restarts, here while the page
// loads: the desktop's name, which glitches now and then, over a bar of blocks that
// fills. The timings are those of `compositor/src/splash.rs`.

import { useEffect, useState, type CSSProperties } from "react";

const STRIPS = 9;
const BLOCKS = 20;
/// The least time it shows, so that it reads as more than a flicker.
const LEAST = 1500;
const FULL_FOR = 180;
const FADE = 260;
/// When the name glitches: from, and for how long, in milliseconds.
const GLITCHES = [
  [320, 130],
  [1280, 90],
  [1900, 140],
];
const GLITCH_EVERY = 2400;
const GLITCH_STEP = 42;
const SEEN = "des-website.splash";

type Strip = { slide: number; accent: number | null; cool: number | null };

/// Which shape of glitch is showing `millis` after the start, if one is.
function glitchAt(millis: number): number | null {
  const within = millis % GLITCH_EVERY;
  const which = GLITCHES.findIndex(([from, long]) => within >= from && within < from + long);
  return which < 0 ? null : Math.floor(millis / GLITCH_EVERY) * 97 + which * 13 + Math.floor((within - GLITCHES[which][0]) / GLITCH_STEP);
}

/// The whole name jumps a little; about half the strips jump further, and a few show
/// again in colour, slid the other way.
function shape(): Strip[] {
  const jump = Math.floor(Math.random() * 9) - 4;
  const aside = () => Math.floor(Math.random() * 15) + 4;
  return Array.from({ length: STRIPS }, () => ({
    slide: jump + (Math.random() < 0.5 ? Math.floor(Math.random() * 25) - 12 : 0),
    accent: Math.random() < 1 / 3 ? aside() : null,
    cool: Math.random() < 1 / 4 ? -aside() : null,
  }));
}

/// How many blocks are filled: quickly at first, then ever slower, never all of them
/// until the page is ready.
function blocksFilled(elapsed: number, ready: boolean): number {
  if (ready) {
    return BLOCKS;
  }
  const part = 1 - Math.exp(-elapsed / 900);
  return Math.min(BLOCKS - 1, Math.floor(part * 0.92 * BLOCKS));
}

function wanted(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  try {
    // Once for each visit, not on every reload.
    return sessionStorage.getItem(SEEN) === null;
  } catch {
    return true;
  }
}

function Name() {
  return (
    <>
      DEs<b>-</b>UI
    </>
  );
}

export function Splash() {
  const [showing, setShowing] = useState(wanted);
  const [filled, setFilled] = useState(0);
  const [strips, setStrips] = useState<Strip[] | null>(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!showing) {
      return;
    }
    const began = performance.now();
    let loaded = false;
    let fullAt: number | null = null;
    let frame = 0;
    let lastGlitch: number | null = null;
    document.fonts.ready.then(() => (loaded = true));

    const finish = () => {
      try {
        sessionStorage.setItem(SEEN, "1");
      } catch {
        // It will show again next time, which is fine.
      }
      setShowing(false);
    };
    const tick = (now: number) => {
      const elapsed = now - began;
      if (fullAt === null && loaded && elapsed >= LEAST) {
        fullAt = now;
      }
      setFilled(blocksFilled(elapsed, fullAt !== null));
      const glitch = fullAt === null ? glitchAt(elapsed) : null;
      if (glitch !== lastGlitch) {
        lastGlitch = glitch;
        setStrips(glitch === null ? null : shape());
      }
      if (fullAt !== null && now - fullAt >= FULL_FOR) {
        setFading(true);
      }
      if (fullAt !== null && now - fullAt >= FULL_FOR + FADE) {
        finish();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    // Any key or click is taken as "I have seen it".
    window.addEventListener("keydown", finish);
    window.addEventListener("pointerdown", finish);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, [showing]);

  if (!showing) {
    return null;
  }
  return (
    <div className="splash" data-fading={fading} aria-hidden="true">
      <div className="splash-name">
        {Array.from({ length: STRIPS }, (_, i) => {
          const strip = strips?.[i];
          return (
            <div
              className="splash-strip"
              key={i}
              style={{ "--strip": i, transform: strip ? `translateX(${strip.slide}px)` : undefined } as CSSProperties}
            >
              <span>
                <Name />
              </span>
              {strip?.accent != null && (
                <span className="splash-ghost" style={{ left: strip.accent }}>
                  <Name />
                </span>
              )}
              {strip?.cool != null && (
                <span className="splash-ghost splash-cool" style={{ left: strip.cool }}>
                  <Name />
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="splash-bar">
        {Array.from({ length: BLOCKS }, (_, i) => (
          <i key={i} data-filled={i < filled} />
        ))}
      </div>
    </div>
  );
}
