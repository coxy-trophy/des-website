import { WAYS_OUT } from "../lib/data";
import { SectionHead } from "./ui";

export function WaysOut() {
  return (
    <section className="section" id="ways-out">
      <div className="wrap">
        <SectionHead label="Ways out" meta="When it goes wrong" title="Built by someone logged in to it.">
          A desktop under construction breaks. Each of these exists because being stranded at a blank screen was
          the alternative.
        </SectionHead>

        <dl className="ways">
          {WAYS_OUT.map((way) => (
            <div key={way.when}>
              <dt>{way.when}</dt>
              <dd>{way.then}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
