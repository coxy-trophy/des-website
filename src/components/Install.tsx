import { INSTALL_STEPS, REPO } from "../lib/data";
import { pad } from "../lib/hooks";
import { CopyButton, SectionHead } from "./ui";

export function Install() {
  return (
    <section className="section" id="install">
      <div className="wrap">
        <SectionHead label="Install" meta="From source" title="Try it in a window first.">
          There are no packages yet; it builds from source with Cargo. Run it in a window inside the desktop you
          already have, and install it as a login session when you want to stay.
        </SectionHead>

        <div className="install">
          <div className="file">
            <div className="file-bar">
              <span>Terminal · Ubuntu or Debian</span>
              <CopyButton text={INSTALL_STEPS.map((step) => step.cmd).join("\n")} label="Copy all" />
            </div>
            <ol className="steps">
              {INSTALL_STEPS.map((step, i) => (
                <li key={step.cmd}>
                  <span>{pad(i + 1)}</span>
                  <code>{step.cmd}</code>
                  {step.note && <em># {step.note}</em>}
                </li>
              ))}
            </ol>
          </div>

          <ul className="install-notes">
            <li>
              <b>You need</b>
              <span>Linux, a Rust toolchain, and a GPU that Wayland can drive.</span>
            </li>
            <li>
              <b>In a window</b>
              <span>Ctrl+Alt stands in for Super, so the keys do not fight the desktop outside.</span>
            </li>
            <li>
              <b>Going back</b>
              <span>
                <code>./uninstall.sh</code> removes the session. Nothing else on the machine is replaced.
              </span>
            </li>
            <li>
              <b>Optional</b>
              <span>
                Its own login screen (<code>./install-login.sh</code>) and boot splash (
                <code>./install-boot-splash.sh</code>), each with an uninstall beside it.
              </span>
            </li>
          </ul>
        </div>

        <div className="closing">
          <h2>
            It is early.
            <br />
            <span>Come and break it.</span>
          </h2>
          <div className="actions">
            <a className="button button-primary" href={REPO}>
              Source on GitHub <span aria-hidden="true">→</span>
            </a>
            <a className="button" href={`${REPO}/issues`}>
              Report what broke
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
