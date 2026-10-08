import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { PixelCanvas } from "./PixelCanvas";
import { education, profile } from "../data/profile";

/**
 * "The Ashen One" as a pixel trading card: hover tilts it toward the light, dragging spins it,
 * double-click (or Enter / F) flips it over. The motion is a small spring, written straight to
 * the transform so nothing re-renders per frame.
 */
export function PixelCard() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const motion = useRef({
    tiltX: 0, tiltY: 0, targetX: 0, targetY: 0,
    spin: 0, spinTarget: 0, velocity: 0,
    dragging: false, lastX: 0, lastT: 0, moved: 0,
    mx: 50, my: 50, shine: 0, shineTarget: 0,
  });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const m = motion.current;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const k = still ? 1 : 1 - Math.exp(-dt * 10);
      m.tiltX += (m.targetX - m.tiltX) * k;
      m.tiltY += (m.targetY - m.tiltY) * k;
      if (!m.dragging) {
        if (Math.abs(m.velocity) > 20) {
          m.spinTarget += m.velocity * dt;
          m.velocity *= Math.exp(-dt * 4);
        } else {
          m.velocity = 0;
          m.spinTarget = Math.round(m.spinTarget / 180) * 180;
        }
      }
      m.spin += (m.spinTarget - m.spin) * (still ? 1 : 1 - Math.exp(-dt * 7));
      m.shine += (m.shineTarget - m.shine) * k;
      card.style.transform = `rotateX(${m.tiltX.toFixed(2)}deg) rotateY(${(m.spin + m.tiltY).toFixed(2)}deg)`;
      card.style.setProperty("--mx", `${m.mx.toFixed(1)}%`);
      card.style.setProperty("--my", `${m.my.toFixed(1)}%`);
      card.style.setProperty("--shine", m.shine.toFixed(3));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const flip = () => {
    const m = motion.current;
    m.velocity = 0;
    m.spinTarget = Math.round(m.spinTarget / 180) * 180 + 180;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    const r = stageRef.current!.getBoundingClientRect();
    const px = (event.clientX - r.left) / r.width, py = (event.clientY - r.top) / r.height;
    m.mx = px * 100;
    m.my = py * 100;
    if (m.dragging) {
      const dx = event.clientX - m.lastX, dtt = Math.max(1, event.timeStamp - m.lastT);
      m.spinTarget += dx * 0.6;
      m.velocity = (dx * 0.6 * 1000) / dtt;
      m.moved += Math.abs(dx);
      m.lastX = event.clientX;
      m.lastT = event.timeStamp;
      m.targetX = 0;
      return;
    }
    if (event.pointerType === "mouse") {
      m.targetX = (0.5 - py) * 18;
      m.targetY = (px - 0.5) * 22;
      m.shineTarget = 1;
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    m.dragging = true;
    m.moved = 0;
    m.lastX = event.clientX;
    m.lastT = event.timeStamp;
    m.velocity = 0;
    m.shineTarget = 1;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    if (!m.dragging) return;
    m.dragging = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (event.pointerType !== "mouse") m.shineTarget = 0;
  };

  const onPointerLeave = () => {
    const m = motion.current;
    if (m.dragging) return;
    m.targetX = 0;
    m.targetY = 0;
    m.shineTarget = 0;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " " || event.key.toLowerCase() === "f") {
      event.preventDefault();
      flip();
    }
  };

  return (
    <div
      ref={stageRef}
      className="pcard-stage"
      role="button"
      tabIndex={0}
      aria-label="The Ashen One, a pixel trading card. Drag to spin it, double-click or press Enter to flip it over."
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={onPointerLeave}
      onDoubleClick={flip}
      onKeyDown={onKeyDown}
    >
      <div ref={cardRef} className="pcard">
        <div className="pcard-face pcard-front">
          <p className="pcard-title">The Ashen One</p>
          <div className="pcard-art">
            <PixelCanvas variant="card" />
          </div>
          <p className="pcard-plate">
            <span>Lord of Code</span>
            <span>{profile.role}</span>
          </p>
          <span className="pcard-shine" aria-hidden="true" />
        </div>
        <div className="pcard-face pcard-back">
          <p className="pcard-title">Bonfire Archive</p>
          <div className="pcard-sigil" aria-hidden="true" />
          <p className="pcard-name">{profile.name}</p>
          <p className="pcard-meta">{profile.role} · {profile.location}</p>
          <dl className="pcard-stats">
            {profile.stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.value}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
          <p className="pcard-flavor">{education.school} · {education.period}</p>
          <span className="pcard-shine" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
