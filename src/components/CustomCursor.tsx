import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor — an actual arrow/pointer shape (mint SVG) sitting at the true
 * pointer position, trailed by a soft eased glow. Morphs to a "hand-ish"
 * highlighted arrow over interactive targets. Hidden on touch/coarse pointers.
 */
export function CustomCursor() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const eased = { x: target.x, y: target.y };
    let raf = 0;

    const loop = () => {
      eased.x += (target.x - eased.x) * 0.16;
      eased.y += (target.y - eased.y) * 0.16;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0) translate(-50%, -50%)`;
      }
      if (arrowRef.current) {
        arrowRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const isInteractive = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return false;
      return !!el.closest(
        'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="link"]',
      );
    };
    const onOver = (e: PointerEvent) => setHovering(isInteractive(e.target));
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => {
      if (arrowRef.current) arrowRef.current.style.opacity = "0";
      if (glowRef.current) glowRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (arrowRef.current) arrowRef.current.style.opacity = "1";
      if (glowRef.current) glowRef.current.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={glowRef} aria-hidden className="custom-cursor-glow" />
      <div
        ref={arrowRef}
        aria-hidden
        className={`custom-cursor-arrow ${hovering ? "is-hover" : ""} ${down ? "is-down" : ""}`}
      >
        <svg viewBox="0 0 24 24" width="26" height="26">
          <path
            d="M4 2 L4 20.2 L8.9 15.6 L11.9 22.4 L14.9 21 L11.9 14.4 L18.6 14.2 Z"
            fill="currentColor"
            stroke="var(--background)"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}
