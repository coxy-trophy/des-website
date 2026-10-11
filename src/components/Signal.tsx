import type { CSSProperties } from "react";
import { ACCENTS, fromHex, hex, themeFile, useAccent } from "../lib/accent";
import { CopyButton, SectionHead } from "./ui";

const GREYS = [
  ["Ground", "#06080B"],
  ["Panel", "#0A0E12"],
  ["Track", "#141B22"],
  ["Line", "#1A232B"],
  ["Line, strong", "#2A3742"],
  ["Label", "#6F8492"],
  ["Secondary", "#8FA3B0"],
  ["Text", "#DCE7EC"],
];

export function Signal() {
  const { accent, setAccent } = useAccent();
  const [r, g, b] = accent.rgb;

  return (
    <section className="section" id="signal">
      <div className="wrap">
        <SectionHead label="Signal" meta="The look" title="One accent. Everything else holds still.">
          The look is called Signal: fixed greys, two typefaces, flat fills, one-pixel lines, square corners. The
          accent marks only what is live, selected, or has the keyboard. A theme sets that accent and the
          terminal's colours.
        </SectionHead>

        <div className="signal">
          <div>
            <div className="rule">
              <span className="rule-label">Accent</span>
              <span className="rule-line" />
              <span className="rule-meta">{hex(accent.rgb)}</span>
            </div>
            <div className="swatches">
              {ACCENTS.map((choice) => (
                <button
                  key={choice.name}
                  aria-pressed={choice.name === accent.name}
                  onClick={() => setAccent(choice)}
                  style={{ "--swatch": `rgb(${choice.rgb.join(" ")})` } as CSSProperties}
                >
                  <i />
                  {choice.name}
                </button>
              ))}
              <label data-selected={accent.name === "custom"}>
                <input
                  type="color"
                  value={hex(accent.rgb)}
                  onChange={(event) => setAccent({ name: "custom", rgb: fromHex(event.target.value) })}
                />
                Your own
              </label>
            </div>
            <p className="signal-note">
              Pick one and this whole page changes with it, the desktop at the top included. That is all a theme
              has to do.
            </p>

            <div className="rule">
              <span className="rule-label">The fixed greys</span>
              <span className="rule-line" />
              <span className="rule-meta">shell/src/ui.rs</span>
            </div>
            <ul className="greys">
              {GREYS.map(([name, value]) => (
                <li key={name}>
                  <i style={{ background: value }} />
                  <span>{name}</span>
                  <code>{value}</code>
                </li>
              ))}
            </ul>

            <div className="faces">
              <div>
                <span className="face-display">Chakra Petch</span>
                <p>Names things: the clock, titles, tabs, section labels.</p>
              </div>
              <div>
                <span className="face-mono">JetBrains Mono</span>
                <p>Everything measured or typed.</p>
              </div>
            </div>
          </div>

          <div className="file">
            <div className="file-bar">
              <span>~/.config/des-ui/themes/{accent.name}.json</span>
              <CopyButton text={themeFile(accent)} label="Copy file" />
            </div>
            <pre>
              <code>
                {"{\n"}
                {'    "colors": {\n'}
                {'        "r": '}
                <mark>{r}</mark>
                {',\n        "g": '}
                <mark>{g}</mark>
                {',\n        "b": '}
                <mark>{b}</mark>
                {',\n        "black": "#06080B",\n        "light_black": "#0A0E12"\n    },\n'}
                {'    "terminal": {\n        "foreground": "#DCE7EC",\n        "background": "#06080B",\n'}
                {'        "cursor": "'}
                <mark>{hex(accent.rgb)}</mark>
                {'",\n        …\n    }\n}'}
              </code>
            </pre>
            <p className="file-note">
              The JSON format is the one eDEX-UI uses, so its theme files work here: copy them into the same
              folder. Signal is the theme that ships.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
