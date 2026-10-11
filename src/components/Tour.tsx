import { useState } from "react";
import { SHOTS } from "../lib/data";
import { pad } from "../lib/hooks";
import { SectionHead } from "./ui";

export function Tour() {
  const [selected, setSelected] = useState(0);
  const shot = SHOTS[selected];

  return (
    <section className="section" id="tour">
      <div className="wrap">
        <SectionHead label="The tour" meta={`${SHOTS.length} screens`} title="Six screens, none of them staged.">
          The same pictures as the README, taken from the running desktop.
        </SectionHead>

        <div className="tour">
          <div className="tour-tabs" role="tablist" aria-label="Screens" aria-orientation="vertical">
            {SHOTS.map((item, i) => (
              <button
                key={item.id}
                role="tab"
                id={`tour-tab-${item.id}`}
                aria-selected={i === selected}
                aria-controls="tour-panel"
                onClick={() => setSelected(i)}
              >
                <span>{pad(i + 1)}</span>
                <b>{item.label}</b>
                <p>{item.text}</p>
              </button>
            ))}
          </div>
          <div className="tour-shot brackets" role="tabpanel" id="tour-panel" aria-labelledby={`tour-tab-${shot.id}`}>
            <img key={shot.id} src={shot.src} alt={shot.alt} width={1600} height={1008} loading="lazy" />
          </div>
          <p className="tour-caption">{shot.text}</p>
        </div>
      </div>
    </section>
  );
}
