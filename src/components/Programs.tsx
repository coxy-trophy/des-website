import { PROGRAMS } from "../lib/data";
import { SectionHead } from "./ui";

export function Programs() {
  return (
    <section className="section" id="programs">
      <div className="wrap">
        <SectionHead label="The session" meta="3 programs" title="One session, three programs.">
          No GNOME or KDE underneath. The compositor owns the displays, the shell is the only thing it shows
          fullscreen, and everything else is a guest in the middle of the frame.
        </SectionHead>

        <div className="programs">
          <div className="diagram" role="img" aria-label="des-comp contains des-ui, which frames the applications; des-music talks to des-ui over a socket">
            <div className="diagram-comp">
              <span className="diagram-tag">des-comp · drives displays and input</span>
              <div className="diagram-shell">
                <span className="diagram-tag">des-ui · drawn fullscreen</span>
                <div className="diagram-frame">
                  <i>panels</i>
                  <div className="diagram-apps">
                    <b>terminal</b>
                    <span>and your applications,</span>
                    <span>Wayland or X11</span>
                  </div>
                  <i>panels</i>
                </div>
              </div>
            </div>
            <div className="diagram-link">
              <span>socket</span>
            </div>
            <div className="diagram-music">
              <span className="diagram-tag">des-music · no window</span>
              <span>plays through PipeWire</span>
            </div>
          </div>

          <ol className="program-list">
            {PROGRAMS.map((program) => (
              <li key={program.name}>
                <div className="program-name">
                  <code>{program.name}</code>
                  <span>{program.dir}</span>
                </div>
                <h3>{program.role}</h3>
                <p>{program.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
