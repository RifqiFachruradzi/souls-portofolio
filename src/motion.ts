// Entrance motion built on anime.js. Every effect is skipped under reduced motion, and nothing
// is hidden before JavaScript runs, so the page reads fine without it.

import { animate, createTimeline, scrambleText, splitText, stagger, utils } from "animejs";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Runs `cb` once, the first time `el` scrolls into view. Returns a cleanup. */
export function onFirstView(el: Element, cb: () => void, rootMargin = "0px 0px -12% 0px") {
  if (typeof IntersectionObserver === "undefined") {
    cb();
    return () => {};
  }
  const io = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) {
      io.disconnect();
      cb();
    }
  }, { rootMargin });
  io.observe(el);
  return () => io.disconnect();
}

/** Hero intro: the location scrambles in, the first name rises letter by letter, the surname
 *  settles from wide tracking, then the role and summary follow. */
export function heroIntro(root: HTMLElement) {
  const q = (s: string) => root.querySelector<HTMLElement>(s);
  const eyebrow = q(".hero-eyebrow"), first = q(".hero-first"), last = q(".hero-last");
  const role = q(".hero-role"), summary = q(".hero-summary"), place = q(".hero-place");
  if (!eyebrow || !first || !last || !role || !summary) return () => {};

  const split = splitText(first, { chars: { wrap: "clip" } });
  utils.set([eyebrow, role, summary], { opacity: 0, translateY: 14 });
  utils.set(split.chars, { translateY: "110%" });
  utils.set(last, { opacity: 0, letterSpacing: "0.32em", filter: "blur(6px)" });

  const tl = createTimeline({ defaults: { ease: "outExpo", duration: 900 } })
    .add(eyebrow, { opacity: 1, translateY: 0 }, 150)
    .add(split.chars, { translateY: "0%", duration: 800, delay: stagger(28) }, 300)
    .add(last, { opacity: 1, letterSpacing: "0.03em", filter: "blur(0px)", duration: 1300 }, 650)
    .add([role, summary], { opacity: 1, translateY: 0, delay: stagger(120) }, 1050);
  if (place) tl.add(place, { innerHTML: scrambleText({ chars: "アイウエオカキクケコサシスセソ", duration: 1100 }) }, 200);

  return () => {
    tl.revert();
    split.revert();
  };
}

/** Section title: the eyebrow fades up, the heading's letters rise from a clip, and the
 *  shuriken spins in from the side. */
export function titleReveal(root: HTMLElement) {
  const eyebrow = root.querySelector<HTMLElement>(".eyebrow");
  const heading = root.querySelector<HTMLElement>("h2");
  const shuriken = root.querySelector<HTMLElement>(".shuriken");
  const lead = root.querySelector<HTMLElement>(".lead");
  if (!heading) return () => {};

  const split = splitText(heading, { words: { wrap: "clip" }, chars: true });
  utils.set(split.chars, { translateY: "110%" });
  if (eyebrow) utils.set(eyebrow, { opacity: 0, translateY: 10 });
  if (lead) utils.set(lead, { opacity: 0, translateY: 12 });
  if (shuriken) utils.set(shuriken, { opacity: 0, rotate: -540, scale: 0.4, translateX: -120 });

  const tl = createTimeline({ autoplay: false, defaults: { ease: "outExpo", duration: 900 } });
  if (eyebrow) tl.add(eyebrow, { opacity: 1, translateY: 0 }, 0);
  tl.add(split.chars, { translateY: "0%", duration: 850, delay: stagger(24) }, 80);
  if (shuriken) tl.add(shuriken, { opacity: 1, rotate: 15, scale: 1, translateX: 0, duration: 1300, ease: "outQuart" }, 120);
  if (lead) tl.add(lead, { opacity: 1, translateY: 0 }, 420);

  const stop = onFirstView(root, () => tl.play());
  return () => {
    stop();
    tl.revert();
    split.revert();
  };
}

/** Counts a number up from zero when it scrolls into view, keeping its zero padding. */
export function countUp(el: HTMLElement) {
  const target = Number(el.textContent);
  if (!Number.isFinite(target)) return () => {};
  const width = el.textContent?.length ?? 2;
  const value = { n: 0 };
  el.textContent = "0".padStart(width, "0");
  let anim: ReturnType<typeof animate> | null = null;
  const stop = onFirstView(el, () => {
    anim = animate(value, {
      n: target,
      duration: 1400,
      ease: "outQuart",
      modifier: utils.round(0),
      onUpdate: () => {
        el.textContent = String(value.n).padStart(width, "0");
      },
    });
  });
  return () => {
    stop();
    anim?.revert();
    el.textContent = String(target).padStart(width, "0");
  };
}
