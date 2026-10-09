import { useEffect, useRef } from "react";
import { VIEWS, createValley, loadValley } from "../pixel/valley";

type PixelCanvasProps = { view: keyof typeof VIEWS; leaves: number; className?: string };

const VALLEY_SRC = "/scene/valley.png";
const FPS = 20;

/**
 * The animated valley on a canvas at its native pixel size; CSS scales it up with `pixelated`.
 * Runs at a steady 20 fps, stops while offscreen or in a background tab, and draws a single
 * still frame under reduced motion.
 */
export function PixelCanvas({ view, leaves, className = "" }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene: ReturnType<typeof createValley> | null = null;
    let raf = 0;
    let onscreen = true;
    let last = 0;
    let clock = 0;
    let disposed = false;

    const loop = (now: number) => {
      raf = 0;
      if (!scene || !onscreen || document.hidden || still) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / FPS - 2) return;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      clock += dt;
      scene.render(clock, dt);
    };
    const start = () => {
      if (!raf && scene && onscreen && !document.hidden && !still) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };

    loadValley(VALLEY_SRC)
      .then((base) => {
        if (disposed) return;
        scene = createValley(ctx, base, VIEWS[view], leaves);
        scene.render(clock, 0);
        start();
      })
      .catch(() => {
        // the canvas keeps its CSS background, the still image
      });
    const visible = new IntersectionObserver(([entry]) => {
      onscreen = entry?.isIntersecting ?? true;
      start();
    });
    visible.observe(canvas);
    document.addEventListener("visibilitychange", start);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      visible.disconnect();
      document.removeEventListener("visibilitychange", start);
    };
  }, [view, leaves]);

  const v = VIEWS[view];
  return (
    <canvas
      ref={canvasRef}
      width={v.w}
      height={v.h}
      className={`pixel-canvas${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    />
  );
}
