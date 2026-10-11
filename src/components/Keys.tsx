import { useEffect, useState } from "react";
import { BINDINGS, KEYBOARD } from "../lib/data";
import { SectionHead } from "./ui";

export function Keys() {
  const [selected, setSelected] = useState("Space");
  const binding = BINDINGS[selected];

  // Pressing a bound key on a real keyboard picks it, without getting in its way.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLInputElement;
      if (!typing && event.code in BINDINGS) {
        setSelected(event.code);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="section" id="keys">
      <div className="wrap">
        <SectionHead label="Keys" meta="Hold Super" title="Everything is one key from the terminal.">
          Hold Super and press. The lit keys are bound; pick one here, or press it on your own keyboard.
        </SectionHead>

        <div className="keys">
          <div className="keyboard" aria-hidden="true">
            {KEYBOARD.map((row, y) => (
              <div className="keyboard-row" key={y}>
                {row.map((key, x) =>
                  key.code in BINDINGS ? (
                    <button
                      key={x}
                      className="key key-bound"
                      style={{ flexGrow: key.w ?? 1 }}
                      aria-pressed={selected === key.code}
                      tabIndex={-1}
                      onClick={() => setSelected(key.code)}
                    >
                      {key.label}
                    </button>
                  ) : (
                    <span key={x} className={key.code ? "key" : "key key-gap"} style={{ flexGrow: key.w ?? 1 }}>
                      {key.label}
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>

          <div className="readout brackets" aria-live="polite">
            <span className="readout-keys">{binding.keys}</span>
            <b>{binding.action}</b>
            <p>{binding.note ?? " "}</p>
          </div>
        </div>

        <ul className="key-list">
          {Object.entries(BINDINGS)
            .filter(([code]) => code !== "MetaLeft")
            .map(([code, item]) => (
              <li key={code}>
                <button aria-pressed={selected === code} onClick={() => setSelected(code)}>
                  <span>{item.action}</span>
                  <kbd>{item.keys.replace("Super + ", "")}</kbd>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
