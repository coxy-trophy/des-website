import { NOT_DONE, REPO } from "../lib/data";
import { SectionHead } from "./ui";

export function NotDone() {
  return (
    <section className="section" id="not-done">
      <div className="wrap">
        <SectionHead label="Not done yet" meta={`${NOT_DONE.length} open`} title="What is missing, said plainly.">
          It is one person's desktop, opened up while it is still being built. Expect rough edges, and things that
          pass their tests but have not yet been watched working on a second machine.
        </SectionHead>

        <ul className="missing">
          {NOT_DONE.map((item) => (
            <li key={item.name}>
              <b>{item.name}</b>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
        <p className="aside">
          The list of things built but not yet tried on real hardware is kept in the repository, at{" "}
          <a href={`${REPO}/blob/main/docs/UNTESTED.md`}>docs/UNTESTED.md</a>. Ticking one off is a good first
          contribution.
        </p>
      </div>
    </section>
  );
}
