import app from "../assets/shots/app.png";
import desktop from "../assets/shots/desktop.png";
import launcher from "../assets/shots/launcher.png";
import lock from "../assets/shots/lock.png";
import music from "../assets/shots/music.png";
import settings from "../assets/shots/settings.png";

export const REPO = "https://github.com/coxy-trophy/des-ui";
export const SITE_REPO = "https://github.com/coxy-trophy/des-website";
export const CLONE = `git clone ${REPO}`;

export const SECTIONS = [
  { id: "tour", label: "Tour" },
  { id: "keys", label: "Keys" },
  { id: "built", label: "Built" },
  { id: "signal", label: "Signal" },
  { id: "install", label: "Install" },
] as const;

export const PROGRAMS = [
  {
    name: "des-ui",
    dir: "shell/",
    role: "The interface",
    text: "Terminal, system panels, file browser, launcher, settings, lock and login screens. One program draws all of it.",
  },
  {
    name: "des-comp",
    dir: "compositor/",
    role: "The Wayland compositor",
    text: "Shows the shell fullscreen and places other applications in the middle of its frame. Drives the displays and input devices itself.",
  },
  {
    name: "des-music",
    dir: "music/",
    role: "The player",
    text: "A Spotify player with no window of its own; the shell is its interface. It keeps playing while the shell restarts.",
  },
];

export const SHOTS = [
  {
    id: "desktop",
    label: "Desktop",
    src: desktop,
    alt: "The DEs-UI desktop: a terminal in the middle, system panels either side, a file browser below",
    text: "The terminal in the middle, the machine either side, and a file browser below that follows the terminal's directory.",
  },
  {
    id: "app",
    label: "Application",
    src: app,
    alt: "A text editor open in the workspace, with two notifications above it",
    text: "An application takes the workspace and a tab beside the terminal's. What applications announce shows as a toast above whatever is open.",
  },
  {
    id: "launcher",
    label: "Launcher",
    src: launcher,
    alt: "The application launcher: a search line over a list of installed applications",
    text: "Super+Space. Type to search, Enter to open, Esc to go back to the terminal.",
  },
  {
    id: "music",
    label: "Music",
    src: music,
    alt: "The music player: playlists, a track list and the playing track along the bottom",
    text: "Search, playlists, albums and liked songs, with lyrics timed to the track and the queue beside them.",
  },
  {
    id: "settings",
    label: "Settings",
    src: settings,
    alt: "The settings, opened in place of the terminal",
    text: "Twelve sections, from the theme to Wi-Fi, Bluetooth, displays, sound and the accounts on the machine. Changes apply at once.",
  },
  {
    id: "lock",
    label: "Lock",
    src: lock,
    alt: "The lock screen: a picture, a name and a password line",
    text: "Super+L, or by itself when left alone and before sleep. What was running keeps running behind it.",
  },
];

export type Binding = { keys: string; action: string; note?: string };

/** What each key does while Super is held, by `KeyboardEvent.code`. */
export const BINDINGS: Record<string, Binding> = {
  Space: { keys: "Super + Space", action: "Open the launcher", note: "Type to search, Enter to open, Esc to cancel." },
  Comma: { keys: "Super + ,", action: "Open the settings", note: "In place of the terminal. Esc closes." },
  KeyL: { keys: "Super + L", action: "Lock the screen", note: "What was running keeps running." },
  Tab: { keys: "Super + Tab", action: "Next application", note: "Switches between the terminal and the applications on this display." },
  Digit1: { keys: "Super + 1", action: "Workspace 1", note: "With Shift, send the application in use there." },
  Digit2: { keys: "Super + 2", action: "Workspace 2", note: "With Shift, send the application in use there." },
  Digit3: { keys: "Super + 3", action: "Workspace 3", note: "With Shift, send the application in use there." },
  Digit4: { keys: "Super + 4", action: "Workspace 4", note: "With Shift, send the application in use there." },
  KeyS: { keys: "Super + S", action: "Split the workspace", note: "Between two windows, or make it whole again." },
  ArrowLeft: { keys: "Super + Left", action: "Keyboard to the left half", note: "Of a split workspace." },
  ArrowRight: { keys: "Super + Right", action: "Keyboard to the right half", note: "Of a split workspace." },
  KeyF: { keys: "Super + F", action: "Full screen", note: "The applications on this display cover all of it." },
  BracketLeft: { keys: "Super + [", action: "Collapse the left panel", note: "Or open it again." },
  BracketRight: { keys: "Super + ]", action: "Collapse the right panel", note: "Or open it again." },
  Backslash: { keys: "Super + \\", action: "Collapse the bottom panel", note: "Or open it again." },
  KeyQ: { keys: "Super + Q", action: "Close the current application" },
  KeyO: { keys: "Super + O", action: "Move to the next display", note: "The current application goes with it." },
  KeyM: { keys: "Super + M", action: "Open the music player" },
  KeyN: { keys: "Super + N", action: "Open the notifications", note: "Do not disturb is in there too." },
  Escape: { keys: "Super + Esc", action: "Open the power menu", note: "Lock, sleep, restart, shut down, log out." },
  KeyR: { keys: "Super + Shift + R", action: "Restart the shell", note: "On a new build. Applications stay open." },
  PrintScreen: { keys: "Print", action: "Screenshot or recording", note: "Full screen, an area, a window, or record the display. No Super needed." },
  MetaLeft: { keys: "Super", action: "Hold it", note: "Ctrl+Alt does the same, which works when running in a window." },
};

type Key = { code: string; label: string; w?: number };
const k = (code: string, label: string, w?: number): Key => ({ code, label, w });
const letters = (row: string) => [...row].map((c) => k(`Key${c}`, c));

/** A plain ANSI layout; every row adds up to fifteen units. */
export const KEYBOARD: Key[][] = [
  [k("Escape", "Esc"), k("", "", 12.5), k("PrintScreen", "Print", 1.5)],
  [
    k("Backquote", "`"),
    ...[..."1234567890"].map((d) => k(`Digit${d}`, d)),
    k("Minus", "-"),
    k("Equal", "="),
    k("Backspace", "Back", 2),
  ],
  [k("Tab", "Tab", 1.5), ...letters("QWERTYUIOP"), k("BracketLeft", "["), k("BracketRight", "]"), k("Backslash", "\\", 1.5)],
  [k("CapsLock", "Caps", 1.75), ...letters("ASDFGHJKL"), k("Semicolon", ";"), k("Quote", "'"), k("Enter", "Enter", 2.25)],
  [k("ShiftLeft", "Shift", 2.25), ...letters("ZXCVBNM"), k("Comma", ","), k("Period", "."), k("Slash", "/"), k("ShiftRight", "Shift", 2.75)],
  [
    k("ControlLeft", "Ctrl", 1.5),
    k("MetaLeft", "Super", 1.5),
    k("AltLeft", "Alt", 1.5),
    k("Space", "Space", 6),
    k("AltRight", "Alt", 1.5),
    k("ArrowLeft", "←", 1.5),
    k("ArrowRight", "→", 1.5),
  ],
];

export const FEATURES = [
  {
    name: "Terminal",
    text: "A shell on a PTY with its own VT parsing and grid rendering. Tabs, and a split in two, side by side or one above the other.",
  },
  {
    name: "Applications in the frame",
    text: "Wayland applications open in the middle of the frame. X11 ones run through Xwayland, and the clipboard is shared between them.",
  },
  {
    name: "Workspaces and splits",
    text: "Four workspaces, each with its own split and full screen. The terminal and the frame are the same in all of them.",
  },
  {
    name: "Displays",
    text: "Resolution, refresh rate, scale from 100% to 200%, rotation, order, mirroring. Monitors plugged in later are picked up.",
  },
  {
    name: "Network and Bluetooth",
    text: "Wi-Fi, wired ports, and VPNs brought in from a WireGuard or OpenVPN file. Pairing for devices that show a code.",
  },
  {
    name: "Lock and login",
    text: "Locks by itself after ten minutes, before sleep, and when the system asks. Optionally the machine's own login screen, through greetd.",
  },
  {
    name: "Notifications",
    text: "The shell is the session's notification service: toasts above whatever is open, a list behind them, and do not disturb.",
  },
  {
    name: "Music",
    text: "Spotify, built on librespot. It appears in Spotify's device list as “DEs-UI”, so a phone can control it. Needs Premium.",
  },
  {
    name: "Screenshots and recordings",
    text: "Print stops the display and asks: full screen, an area, a window, or record. Pictures are copied, ready to paste.",
  },
  {
    name: "Power and battery",
    text: "Warns at 15% and 8%. At 4% it warns for a minute and then sleeps, so work is kept rather than lost.",
  },
  {
    name: "The globe",
    text: "Marks this machine and the places it has connections open to. The lookups can be turned off, and your position set by hand.",
  },
  {
    name: "Sound",
    text: "Which device plays and which microphone listens, each with its level and a mute, and the volume of every application making sound.",
  },
];

export const WAYS_OUT = [
  {
    when: "A display mode your monitor cannot show",
    then: "It is tried for 15 seconds and kept only if you confirm. Otherwise it goes back by itself.",
  },
  {
    when: "The shell crashes",
    then: "It is started again, and applications stay open.",
  },
  {
    when: "A new build cannot start at login",
    then: "install.sh keeps the build it replaces. The session tries that one, then cage.",
  },
  {
    when: "The compositor cannot drive the display",
    then: "It falls back to running inside cage, and the reason is in session.log.",
  },
  {
    when: "The lock screen cannot be unlocked",
    then: "Ctrl+Alt+F3, sign in on the text console, and run des-ui --unlock.",
  },
  {
    when: "Anything else",
    then: "Ctrl+Alt+Backspace ends the session. Ctrl+Alt+F1…F12 switch virtual terminals.",
  },
];

export const NOT_DONE = [
  { name: "Keyboard layout setting", text: "The setting is listed; choosing a layout is not finished." },
  { name: "Dialogs at their natural size", text: "And sharing the middle-click selection with X11 applications." },
  { name: "Displays above one another", text: "They can be ordered left to right only." },
  { name: "VPNs that ask each time", text: "Ones that need a password on every connection." },
  { name: "Music: queue editing", text: "Removing or reordering, editing playlists, podcasts, followed artists." },
  { name: "Notification icons as SVG", text: "Icons that exist only as drawings are not shown." },
  { name: "Login beyond a password", text: "Accounts that need more than a password cannot sign in from the login screen." },
  { name: "From eDEX-UI", text: "On-screen keyboard, sound effects, mouse reporting to terminal applications." },
];

export const INSTALL_STEPS = [
  { cmd: "sudo apt install libudev-dev libinput-dev libgbm-dev libseat-dev cage", note: "what the compositor builds against" },
  { cmd: CLONE, note: "" },
  { cmd: "cd des-ui && cargo build", note: "" },
  { cmd: "./target/debug/des-comp", note: "the whole desktop, in a window" },
  { cmd: "./install.sh", note: "then choose DEs-UI on the login screen" },
];
