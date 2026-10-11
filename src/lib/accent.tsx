import { createContext, use, useEffect, useState, type ReactNode } from "react";

export type Rgb = [number, number, number];
export type Accent = { name: string; rgb: Rgb };

/** Signal's own accent, then the other colours of its terminal palette. */
export const ACCENTS: Accent[] = [
  { name: "signal", rgb: [79, 227, 216] },
  { name: "green", rgb: [126, 224, 160] },
  { name: "blue", rgb: [111, 179, 255] },
  { name: "magenta", rgb: [199, 155, 255] },
  { name: "red", rgb: [255, 122, 107] },
  { name: "yellow", rgb: [245, 184, 90] },
];

export const hex = ([r, g, b]: Rgb) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

export const fromHex = (value: string): Rgb => [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16)) as Rgb;

const STORE = "des-website.accent";

function saved(): Accent {
  try {
    const value = JSON.parse(localStorage.getItem(STORE) ?? "null");
    if (typeof value?.name === "string" && Array.isArray(value.rgb) && value.rgb.length === 3) {
      return value;
    }
  } catch {
    // Storage is unavailable or holds something else: start from the default.
  }
  return ACCENTS[0];
}

const AccentContext = createContext<{ accent: Accent; setAccent: (accent: Accent) => void }>({
  accent: ACCENTS[0],
  setAccent: () => {},
});

export function AccentProvider({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState(saved);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent-rgb", accent.rgb.join(" "));
    try {
      localStorage.setItem(STORE, JSON.stringify(accent));
    } catch {
      // Not remembered, which is fine.
    }
  }, [accent]);

  return <AccentContext value={{ accent, setAccent }}>{children}</AccentContext>;
}

export const useAccent = () => use(AccentContext);

/** A theme file for `~/.config/des-ui/themes/`: Signal with another accent. */
export function themeFile({ rgb }: Accent): string {
  const [r, g, b] = rgb;
  return `{
    "colors": {
        "r": ${r},
        "g": ${g},
        "b": ${b},
        "black": "#06080B",
        "light_black": "#0A0E12"
    },
    "terminal": {
        "foreground": "#DCE7EC",
        "background": "#06080B",
        "cursor": "${hex(rgb)}",
        "black": "#141B22",
        "red": "#FF7A6B",
        "green": "#7EE0A0",
        "yellow": "#F5B85A",
        "blue": "#6FB3FF",
        "magenta": "#C79BFF",
        "cyan": "#4FE3D8",
        "white": "#DCE7EC",
        "brightBlack": "#6F8492",
        "brightRed": "#FF9B8F",
        "brightGreen": "#A2ECBB",
        "brightYellow": "#F8CD8A",
        "brightBlue": "#9BCAFF",
        "brightMagenta": "#DABBFF",
        "brightCyan": "#8AEDE5",
        "brightWhite": "#FFFFFF"
    }
}
`;
}
