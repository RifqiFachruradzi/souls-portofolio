import { useEffect, useRef } from "react";
import { PixelCanvas } from "./PixelCanvas";

/**
 * The animated valley fixed behind the whole page. A veil over it deepens as the page scrolls:
 * the valley stays vivid behind the hero and dims under the sections so their text stays legible.
 */
export function ValleyBackground() {
  const veilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const veil = veilRef.current;
    if (!veil) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const k = Math.min(1, window.scrollY / (window.innerHeight * 0.8));
      veil.style.opacity = (0.12 + k * 0.6).toFixed(3);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="valley-bg" aria-hidden="true">
      <PixelCanvas view="full" leaves={30} />
      <div ref={veilRef} className="valley-veil" />
    </div>
  );
}
