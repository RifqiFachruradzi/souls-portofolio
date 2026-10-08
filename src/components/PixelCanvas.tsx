import { useEffect, useRef } from "react";
import { createScene, type SceneVariant } from "../pixel/scene";

type PixelCanvasProps = { variant: SceneVariant; className?: string };

const FPS = 20;

/**
 * The pixel scene on a canvas sized to the host's aspect. Runs at a steady 20 fps, stops while
 * offscreen or in a background tab, and draws a single still frame under reduced motion.
 */
export function PixelCanvas({ variant, className = "" }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;
    const host = canvas.parentElement ?? canvas;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene: ReturnType<typeof createScene> | null = null;
    let aspect = 0;
    let raf = 0;
    let onscreen = true;
    let last = 0;
    let clock = 0;

    const build = () => {
      const r = host.getBoundingClientRect();
      const next = r.width > 0 && r.height > 0 ? r.width / r.height : 16 / 9;
      if (scene && Math.abs(next - aspect) / aspect < 0.04) return;
      aspect = next;
      scene = createScene(ctx, variant, aspect);
      scene.render(clock, 0);
    };

    const loop = (now: number) => {
      raf = 0;
      if (!onscreen || document.hidden || still) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / FPS - 2) return;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      clock += dt;
      scene?.render(clock, dt);
    };
    const start = () => {
      if (!raf && onscreen && !document.hidden && !still) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };

    build();
    start();
    const resize = new ResizeObserver(() => build());
    resize.observe(host);
    const visible = new IntersectionObserver(([entry]) => {
      onscreen = entry?.isIntersecting ?? true;
      start();
    });
    visible.observe(host);
    const onVisibility = () => start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      visible.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [variant]);

  return <canvas ref={canvasRef} className={`pixel-canvas${className ? ` ${className}` : ""}`} aria-hidden="true" />;
}
