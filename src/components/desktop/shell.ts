// The small pretend shell behind the terminal in the live desktop.

import { ACCENTS } from "../../lib/accent";

export type Tone = "dir" | "accent" | "dim" | "warn";
export type Seg = { text: string; tone?: Tone };
export type Line = Seg[];

export type Effect =
  | { type: "clear" }
  | { type: "launcher" }
  | { type: "settings" }
  | { type: "lock" }
  | { type: "split" }
  | { type: "accent"; name: string };

type Dir = { [name: string]: Dir | string };

const TREE: Dir = {
  Desktop: {},
  Documents: {},
  Downloads: {},
  Music: {},
  Pictures: { Screenshots: {} },
  Projects: {
    "des-ui": {
      common: {},
      compositor: {},
      music: {},
      session: {},
      shell: {},
      themes: { "signal.json": "The built-in theme. Your own go in ~/.config/des-ui/themes/." },
      "Cargo.toml": '[workspace]\nmembers = ["music", "shell", "common", "compositor"]',
      "README.md": "DEs-UI: a sci-fi terminal desktop for Linux, written in Rust.",
      "install.sh": "# Builds des-ui and registers it as a session on the login screen.",
    },
    "des-website": {},
  },
  Videos: { Recordings: {} },
  "notes.md": "Super+Space opens the launcher.\nSuper+, opens the settings.\nSuper+L locks the screen.",
  "todo.txt": "- keyboard layout setting\n- displays above one another\n- on-screen keyboard",
};

export const HOME: string[] = [];

function node(path: string[]): Dir | string | undefined {
  let at: Dir | string = TREE;
  for (const part of path) {
    if (typeof at === "string" || !(part in at)) {
      return undefined;
    }
    at = at[part];
  }
  return at;
}

function resolve(cwd: string[], target: string): string[] {
  const path = target.startsWith("~") ? [] : [...cwd];
  for (const part of target.replace(/^~/, "").split("/")) {
    if (part === "..") {
      path.pop();
    } else if (part && part !== ".") {
      path.push(part);
    }
  }
  return path;
}

export type Entry = { name: string; dir: boolean };

/** What a directory holds: directories first, each group by name. */
export function list(path: string[]): Entry[] {
  const at = node(path);
  if (!at || typeof at === "string") {
    return [];
  }
  return Object.entries(at)
    .map(([name, value]) => ({ name, dir: typeof value !== "string" }))
    .sort((a, b) => Number(b.dir) - Number(a.dir) || a.name.localeCompare(b.name));
}

export const shown = (path: string[]) => (path.length ? "~/" + path.join("/") : "~");

const plain = (text: string): Line[] => text.split("\n").map((row) => [{ text: row }]);

const HELP: Line[] = [
  [{ text: "This terminal is a small imitation. It knows:", tone: "dim" }],
  [{ text: "  ls  cd  pwd  cat", tone: "accent" }, { text: "    look around; the file browser below follows" }],
  [{ text: "  apps", tone: "accent" }, { text: "               open the launcher" }],
  [{ text: "  settings", tone: "accent" }, { text: "           open the settings" }],
  [{ text: "  theme <name>", tone: "accent" }, { text: "       " + ACCENTS.map((a) => a.name).join(", ") }],
  [{ text: "  split", tone: "accent" }, { text: "              share the workspace with an application" }],
  [{ text: "  lock", tone: "accent" }, { text: "               lock the screen" }],
  [{ text: "  clear", tone: "accent" }, { text: "              start over" }],
];

export function execute(input: string, cwd: string[]): { out: Line[]; cwd: string[]; effects: Effect[] } {
  const [command = "", ...args] = input.trim().split(/\s+/);
  const done = (out: Line[] = [], effects: Effect[] = [], next = cwd) => ({ out, cwd: next, effects });

  switch (command) {
    case "":
      return done();
    case "help":
      return done(HELP);
    case "clear":
      return done([], [{ type: "clear" }]);
    case "pwd":
      return done(plain("/home/ada" + (cwd.length ? "/" + cwd.join("/") : "")));
    case "whoami":
      return done(plain("ada"));
    case "date":
      return done(plain(new Date().toString()));
    case "uname":
      return done(plain(args.includes("-a") ? "Linux workstation 7.0.0-34-generic x86_64 GNU/Linux" : "Linux"));
    case "echo":
      return done(plain(args.join(" ")));
    case "ls": {
      const path = resolve(cwd, args[0] ?? ".");
      const at = node(path);
      if (at === undefined) {
        return done(plain(`ls: cannot access '${args[0]}': No such file or directory`));
      }
      if (typeof at === "string") {
        return done(plain(args[0]));
      }
      const entries = list(path);
      return done(
        entries.length
          ? [entries.flatMap((e): Seg[] => [{ text: e.name, tone: e.dir ? "dir" : undefined }, { text: "  " }])]
          : [],
      );
    }
    case "cd": {
      const path = resolve(cwd, args[0] ?? "~");
      const at = node(path);
      if (at === undefined) {
        return done(plain(`cd: no such file or directory: ${args[0]}`));
      }
      if (typeof at === "string") {
        return done(plain(`cd: not a directory: ${args[0]}`));
      }
      return done([], [], path);
    }
    case "cat": {
      if (!args[0]) {
        return done();
      }
      const at = node(resolve(cwd, args[0]));
      if (at === undefined) {
        return done(plain(`cat: ${args[0]}: No such file or directory`));
      }
      return done(plain(typeof at === "string" ? at : `cat: ${args[0]}: Is a directory`));
    }
    case "apps":
    case "launcher":
      return done([], [{ type: "launcher" }]);
    case "settings":
      return done([], [{ type: "settings" }]);
    case "lock":
      return done([], [{ type: "lock" }]);
    case "split":
      return done([], [{ type: "split" }]);
    case "theme": {
      const accent = ACCENTS.find((a) => a.name === args[0]);
      if (!accent) {
        return done(plain("theme: one of " + ACCENTS.map((a) => a.name).join(", ")));
      }
      return done([[{ text: `accent is now ${accent.name}`, tone: "dim" }]], [{ type: "accent", name: accent.name }]);
    }
    default:
      return done(plain(`zsh: command not found: ${command}`));
  }
}
