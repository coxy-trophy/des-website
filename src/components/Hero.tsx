import { CLONE, REPO } from "../lib/data";
import { Desktop } from "./desktop/Desktop";
import { Command } from "./ui";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero-top">
          <div>
            <div className="chips">
              <span className="chip chip-live">In development</span>
              <span className="chip">Rust · Wayland · MIT</span>
            </div>
            <h1>
              Log in to
              <br />
              <span className="nowrap">
                the terminal
                <span className="cursor" aria-hidden="true" />
              </span>
            </h1>
          </div>
          <div className="hero-side">
            <p>
              DEs-UI is a sci-fi desktop for Linux, written in Rust: a Wayland compositor and a shell that run as
              their own login session. The terminal sits in the middle, the machine is drawn around it, and
              applications open inside the frame.
            </p>
            <div className="actions">
              <a className="button button-primary" href="#install">
                Install it <span aria-hidden="true">→</span>
              </a>
              <a className="button" href={REPO}>
                Source on GitHub
              </a>
            </div>
            <Command text={CLONE} />
          </div>
        </div>

        <Desktop />
        <p className="hero-caption">
          Not a video. This is the interface rebuilt for the browser: click the terminal and type{" "}
          <code>help</code>, press <code>APPS</code>, lock it. The readings are made up; the rest is how it behaves.
        </p>
      </div>
    </section>
  );
}
