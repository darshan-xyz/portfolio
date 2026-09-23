/**
 * Motion + WebGL capability layer.
 *
 * Users can be in one of three states:
 *  - "auto"    : follow the OS `prefers-reduced-motion` setting (default)
 *  - "reduced" : force static, no 3D / no heavy animation
 *  - "full"    : force the full 3D experience
 *
 * On top of that we detect WebGL support so machines that simply can't run
 * Three.js get the same graceful static fallback.
 */

export type MotionPreference = "auto" | "reduced" | "full";

const STORAGE_KEY = "portfolio:motion-preference";

let preference: MotionPreference = "auto";
let systemReduced = false;
let webglSupported = true;
let initialized = false;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function readWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "reduced" || stored === "full" || stored === "auto") {
    preference = stored;
  }

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  systemReduced = mq.matches;
  mq.addEventListener("change", (e) => {
    systemReduced = e.matches;
    emit();
  });

  webglSupported = readWebGL();
}

export function subscribeMotion(listener: () => void) {
  init();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getMotionPreference(): MotionPreference {
  init();
  return preference;
}

export function setMotionPreference(next: MotionPreference) {
  init();
  preference = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* storage blocked — keep in-memory only */
  }
  document.documentElement.dataset["motion"] = next;
  emit();
}

/** True when heavy motion / 3D should be suppressed. */
export function isReducedMotion(): boolean {
  init();
  if (preference === "reduced") return true;
  if (preference === "full") return false;
  return systemReduced;
}

export function isWebGLSupported(): boolean {
  init();
  return webglSupported;
}

/** True when it is safe to mount a Three.js canvas. */
export function canRender3D(): boolean {
  return isWebGLSupported() && !isReducedMotion();
}
