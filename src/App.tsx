import { Nav } from "./components/Nav";
import { Reveal } from "./components/Reveal";
import { ValleyBackground } from "./components/ValleyBackground";
import { LeafMark } from "./components/LeafMark";
import { SectionTitle } from "./components/SectionTitle";
import { contacts, education, profile, projects, quests, skills } from "./data/profile";
import photo from "./assets/profile-photo.jpg";

const KANJI = ["壱", "弐", "参", "肆", "伍", "陸", "漆", "捌", "玖", "拾"];

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <LeafMark className="hero-leaf" size={18} />
            Valley of the End · {profile.location}
          </p>
          <h1 id="hero-name">
            <span className="hero-first">Muhammad Rifqi</span>
            <span className="hero-last">Fachruradzi</span>
          </h1>
          <p className="hero-role">{profile.role}</p>
          <p className="hero-summary">{profile.dialog[1]} {profile.dialog[2]}</p>
        </div>
      </div>
      <a className="scroll-cue" href="#bonfire" aria-label="Scroll to About">
        <span aria-hidden="true" />
      </a>
    </section>
  );
}

function Bonfire() {
  return (
    <section className="section" id="bonfire" aria-labelledby="bonfire-title">
      <SectionTitle id="bonfire-title" numeral="壱" eyebrow="Rest by the falls" title="About Me" />
      <div className="bonfire-grid">
        <Reveal className="profile-card">
          <p className="profile-title">Shinobi Profile</p>
          <figure className="profile-photo">
            <img src={photo} alt={`Portrait of ${profile.name}`} loading="lazy" width={472} height={709} />
          </figure>
          <p className="profile-plate">
            <span>Shinobi of Code</span>
            <span>{profile.role}</span>
          </p>
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
            <p className="covenant-label">Academy · Education</p>
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
        numeral="弐"
        eyebrow="Missions completed"
        title="The Journey"
        lead="Three roles across Indonesia's logistics tech, from Python services to Go microservices and micro-frontends."
      />
      <ol className="journey">
        {quests.map((quest, index) => (
          <Reveal as="li" key={quest.id} className="quest" delay={index * 60}>
            <div className="quest-marker" aria-hidden="true"><span>{KANJI[index]}</span></div>
            <article>
              <header>
                <p className={`quest-status quest-status--${quest.status}`}>
                  {quest.status === "active" ? "Active mission" : "Mission complete"}
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
                  <summary>Read {quest.points.length - 3} more details</summary>
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
        numeral="参"
        eyebrow="Scrolls written"
        title="Projects"
        lead="Enterprise-grade apps, AI experiments, and a thesis, each built end to end."
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
      <SectionTitle id="attributes-title" numeral="肆" eyebrow="Techniques mastered" title="Jutsu & Skills" lead="The tools I reach for, from the backend to the browser." />
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
        numeral="伍"
        eyebrow="Summoning jutsu"
        title="Summon Me"
        lead="Open to full stack and backend roles, collaborations, and interesting problems. Messages answered before the next mission."
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
      <ValleyBackground />
      <Nav />
      <main>
        <Hero />
        <Bonfire />
        <Journey />
        <Relics />
        <Attributes />
        <Summon />
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p className="footer-note">Background: the Valley of the End, pixelated and set in motion.</p>
      </footer>
    </>
  );
}
