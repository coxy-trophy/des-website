import { useState, type ReactNode } from "react";
import { copyText } from "../lib/hooks";

/** A section's opening: a panel-style label line, then the heading and what follows. */
export function SectionHead({
  label,
  meta,
  title,
  children,
}: {
  label: string;
  meta?: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="section-head">
      <div className="rule">
        <span className="rule-label">{label}</span>
        <span className="rule-line" />
        {meta && <span className="rule-meta">{meta}</span>}
      </div>
      <h2>{title}</h2>
      {children && <p className="lede">{children}</p>}
    </header>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  return (
    <button
      className="copy"
      onClick={async () => {
        setState((await copyText(text)) ? "done" : "failed");
        setTimeout(() => setState("idle"), 1600);
      }}
    >
      {state === "idle" ? label : state === "done" ? "Copied" : "Select it instead"}
    </button>
  );
}

export function Command({ text }: { text: string }) {
  return (
    <div className="command">
      <span className="command-sign">$</span>
      <code>{text}</code>
      <CopyButton text={text} />
    </div>
  );
}
