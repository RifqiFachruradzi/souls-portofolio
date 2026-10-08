import { Reveal } from "./Reveal";

type SectionTitleProps = { id: string; numeral: string; eyebrow: string; title: string; lead?: string };

export function SectionTitle({ id, numeral, eyebrow, title, lead }: SectionTitleProps) {
  return (
    <Reveal className="section-title">
      <p className="eyebrow">
        <span className="numeral">{numeral}</span>
        {eyebrow}
      </p>
      <h2 id={id}>{title}</h2>
      <span className="rule" aria-hidden="true" />
      {lead ? <p className="lead">{lead}</p> : null}
    </Reveal>
  );
}
