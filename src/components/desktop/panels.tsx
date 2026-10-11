// The two side columns of the live desktop, fed with made-up readings.

import { useEffect, useState } from "react";
import { useAccent } from "../../lib/accent";
import { pad, useNow } from "../../lib/hooks";
import { Globe, LINK_COUNT } from "./Globe";

const HISTORY = 40;
const CAUTION_ABOVE = 75;

type Metrics = {
  cores: number[];
  cpu: number[];
  down: number[];
  up: number[];
  memory: number;
};

const drift = (value: number, by: number, low: number, high: number) =>
  Math.max(low, Math.min(high, value + (Math.random() - 0.5) * by));

function useMetrics(): Metrics {
  const [metrics, setMetrics] = useState<Metrics>(() => ({
    cores: [26, 23, 41, 21],
    cpu: Array.from({ length: HISTORY }, () => 8 + Math.random() * 6),
    down: Array.from({ length: HISTORY }, () => Math.random() * 2),
    up: Array.from({ length: HISTORY }, () => Math.random() * 2),
    memory: 4.3,
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((m) => {
        const cores = m.cores.map((core) => drift(core, 34, 4, 96));
        const burst = () => (Math.random() < 0.15 ? Math.random() * 40 : Math.random() * 3);
        return {
          cores,
          cpu: [...m.cpu.slice(1), cores.reduce((a, b) => a + b) / cores.length],
          down: [...m.down.slice(1), burst()],
          up: [...m.up.slice(1), burst() / 3],
          memory: drift(m.memory, 0.2, 3.8, 5.2),
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return metrics;
}

function Spark({ values, max }: { values: number[]; max: number }) {
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${30 - (Math.min(v, max) / max) * 28}`)
    .join(" ");
  return (
    <svg className="dk-spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Head({ label, meta, live }: { label: string; meta?: string; live?: boolean }) {
  return (
    <div className="dk-head">
      <span className="dk-head-label">{label}</span>
      <span className="dk-head-line" />
      {meta && <span className={live ? "dk-head-meta dk-live" : "dk-head-meta"}>{meta}</span>}
    </div>
  );
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export const dateLine = (now: Date) =>
  `${DAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

const PROCESSES: [string, number][] = [
  ["des-ui", 117.5],
  ["des-comp", 110.3],
  ["zsh", 6.1],
  ["dbus-daemon", 5.1],
  ["sh", 2.0],
];

export function LeftColumn() {
  const now = useNow();
  const { cores, cpu, memory } = useMetrics();
  const total = Math.round(cpu[cpu.length - 1]);

  return (
    <aside className="dk-col dk-left">
      <div className="dk-clock">
        <span className="dk-time">
          {pad(now.getHours())}:{pad(now.getMinutes())}
        </span>
        <span className="dk-seconds">{pad(now.getSeconds())}</span>
      </div>
      <div className="dk-date">{dateLine(now)}</div>

      <Head label="System" meta="workstation" />
      <div className="dk-pair">
        <div className="dk-box">
          <span>OS</span>
          Ubuntu
        </div>
        <div className="dk-box">
          <span>Kernel</span>
          7.0.0-34
        </div>
      </div>

      <Head label="Processor" meta={`${total}%`} />
      <div className="dk-chart">
        <Spark values={cpu} max={100} />
      </div>
      {cores.map((core, i) => (
        <div className="dk-meter" key={i}>
          <span>C{i + 1}</span>
          <span className="dk-track">
            <span className={core > CAUTION_ABOVE ? "dk-fill dk-caution" : "dk-fill"} style={{ width: `${core}%` }} />
          </span>
          <span className={core > CAUTION_ABOVE ? "dk-value dk-caution-text" : "dk-value"}>{Math.round(core)}</span>
        </div>
      ))}

      <Head label="Memory" meta={`${memory.toFixed(1)} / 11.1 GiB`} />
      <span className="dk-track dk-track-tall">
        <span className="dk-fill" style={{ width: `${(memory / 11.1) * 100}%` }} />
      </span>

      <Head label="Processes" meta="CPU · MEM" />
      {PROCESSES.map(([name, mb], i) => (
        <div className="dk-process" key={name}>
          <span>{name}</span>
          <span>{i < 2 ? Math.max(1, Math.round(total / 14)) : 0}%</span>
          <span>{mb.toFixed(1)} MB</span>
        </div>
      ))}
    </aside>
  );
}

const KEYS: [string, string][] = [
  ["Launcher", "SPACE"],
  ["Settings", ","],
  ["Music", "M"],
  ["Notifications", "N"],
  ["Lock", "L"],
  ["Split the workspace", "S"],
];

function Rate({ label, values }: { label: string; values: number[] }) {
  return (
    <div className="dk-box dk-rate">
      <span>{label}</span>
      {values[values.length - 1].toFixed(1)} KB/s
      <Spark values={values} max={40} />
    </div>
  );
}

export function RightColumn() {
  const { accent } = useAccent();
  const { down, up } = useMetrics();

  return (
    <aside className="dk-col dk-right">
      <Head label="Network" meta="Online" live />
      <div className="dk-row">
        <span>wlp3s0</span>
        <span>172.20.10.4</span>
      </div>
      <div className="dk-pair">
        <Rate label="Down" values={down} />
        <Rate label="Up" values={up} />
      </div>

      <Head label="World view" meta={`${LINK_COUNT} links`} />
      <div className="dk-globe">
        <Globe size={168} accent={accent.rgb} />
      </div>
      <div className="dk-row dk-row-label">
        <span>
          <i className="dk-dot" />
          London
        </span>
        <span>Set by you</span>
      </div>

      <Head label="Keys" meta="Hold Super" />
      {KEYS.map(([action, key]) => (
        <div className="dk-key" key={action}>
          <span>{action}</span>
          <kbd>{key}</kbd>
        </div>
      ))}
    </aside>
  );
}
