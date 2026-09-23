import { useSyncExternalStore } from "react";
import {
  canRender3D,
  getMotionPreference,
  isReducedMotion,
  isWebGLSupported,
  subscribeMotion,
  type MotionPreference,
} from "@/lib/motion";

export function useMotionState() {
  const preference = useSyncExternalStore<MotionPreference>(
    subscribeMotion,
    getMotionPreference,
    () => "auto",
  );
  const reduced = useSyncExternalStore(subscribeMotion, isReducedMotion, () => false);
  const webgl = useSyncExternalStore(subscribeMotion, isWebGLSupported, () => true);
  const allow3D = useSyncExternalStore(subscribeMotion, canRender3D, () => false);

  return { preference, reduced, webgl, allow3D };
}
