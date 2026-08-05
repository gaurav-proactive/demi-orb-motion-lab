import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OrbCanvas } from "./OrbCanvas.jsx";
import { downloadMotionJson, MotionSpeedControl, SPEED_OPTIONS } from "./MotionSpeedControl.jsx";

const STATE_IDS = ["dormant", "proximity", "awake", "dictating", "command-recognized", "agentic-listening", "working", "resolve"];
const FEATURED_IDS = ["awake", "dictating", "command-recognized"];
const RULES = [
  ["Proximity controls scale", "Distance from the cursor determines how visible Demi becomes."],
  ["Voice controls surface", "Amplitude and cadence shape the surface without becoming an equalizer."],
  ["Intent controls color", "The Demi gradient appears only after the agentic wake phrase is recognized."],
  ["Judgment controls pause", "Consequential work holds a calm halo until the user decides."],
];

function useMotionSpecs() {
  const [specs, setSpecs] = useState([]);
  useEffect(() => {
    let cancelled = false;
    Promise.all(STATE_IDS.map((id) => fetch(`/animations/${id}.json`).then((response) => response.json())))
      .then((data) => { if (!cancelled) setSpecs(data); });
    return () => { cancelled = true; };
  }, []);
  return specs;
}

function useCommandDemo(specs, paused) {
  const [activeId, setActiveId] = useState("agentic-listening");
  const [auto, setAuto] = useState(true);
  const timerRef = useRef([]);
  const clearTimers = useCallback(() => {
    timerRef.current.forEach(window.clearTimeout);
    timerRef.current = [];
  }, []);
  const runPress = useCallback(() => {
    if (!specs.length) return;
    setAuto(false);
    clearTimers();
    setActiveId("awake");
    timerRef.current.push(window.setTimeout(() => setActiveId("dictating"), 520));
    timerRef.current.push(window.setTimeout(() => setActiveId("command-recognized"), 1900));
    timerRef.current.push(window.setTimeout(() => setActiveId("agentic-listening"), 3100));
  }, [clearTimers, specs.length]);
  const runRelease = useCallback(() => {
    if (!specs.length) return;
    clearTimers();
    setActiveId("working");
    timerRef.current.push(window.setTimeout(() => setActiveId("resolve"), 2700));
    timerRef.current.push(window.setTimeout(() => setActiveId("dormant"), 6100));
  }, [clearTimers, specs.length]);

  useEffect(() => {
    if (!auto || paused || !specs.length) return undefined;
    const sequence = STATE_IDS;
    let index = Math.max(0, sequence.indexOf(activeId));
    const interval = window.setInterval(() => {
      index = (index + 1) % sequence.length;
      setActiveId(sequence[index]);
    }, 2400);
    return () => window.clearInterval(interval);
  }, [activeId, auto, paused, specs.length]);

  useEffect(() => {
    const down = (event) => {
      const key = event.key?.toLowerCase();
      if ((event.key === " " || key === "f" || key === "fn") && !event.repeat) {
        event.preventDefault();
        runPress();
      }
    };
    const up = (event) => {
      const key = event.key?.toLowerCase();
      if (event.key === " " || key === "f" || key === "fn") {
        event.preventDefault();
        runRelease();
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      clearTimers();
    };
  }, [clearTimers, runPress, runRelease]);

  return { activeId, setActiveId, auto, setAuto, runPress, runRelease };
}

export function App() {
  const specs = useMotionSpecs();
  const [paused, setPaused] = useState(false);
  const [proximity, setProximity] = useState(0.08);
  const [theme, setTheme] = useState("dark");
  const [speedById, setSpeedById] = useState({});
  const stageRef = useRef(null);
  const demo = useCommandDemo(specs, paused);
  const byId = useMemo(() => Object.fromEntries(specs.map((spec) => [spec.id, spec])), [specs]);
  const activeSpec = byId[demo.activeId] || specs[0];
  const speedFor = (id) => speedById[id] ?? byId[id]?.speed ?? 1;
  const setStateSpeed = (id, speed) => setSpeedById((current) => ({ ...current, [id]: speed }));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const handleStageMove = (event) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const distance = Math.hypot(event.clientX - (bounds.right - 28), event.clientY - (bounds.top + bounds.height / 2));
    setProximity(Math.max(0, Math.min(1, 1 - (distance - 32) / 260)));
  };

  if (!specs.length) return <main className="loading">Loading the Demi motion system…</main>;

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Demi orb motion home">
          <span className="brand-orb"><img src="/assets/Demi-gradient.svg" alt="" /></span>
          <span>DEMI</span>
          <span className="wordmark-suffix">/ MOTION GRAMMAR</span>
        </a>
        <div className="header-actions">
          <nav aria-label="Page sections">
            <a href="#live">Live sequence</a>
            <a href="#states">States</a>
            <a href="#handoff">JSON handoff</a>
            <a href={`${import.meta.env.BASE_URL}#/cognition`}>Cognition set</a>
          </nav>
          <div className="theme-toggle" role="group" aria-label="Color theme">
            <button type="button" className={theme === "dark" ? "active" : ""} aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>Dark</button>
            <button type="button" className={theme === "light" ? "active" : ""} aria-pressed={theme === "light"} onClick={() => setTheme("light")}>Light</button>
          </div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Demi orb language / v2</p>
          <h1>Voice becomes intent.</h1>
          <p className="lede">Demi moves from near-invisible to fully agentic through proximity, voice, and intent, all expressed as one living surface.</p>
        </div>
        <div className="featured-grid" aria-label="Featured live orb states">
          {FEATURED_IDS.map((id, index) => (
            <article className="featured-state" key={id}>
              <div className="featured-copy"><span>{index + 1}. {byId[id].label}</span><p>{byId[id].description}</p></div>
              <OrbCanvas config={byId[id]} paused={paused} speed={speedFor(id)} />
            </article>
          ))}
        </div>
      </section>

      <section className="live-section" id="live">
        <div className="section-heading">
          <div><p className="eyebrow">Live sequence</p><h2>Hold to speak. Release to work.</h2></div>
          <div className="playback-controls" aria-label="Playback controls">
            <button type="button" className={demo.auto ? "selected" : ""} onClick={() => demo.setAuto(!demo.auto)}>{demo.auto ? "Auto tour on" : "Auto tour off"}</button>
            <button type="button" onClick={() => setPaused(!paused)}>{paused ? "Resume motion" : "Pause motion"}</button>
          </div>
        </div>
        <div className="interactive-stage" ref={stageRef} onPointerMove={handleStageMove} onPointerLeave={() => setProximity(0.08)}>
          <div className="stage-instructions">
            <span className="stage-status">{activeSpec.label}</span>
            <strong>{activeSpec.id === "dormant" ? "Move near the edge" : activeSpec.description}</strong>
            {activeSpec.id === "command-recognized" && <span className="acknowledgement-copy">Hey Demi · command mode on</span>}
            <p>Hold space, F, or the on-screen fn key to simulate the native function-key interaction.</p>
          </div>
          <div className="stage-orb">
            <OrbCanvas config={demo.activeId === "proximity" ? byId.proximity : activeSpec} strength={demo.activeId === "proximity" ? proximity : 1} paused={paused} speed={speedFor(demo.activeId)} />
          </div>
          <button type="button" className="fn-key" onPointerDown={demo.runPress} onPointerUp={demo.runRelease} onPointerCancel={demo.runRelease} onPointerLeave={(event) => { if (event.buttons) demo.runRelease(); }}>
            <span>fn</span><small>hold to speak</small>
          </button>
          <div className="edge-guide" aria-hidden="true"><span /></div>
        </div>
        <div className="state-selector" role="tablist" aria-label="Choose a live state">
          {specs.map((spec, index) => (
            <button key={spec.id} type="button" role="tab" aria-selected={demo.activeId === spec.id} className={demo.activeId === spec.id ? "active" : ""} onClick={() => { demo.setAuto(false); demo.setActiveId(spec.id); }}>
              <span>{String(index + 1).padStart(2, "0")}</span>{spec.label}
            </button>
          ))}
        </div>
      </section>

      <section className="states-section" id="states">
        <div className="section-heading compact">
          <div><p className="eyebrow">Motion timeline</p><h2>Eight states. One semantic system.</h2></div>
          <p className="section-note">Every specimen below is running from its own product-ready JSON definition.</p>
        </div>
        <div className="state-grid">
          {specs.map((spec, index) => (
            <article className="state-card" key={spec.id}>
              <div className="state-card-index">{String(index + 1).padStart(2, "0")}</div>
              <OrbCanvas config={spec} paused={paused} speed={speedFor(spec.id)} />
              <h3>{spec.label}</h3><p>{spec.description}</p>
              <div className="state-card-actions">
                <MotionSpeedControl value={speedFor(spec.id)} onChange={(speed) => setStateSpeed(spec.id, speed)} label={spec.label} />
                <button
                  type="button"
                  className="json-download"
                  onClick={() => downloadMotionJson(`${spec.id}.json`, { ...spec, speed: speedFor(spec.id), speedOptions: SPEED_OPTIONS })}
                >
                  {spec.id}.json
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rules-section">
        <p className="eyebrow">Motion rules</p>
        <div className="rules-grid">
          {RULES.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="handoff-section" id="handoff">
        <div><p className="eyebrow">Product handoff</p><h2>Motion data first. Rive when approved.</h2><p>The page renderer consumes the same individual JSON files exposed for download. They define timing, scale, voice response, color mode, breathing amplitude, flow, halo, and resolve behavior in both light and dark product contexts.</p></div>
        <div className="handoff-specimen"><OrbCanvas config={byId["agentic-listening"]} paused={paused} speed={speedFor("agentic-listening")} /><div><span>Current status</span><strong>Listening to your request</strong><small>Agentic mode · fn held</small></div></div>
      </section>

      <footer><span>DEMI / ORB MOTION / V2</span><span>Palette: #040120 · #246CE0 · #CE3DA2 · #FD8502 · #FFFFFF</span></footer>
    </main>
  );
}
