import { EDEX, LINEAGE } from "../lib/data";
import { SectionHead } from "./ui";

export function Lineage() {
  return (
    <section className="section" id="lineage">
      <div className="wrap">
        <SectionHead label="Lineage" meta="After eDEX-UI" title="Inspired by eDEX-UI.">
          DEs-UI began as a rewrite of <a href={EDEX}>eDEX-UI</a> by GitSquared, the sci-fi terminal that made
          this look famous, archived in 2021. It takes the idea one step further: instead of an application that
          covers your desktop, it is the desktop. No code is shared; only the theme format is.
        </SectionHead>

        <div className="lineage" role="table" aria-label="eDEX-UI beside DEs-UI">
          <div role="row" className="lineage-head">
            <span role="columnheader" />
            <span role="columnheader">eDEX-UI</span>
            <span role="columnheader">DEs-UI</span>
          </div>
          {LINEAGE.map(([what, edex, des]) => (
            <div role="row" key={what}>
              <span role="rowheader">{what}</span>
              <span role="cell">{edex}</span>
              <span role="cell">{des}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
