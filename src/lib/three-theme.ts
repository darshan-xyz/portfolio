import { useMemo, useSyncExternalStore } from "react";

export interface ThreeThemeColors {
  accent: string;
  accent2: string;
  fog: string;
  ambient: number;
  particles: string;
  highlight: string;
}

const DARK_COLORS: ThreeThemeColors = {
  accent: "#7CF9C9",
  accent2: "#B8FF3A",
  fog: "#040914",
  ambient: 0.35,
  particles: "#B8FF3A",
  highlight: "#3EE0B0",
};

const LIGHT_COLORS: ThreeThemeColors = {
  accent: "#0D9373",
  accent2: "#3D7A1F",
  fog: "#FAFBFE",
  ambient: 0.85,
  particles: "#3D7A1F",
  highlight: "#0D9373",
};

function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(() => callback());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getThemeSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot(): boolean {
  return true; // SSR defaults to dark
}

export function useThreeThemeColors(): ThreeThemeColors {
  const isDark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerSnapshot);
  return useMemo(() => (isDark ? DARK_COLORS : LIGHT_COLORS), [isDark]);
}
