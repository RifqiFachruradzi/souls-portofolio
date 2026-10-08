import { useEffect, useRef, useState } from "react";

const SHRINE_DOCUMENT = "/landing-pages/shrine-background.html";

/**
 * Ambient sword-shrine scene behind the hero: the Ashen One document with its card hidden.
 * Non-interactive, sandboxed like the card, fades in once ready, and is paused offscreen.
 */
export function ShrineBackground() {
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [onscreen, setOnscreen] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(() => typeof document === "undefined" || !document.hidden);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      const data = event.data as { source?: string; type?: string } | null;
      if (data?.source === "shrine-background" && data.type === "ready") setReady(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === "undefined") return undefined;
    // pause as soon as the hero is (almost) entirely scrolled away, so the card section renders alone
    const observer = new IntersectionObserver(
      ([entry]) => setOnscreen(entry ? entry.intersectionRatio > 0.02 : true),
      { threshold: [0, 0.02, 0.1] },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const running = onscreen && documentVisible;

  useEffect(() => {
    if (!ready) return;
    frameRef.current?.contentWindow?.postMessage({ target: "shrine-background", type: running ? "resume" : "pause" }, "*");
  }, [ready, running]);

  return (
    <div ref={hostRef} className={`shrine-bg${ready ? " is-ready" : ""}`} aria-hidden="true">
      <iframe
        ref={frameRef}
        title="Candlelit sword shrine"
        src={SHRINE_DOCUMENT}
        sandbox="allow-scripts"
        tabIndex={-1}
        loading="eager"
      />
    </div>
  );
}
