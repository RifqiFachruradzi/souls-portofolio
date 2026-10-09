import { useLayoutEffect, useRef } from "react";
import { prefersReducedMotion, titleReveal } from "../motion";

type SectionTitleProps = { id: string; numeral: string; eyebrow: string; title: string; lead?: string };

export function SectionTitle({ id, numeral, eyebrow, title, lead }: SectionTitleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return undefined;
    return titleReveal(ref.current);
  }, [title]);

  return (
    <div ref={ref} className="section-title">
      <p className="eyebrow">
        <span className="numeral">{numeral}</span>
        {eyebrow}
      </p>
      <h2 id={id}>{title}</h2>
      <span className="rule" aria-hidden="true">
        <span className="shuriken" />
      </span>
      {lead ? <p className="lead">{lead}</p> : null}
    </div>
  );
}
