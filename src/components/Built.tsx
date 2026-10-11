import { FEATURES } from "../lib/data";
import { pad } from "../lib/hooks";
import { SectionHead } from "./ui";

export function Built() {
  return (
    <section className="section" id="built">
      <div className="wrap">
        <SectionHead label="What is built" meta={`${FEATURES.length} parts`} title="A desktop to live in, not a wallpaper.">
          Enough to log in on Monday and not log out: the parts a session needs once the terminal stops being the
          only thing you use.
        </SectionHead>

        <ul className="features">
          {FEATURES.map((feature, i) => (
            <li key={feature.name}>
              <span>{pad(i + 1)}</span>
              <h3>{feature.name}</h3>
              <p>{feature.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
