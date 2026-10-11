import { useAccent } from "../lib/accent";
import { SECTIONS } from "../lib/data";
import { pad, useActiveSection, useNow, useScrollPercent } from "../lib/hooks";

const IDS = SECTIONS.map((section) => section.id);

/** The strip along the bottom of the page, after the one along the bottom of the desktop. */
export function StatusStrip() {
  const now = useNow();
  const percent = useScrollPercent();
  const active = useActiveSection(IDS);
  const { accent } = useAccent();
  const label = SECTIONS.find((section) => section.id === active)?.label ?? "Overview";

  return (
    <div className="status" aria-hidden="true">
      <b>DEs-UI</b>
      <span className="status-accent">{label} is on screen</span>
      <span className="status-space" />
      <span className="status-extra">MIT</span>
      <span className="status-extra">Accent {accent.name}</span>
      <span>Page {pad(percent)}%</span>
      <span>
        {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
      </span>
    </div>
  );
}
