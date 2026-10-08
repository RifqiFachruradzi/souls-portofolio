import { Nav } from "./components/Nav";
import { Reveal } from "./components/Reveal";
import { HoloScene } from "./components/HoloScene";
import { SectionTitle } from "./components/SectionTitle";
import { contacts, education, profile, projects, quests, skills } from "./data/profile";
import portrait from "./assets/FotoFormal.jpeg";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <HoloScene mode="shrine" className="shrine-bg" label="Candlelit sword shrine" />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <span className="ember-dot" aria-hidden="true" />
            Bonfire Archive · {profile.location}
          </p>
          <h1 id="hero-name">
            <span className="hero-first">Muhammad Rifqi</span>
            <span className="hero-last">Fachruradzi</span>
          </h1>
          <p className="hero-role">{profile.role}</p>
          <p className="hero-summary">{profile.dialog[1]} {profile.dialog[2]}</p>
        </div>
      </div>
      <a className="scroll-cue" href="#ashen-one" aria-label="Scroll to the card">
        <span aria-hidden="true" />
      </a>
    </section>
  );
}

function AshenCard() {
  return (
    <section className="section ashen" id="ashen-one" aria-labelledby="ashen-title">
      <div className="ashen-grid">
        <div className="ashen-copy">
          <SectionTitle
            id="ashen-title"
            numeral="✦"
            eyebrow="Bonfire Archive · 001 / 001"
            title="The Ashen One"
            lead="A holographic card, kindled at the bonfire. Hover to tilt it, drag to rotate it, and double-click to turn it over."
          />
          <Reveal as="ul" className="ashen-hints" delay={80}>
            <li><span>Hover</span>Tilt the card toward the light</li>
            <li><span>Drag</span>Rotate it in your hand</li>
            <li><span>Double-click</span>Flip it to read the back</li>
          </Reveal>
        </div>
        <Reveal className="ashen-card" delay={120}>
          <HoloScene mode="card" className="card-frame" label="The Ashen One, an interactive holographic card" />
        </Reveal>
      </div>
    </section>
  );
}

function Bonfire() {
  return (
    <section className="section" id="bonfire" aria-labelledby="bonfire-title">
      <SectionTitle id="bonfire-title" numeral="I" eyebrow="Rest at the bonfire" title="About the Ashen One" />
      <div className="bonfire-grid">
        <Reveal className="portrait">
          <img src={portrait} alt={`Portrait of ${profile.name}`} loading="lazy" width={420} height={525} />
          <span className="portrait-caption">{profile.name}</span>
        </Reveal>
        <div className="bonfire-copy">
          <Reveal as="p" className="summary">{profile.summary}</Reveal>
          <Reveal delay={80}>
            <dl className="sheet">
              {profile.attributes.map((attr) => (
                <div key={attr.key}>
                  <dt>{attr.key}</dt>
                  <dd>{attr.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal className="covenant" delay={140}>
            <p className="covenant-label">Covenant · Education</p>
            <h3>{education.degree}</h3>
            <p className="covenant-meta">{education.school} · {education.period}</p>
            <p className="covenant-note">{education.note}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="section" id="journey" aria-labelledby="journey-title">
      <SectionTitle id="journey-title"
        numeral="II"
        eyebrow="Lands traversed"
        title="The Journey"
        lead="Three roles across Indonesia's logistics tech, from Python services to Go microservices and micro-frontends."
      />
      <ol className="journey">
        {quests.map((quest, index) => (
          <Reveal as="li" key={quest.id} className="quest" delay={index * 60}>
            <div className="quest-marker" aria-hidden="true"><span>{ROMAN[index]}</span></div>
            <article>
              <header>
                <p className={`quest-status quest-status--${quest.status}`}>
                  {quest.status === "active" ? "Active · Kindled" : "Cleared"}
                </p>
                <h3>{quest.title}</h3>
                <p className="quest-meta">
                  <span>{quest.company}</span>
                  <span>{quest.period}</span>
                </p>
                <p className="quest-project">{quest.project}</p>
              </header>
              <ul className="quest-points">
                {quest.points.slice(0, 3).map((point) => <li key={point}>{point}</li>)}
              </ul>
              {quest.points.length > 3 ? (
                <details className="quest-more">
                  <summary>Read {quest.points.length - 3} more deeds</summary>
                  <ul className="quest-points">
                    {quest.points.slice(3).map((point) => <li key={point}>{point}</li>)}
                  </ul>
                </details>
              ) : null}
              <ul className="tags" aria-label="Technologies">
                {quest.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            </article>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

function Relics() {
  return (
    <section className="section" id="relics" aria-labelledby="relics-title">
      <SectionTitle id="relics-title"
        numeral="III"
        eyebrow="Items obtained"
        title="Relics & Projects"
        lead="Enterprise-grade apps, AI experiments, and a thesis — each forged end to end."
      />
      <div className="relics">
        {projects.map((project, index) => (
          <Reveal as="article" key={project.title} className="relic" delay={(index % 3) * 70}>
            <p className="relic-kind">
              <span>{project.kind}</span>
              <span>{project.period}</span>
            </p>
            <h3>{project.title}</h3>
            <p className="relic-desc">{project.description}</p>
            <ul className="relic-highlights">
              {project.highlights.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <ul className="tags" aria-label="Technologies">
              {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
            {project.demo || project.repo ? (
              <p className="relic-links">
                {project.demo ? <a href={project.demo} target="_blank" rel="noreferrer">Live demo</a> : null}
                {project.repo ? (
                  <a href={project.repo} target="_blank" rel="noreferrer">{project.repo2 ? "Frontend" : "Source"}</a>
                ) : null}
                {project.repo2 ? <a href={project.repo2} target="_blank" rel="noreferrer">Backend</a> : null}
              </p>
            ) : null}
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Attributes() {
  return (
    <section className="section" id="attributes" aria-labelledby="attributes-title">
      <SectionTitle id="attributes-title" numeral="IV" eyebrow="Level up" title="Attributes" lead="The stats this build has invested in." />
      <div className="attributes">
        {skills.map((group, index) => (
          <Reveal key={group.title} className="attribute" delay={index * 60}>
            <h3>
              <span className="attribute-level">{String(group.items.length).padStart(2, "0")}</span>
              <span className="attribute-name">{group.title}</span>
            </h3>
            <ul>
              {group.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Summon() {
  return (
    <section className="section summon" id="summon" aria-labelledby="summon-title">
      <SectionTitle id="summon-title"
        numeral="V"
        eyebrow="Co-op"
        title="Place a Summon Sign"
        lead="Open to full stack and backend roles, collaborations, and interesting problems. Messages answered by the next bonfire."
      />
      <Reveal className="summon-links">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target={contact.href.startsWith("http") ? "_blank" : undefined}
            rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
          >
            <span className="summon-label">{contact.label}</span>
            <span className="summon-value">{contact.value}</span>
          </a>
        ))}
      </Reveal>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <AshenCard />
        <Bonfire />
        <Journey />
        <Relics />
        <Attributes />
        <Summon />
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p className="footer-note">Holo card: ThreeUI · Dark Souls Holo Card, “The Ashen One”.</p>
      </footer>
    </>
  );
}
