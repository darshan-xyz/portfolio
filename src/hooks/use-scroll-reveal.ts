import { useEffect, useRef, useState, type RefObject } from "react";

// Global scroll direction tracker
let currentDir: "down" | "up" = "down";
if (typeof window !== "undefined") {
  let lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 2) {
        currentDir = y > lastY ? "down" : "up";
        lastY = y;
      }
    },
    { passive: true },
  );
}

export function useScrollReveal<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const kids = el.querySelectorAll<HTMLElement>("[data-reveal-child]");
    kids.forEach((k, i) => {
      k.style.setProperty("--reveal-delay", `${i * 70}ms`);
    });

    let raf = 0;
    let shown = false;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Visible when any meaningful part of the block is inside the viewport.
      const visible = rect.top < vh * 0.9 && rect.bottom > vh * 0.08;
      if (visible === shown) return;
      shown = visible;
      if (visible) {
        el.setAttribute("data-reveal-dir", currentDir);
        el.classList.add("reveal-in");
      } else {
        el.classList.remove("reveal-in");
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}


/** Track vertical scroll velocity (px/frame) for particle emitter. */
export function useScrollVelocity() {
  const [v, setV] = useState(0);
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const tick = () => {
      const y = window.scrollY;
      const dv = y - last;
      last = y;
      setV((prev) => prev * 0.85 + dv * 0.15);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return v;
}

export function useParallax<T extends HTMLElement>(speed = 0.2): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${-center * speed}px, 0)`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);
  return ref;
}
