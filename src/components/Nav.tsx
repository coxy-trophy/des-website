import { REPO, SECTIONS } from "../lib/data";
import { pad, useActiveSection } from "../lib/hooks";

const IDS = SECTIONS.map((section) => section.id);

export function Nav() {
  const active = useActiveSection(IDS);
  return (
    <nav className="nav" aria-label="Sections">
      <div className="wrap nav-row">
        <a className="wordmark" href="#top" aria-label="DEs-UI, to the top">
          DEs-UI
        </a>
        <div className="nav-tabs">
          {SECTIONS.map(({ id, label }, i) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}>
              <span>{pad(i + 1)}</span> {label}
            </a>
          ))}
        </div>
        <a className="frame-button" href={REPO}>
          GitHub <small>Source</small>
        </a>
      </div>
    </nav>
  );
}
