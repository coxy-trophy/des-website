// The desktop, rebuilt for the browser: the frame, a terminal that answers, the
// launcher, the settings, toasts and the lock screen.

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ACCENTS, useAccent } from "../../lib/accent";
import { pad, useMedia, useNow } from "../../lib/hooks";
import { Head, LeftColumn, RightColumn, dateLine } from "./panels";
import { HOME, execute, list, shown, type Effect, type Line } from "./shell";

const APPS = ["Calculator", "Calendar", "Files", "Firefox", "Image Viewer", "System Monitor", "Text Editor"];

const INTRO: Line[] = [
  [{ text: "DEs-UI", tone: "accent" }, { text: "  a sci-fi terminal desktop for Linux" }],
  [],
  [{ text: "Linux 7.0.0-34-generic" }],
  [{ text: "This one answers. Try: help", tone: "dim" }],
];

type Entry = { id: number; line: Line; prompt?: string };
type Toast = { id: number; from: string; title: string; text: string };
type View = "terminal" | "launcher" | "settings";

let serial = 0;
const entry = (line: Line, prompt?: string): Entry => ({ id: ++serial, line, prompt });

function Prompt({ path }: { path: string }) {
  return (
    <span className="dk-prompt">
      <span className="t-accent">ada@workstation</span> <span className="t-dim">{path}</span> %{" "}
    </span>
  );
}

function FolderIcon({ dir }: { dir: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">
      {dir ? <path d="M1.5 3.5h5l1.5 2h6.5v8h-13z" /> : <path d="M3.5 1.5h6l3 3v10h-9z M9.5 1.5v3h3" />}
    </svg>
  );
}

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const now = useNow();
  const pattern = ["xx.xx", ".xxx.", "xx.xx", "..x..", "d...d"];
  return (
    <form
      className="dk-lock"
      onSubmit={(event) => {
        event.preventDefault();
        onUnlock();
      }}
    >
      <div className="dk-lock-top">
        <span>
          DEs-UI <b>Locked</b>
        </span>
        <span>
          <strong>
            {pad(now.getHours())}:{pad(now.getMinutes())}
          </strong>{" "}
          {dateLine(now).slice(0, -5)}
        </span>
      </div>
      <div className="dk-avatar brackets">
        {pattern.flatMap((row, y) => [...row].map((cell, x) => <i key={`${x}${y}`} data-cell={cell} />))}
      </div>
      <div className="dk-lock-name">ada</div>
      <label className="dk-lock-field">
        <span>Password</span>
        <input type="password" autoComplete="off" autoFocus aria-label="Password (anything unlocks this one)" />
      </label>
      <div className="dk-lock-hint">ENTER to unlock. Any password will do here.</div>
      <div className="dk-lock-foot">Your session is still running behind this screen.</div>
    </form>
  );
}

export function Desktop() {
  const { accent, setAccent } = useAccent();
  const wide = useMedia("(min-width: 1100px)");
  const medium = useMedia("(min-width: 760px)");

  const [entries, setEntries] = useState<Entry[]>(() => INTRO.map((line) => entry(line)));
  const [cwd, setCwd] = useState(HOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [recall, setRecall] = useState(0);
  const [focused, setFocused] = useState(false);

  const [view, setView] = useState<View>("terminal");
  const [apps, setApps] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [split, setSplit] = useState(false);
  const [locked, setLocked] = useState(false);
  const [query, setQuery] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [panels, setPanels] = useState({ left: true, bottom: true, right: true });

  const field = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // Narrow screens start with the side panels collapsed, as Super+[ and ] would.
  useEffect(() => setPanels({ left: medium, bottom: medium, right: wide }), [wide, medium]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [entries, view, current]);

  const toast = (from: string, title: string, text: string) => {
    const id = ++serial;
    setToasts((all) => [...all.slice(-1), { id, from, title, text }]);
    setTimeout(() => setToasts((all) => all.filter((t) => t.id !== id)), 5000);
  };

  const focusTerminal = () => field.current?.focus({ preventScroll: true });

  const toTerminal = () => {
    setView("terminal");
    setCurrent(null);
    setTimeout(focusTerminal);
  };

  const toggleSplit = () => {
    if (apps.length === 0) {
      toast("des-ui", "Nothing to split with", "Open an application first: APPS, or type apps.");
      return;
    }
    setSplit((on) => !on);
    setCurrent((app) => app ?? apps[apps.length - 1]);
  };

  const apply = (effect: Effect) => {
    switch (effect.type) {
      case "clear":
        setEntries([]);
        break;
      case "launcher":
        setQuery("");
        setView("launcher");
        break;
      case "settings":
        setView("settings");
        break;
      case "lock":
        setLocked(true);
        break;
      case "split":
        toggleSplit();
        break;
      case "accent":
        setAccent(ACCENTS.find((a) => a.name === effect.name) ?? ACCENTS[0]);
        break;
    }
  };

  const run = (command: string) => {
    const result = execute(command, cwd);
    setEntries((all) => [...all, entry([{ text: command }], shown(cwd)), ...result.out.map((line) => entry(line))].slice(-200));
    setCwd(result.cwd);
    result.effects.forEach(apply);
    if (command.trim()) {
      setHistory((all) => [...all, command]);
    }
    setRecall(0);
    setInput("");
  };

  const onTerminalKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      run(input);
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = Math.max(0, Math.min(history.length, recall + (event.key === "ArrowUp" ? 1 : -1)));
      setRecall(next);
      setInput(next ? history[history.length - next] : "");
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
    }
  };

  const open = (app: string) => {
    setApps((all) => (all.includes(app) ? all : [...all, app]));
    setCurrent(app);
    setView("terminal");
  };

  const close = (app: string) => {
    const rest = apps.filter((a) => a !== app);
    setApps(rest);
    setCurrent((c) => (c === app ? (rest[rest.length - 1] ?? null) : c));
    if (rest.length === 0) {
      setSplit(false);
    }
  };

  const matches = APPS.filter((app) => app.toLowerCase().includes(query.trim().toLowerCase()));
  const files = list(cwd);
  const showApp = view === "terminal" && current !== null;
  const showTerminal = view === "terminal" && (current === null || split);
  const keyboard = locked
    ? "Lock screen"
    : view !== "terminal"
      ? view
      : current && !(split && focused)
        ? current
        : "Terminal";

  const terminal = (
    <div className="dk-term" ref={scroller} onClick={focusTerminal}>
      {entries.map(({ id, line, prompt }) => (
        <div className="dk-line" key={id}>
          {prompt !== undefined && <Prompt path={prompt} />}
          {line.map((seg, i) => (
            <span key={i} className={seg.tone && `t-${seg.tone}`}>
              {seg.text}
            </span>
          ))}
        </div>
      ))}
      <div className="dk-line dk-input">
        <Prompt path={shown(cwd)} />
        <input
          ref={field}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onTerminalKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Terminal"
        />
      </div>
    </div>
  );

  return (
    <div
      className="dk"
      data-left={panels.left}
      data-right={panels.right}
      onKeyDown={(event) => {
        if (event.key === "Escape" && view !== "terminal") {
          toTerminal();
        }
      }}
    >
      {panels.left && <LeftColumn />}

      <div className="dk-main">
        <div className="dk-tabs" role="tablist" aria-label="Terminal and applications">
          <button
            role="tab"
            aria-selected={view === "terminal" && current === null}
            className="dk-tab"
            onClick={toTerminal}
          >
            <span>01</span> Main <small>zsh</small>
          </button>
          {apps.map((app) => (
            <span className="dk-tab" role="tab" aria-selected={showApp && current === app} key={app}>
              <button onClick={() => open(app)}>{app}</button>
              <button className="dk-tab-close" onClick={() => close(app)} aria-label={`Close ${app}`}>
                ×
              </button>
            </span>
          ))}
          <span className="dk-tabs-space" />
          <button className="dk-button" aria-pressed={split} onClick={toggleSplit}>
            Split
          </button>
          <button
            className="dk-button"
            aria-pressed={view === "launcher"}
            onClick={() => (view === "launcher" ? toTerminal() : apply({ type: "launcher" }))}
          >
            Apps <small>{view === "launcher" ? "Esc" : "Super Space"}</small>
          </button>
        </div>

        <div className="dk-workspace" data-split={showApp && split}>
          {showTerminal && terminal}

          {showApp && (
            <div className="dk-app">
              <div className="dk-app-bar">
                <span>{current}</span>
                <i />
                <i />
                <i />
              </div>
              <div className="dk-app-body">
                <b>{current}</b>
                <p>An application, placed in the middle of the frame. The real ones are whatever you have installed.</p>
              </div>
            </div>
          )}

          {view === "launcher" && (
            <div className="dk-launcher">
              <div className="dk-over-label">Open an application</div>
              <label className="dk-search">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">
                  <circle cx="7" cy="7" r="4.5" />
                  <path d="M10.5 10.5l4 4" />
                </svg>
                <input
                  autoFocus
                  value={query}
                  placeholder="type a name"
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && matches[0]) {
                      open(matches[0]);
                    }
                  }}
                  spellCheck={false}
                  aria-label="Search applications"
                />
                <span>
                  {matches.length} of {APPS.length}
                </span>
              </label>
              <div className="dk-results">
                {matches.map((app, i) => (
                  <button key={app} className="dk-result" data-first={i === 0} onClick={() => open(app)}>
                    <i>{app[0]}</i>
                    {app}
                    {i === 0 && <small>Enter</small>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === "settings" && (
            <div className="dk-settings">
              <div className="dk-over-label">Settings · Appearance</div>
              <div className="dk-setting">
                <span>Accent</span>
                <div className="dk-choices">
                  {ACCENTS.map((choice) => (
                    <button
                      key={choice.name}
                      aria-pressed={accent.name === choice.name}
                      onClick={() => setAccent(choice)}
                      style={{ "--swatch": `rgb(${choice.rgb.join(" ")})` } as CSSProperties}
                    >
                      <i />
                      {choice.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="dk-over-label">Frame</div>
              {(["left", "bottom", "right"] as const).map((side) => (
                <div className="dk-setting" key={side}>
                  <span>{side} panel</span>
                  <div className="dk-choices">
                    <button aria-pressed={panels[side]} onClick={() => setPanels({ ...panels, [side]: true })}>
                      Open
                    </button>
                    <button aria-pressed={!panels[side]} onClick={() => setPanels({ ...panels, [side]: false })}>
                      Collapsed
                    </button>
                  </div>
                </div>
              ))}
              <p className="dk-settings-note">
                Changes apply at once. The real settings have twelve sections; this is two of them. Esc closes.
              </p>
            </div>
          )}

          <div className="dk-toasts" aria-live="polite">
            {toasts.map((t) => (
              <div className="dk-toast brackets" key={t.id}>
                <div className="dk-toast-from">
                  <i className="dk-dot" />
                  {t.from}
                  <button onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))} aria-label="Dismiss">
                    ×
                  </button>
                </div>
                <b>{t.title}</b>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>

        {panels.bottom && (
          <div className="dk-files">
            <Head label={`Files ${shown(cwd)}`} meta={`${files.length} items · follows the terminal`} />
            <div className="dk-file-grid">
              {cwd.length > 0 && (
                <button className="dk-file" onClick={() => run("cd ..")}>
                  <FolderIcon dir /> ..
                </button>
              )}
              {files.map((file) => (
                <button
                  className="dk-file"
                  key={file.name}
                  data-dir={file.dir}
                  onClick={() => run(`${file.dir ? "cd" : "cat"} ${file.name}`)}
                >
                  <FolderIcon dir={file.dir} /> {file.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {panels.right && <RightColumn />}

      <div className="dk-strip">
        <b>DEs-UI</b>
        <button onClick={() => (view === "settings" ? toTerminal() : setView("settings"))}>Settings</button>
        <button onClick={() => toast("des-music", "Not in the browser", "The player needs Spotify, and a real session. See the tour below.")}>
          Music
        </button>
        <button onClick={() => setLocked(true)}>Lock</button>
        <button onClick={() => toast("des-ui", "Notifications", "What applications announce shows here, above whatever is open.")}>
          Notifications
        </button>
        <span className="dk-strip-state">{keyboard} has the keyboard</span>
        <span className="dk-strip-space" />
        {(["left", "bottom", "right"] as const).map((side) => (
          <button
            key={side}
            className="dk-switch"
            data-side={side}
            aria-pressed={panels[side]}
            aria-label={`${side} panel`}
            title={`${side} panel`}
            onClick={() => setPanels({ ...panels, [side]: !panels[side] })}
          >
            <i />
          </button>
        ))}
        <span className="dk-strip-extra">
          {apps.length} application{apps.length === 1 ? "" : "s"}
        </span>
        <span className="dk-strip-extra">WiFi 100%</span>
      </div>

      {locked && (
        <LockScreen
          onUnlock={() => {
            setLocked(false);
            setTimeout(focusTerminal);
          }}
        />
      )}
    </div>
  );
}
