import { useEffect, useRef, useState } from "react";

type HoloSceneMode = "shrine" | "card";

type HoloSceneProps = {
  /** `shrine`: the candlelit sword shrine alone. `card`: the holo card alone. */
  mode: HoloSceneMode;
  className?: string;
  label: string;
};

/**
 * One view of ThreeUI's Dark Souls Holo Card ("The Ashen One") through /landing-pages/holo-scene.html.
 * Sandboxed like the original component, fades in once the scene is ready, and pauses offscreen.
 */
export function HoloScene({ mode, className = "", label }: HoloSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [onscreen, setOnscreen] = useState(true);
  // the card waits until it is close to the viewport, so it can reuse the document the shrine fetched
  const [armed, setArmed] = useState(mode === "shrine");
  const [documentVisible, setDocumentVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  const interactive = mode === "card";

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      const data = event.data as { source?: string; type?: string } | null;
      if (data?.source === "holo-scene" && data.type === "ready") setReady(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === "undefined") return undefined;
    // pause as soon as the scene is (almost) entirely scrolled away
    const observer = new IntersectionObserver(
      ([entry]) => setOnscreen(entry ? entry.intersectionRatio > 0.02 : true),
      { threshold: [0, 0.02, 0.1] },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (armed || !host || typeof IntersectionObserver === "undefined") {
      setArmed(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setArmed(true);
        observer.disconnect();
      }
    }, { rootMargin: "600px 0px" });
    observer.observe(host);
    return () => observer.disconnect();
  }, [armed]);

  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const running = onscreen && documentVisible;

  useEffect(() => {
    if (!ready) return;
    frameRef.current?.contentWindow?.postMessage({ target: "holo-scene", type: running ? "resume" : "pause" }, "*");
  }, [ready, running]);

  return (
    <div
      ref={hostRef}
      className={`holo-scene holo-scene--${mode}${ready ? " is-ready" : ""}${className ? ` ${className}` : ""}`}
      data-state={ready ? (running ? "ready" : "paused") : "loading"}
      role={interactive ? "group" : undefined}
      aria-label={interactive ? label : undefined}
      aria-hidden={interactive ? undefined : true}
    >
      {armed ? (
        <iframe
          ref={frameRef}
          title={label}
          src={`/landing-pages/holo-scene.html?mode=${mode}`}
          sandbox="allow-scripts"
          tabIndex={interactive ? 0 : -1}
          loading="eager"
        />
      ) : null}
    </div>
  );
}
