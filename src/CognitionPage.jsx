import { useEffect, useState } from "react";
import { DemiParticleOrb } from "./DemiParticleOrb.jsx";
import { downloadMotionJson, MotionSpeedControl, SPEED_OPTIONS } from "./MotionSpeedControl.jsx";
import "./cognition.css";

const COGNITION_STATES = [
  { id: "working", label: "Working", description: "Particles move across tilted orbits while Demi executes the task.", speed: 0.74 },
  { id: "searching", label: "Searching", description: "A scan meridian sweeps the knowledge surface for relevant context.", speed: 0.82 },
  { id: "solving", label: "Solving", description: "Bands separate, test possibilities, and click back into a resolved form.", speed: 0.76 },
  { id: "listening", label: "Agent listening", description: "A voice wave travels through the particle shell as context arrives.", speed: 0.88 },
  { id: "connecting", label: "Connecting", description: "A constellation creates links and sends intent across the network.", speed: 0.8 },
  { id: "weaving", label: "Agent weaving", description: "Three strands braid separate pieces of context into one response.", speed: 0.76 },
  { id: "composing", label: "Composing", description: "An undulating ribbon assembles the final response with steady cadence.", speed: 0.72 },
  { id: "breathing", label: "Waiting", description: "A restrained ring breathes while Demi waits for the next instruction.", speed: 0.62 },
  { id: "shaping", label: "Shaping", description: "The boundary tests forms before settling on the final structure.", speed: 0.68 },
];

export function CognitionPage() {
  const [theme, setTheme] = useState("dark");
  const [paused, setPaused] = useState(false);
  const [preset, setPreset] = useState("large");
  const [speedById, setSpeedById] = useState(() => Object.fromEntries(COGNITION_STATES.map((state) => [state.id, 1])));
  const setStateSpeed = (id, speed) => setSpeedById((current) => ({ ...current, [id]: speed }));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <main className="cognition-page">
      <header className="cognition-header">
        <a className="wordmark" href={import.meta.env.BASE_URL} aria-label="Open the primary Demi orb system">
          <span className="brand-orb"><img src="/assets/Demi-gradient.svg" alt="" /></span>
          <span>DEMI</span>
          <span className="wordmark-suffix">/ COGNITION SET</span>
        </a>
        <div className="cognition-header-actions">
          <a className="primary-system-link" href={import.meta.env.BASE_URL}>Primary orb system</a>
          <div className="theme-toggle" role="group" aria-label="Color theme">
            <button type="button" className={theme === "dark" ? "active" : ""} aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>Dark</button>
            <button type="button" className={theme === "light" ? "active" : ""} aria-pressed={theme === "light"} onClick={() => setTheme("light")}>Light</button>
          </div>
        </div>
      </header>

      <section className="cognition-intro">
        <div>
          <p className="eyebrow">Demi cognition / alternate system</p>
          <h1>Every task has a shape.</h1>
        </div>
        <div className="cognition-intro-copy">
          <p>Nine distinct particle behaviors give Demi’s agentic work a quiet, legible signature without competing with the primary voice orb.</p>
          <span>Built from the installed cognition package and recolored with the exact Demi palette.</span>
        </div>
      </section>

      <section className="cognition-specimens">
        <div className="specimen-toolbar">
          <div>
            <p className="eyebrow">Complete set</p>
            <h2>Nine states. Two product sizes.</h2>
          </div>
          <div className="specimen-controls">
            <div className="size-toggle" role="group" aria-label="Orb size">
              <button type="button" className={preset === "large" ? "active" : ""} aria-pressed={preset === "large"} onClick={() => setPreset("large")}>Standard</button>
              <button type="button" className={preset === "compact" ? "active" : ""} aria-pressed={preset === "compact"} onClick={() => setPreset("compact")}>Compact</button>
            </div>
            <button type="button" className="pause-control" onClick={() => setPaused(!paused)}>{paused ? "Resume motion" : "Pause motion"}</button>
          </div>
        </div>

        <div className={`cognition-specimen-grid ${preset === "compact" ? "compact" : ""}`}>
          {COGNITION_STATES.map((state, index) => (
            <article className="cognition-specimen" key={state.id}>
              <span className="specimen-index">{String(index + 1).padStart(2, "0")}</span>
              <div className="cognition-status-pill">
                <DemiParticleOrb state={state.id} preset={preset} paused={paused} speed={state.speed * speedById[state.id]} label={`${state.label} cognition animation`} />
                <strong>{state.label}<span aria-hidden="true">…</span></strong>
              </div>
              <div className="specimen-meta">
                <p>{state.description}</p>
                <div className="specimen-actions">
                  <MotionSpeedControl value={speedById[state.id]} onChange={(speed) => setStateSpeed(state.id, speed)} label={state.label} />
                  <button
                    type="button"
                    className="json-download"
                    onClick={() => downloadMotionJson(`${state.id}.json`, {
                      id: state.id,
                      label: state.label,
                      renderer: "thinking-orbs",
                      state: state.id,
                      speed: Number((state.speed * speedById[state.id]).toFixed(3)),
                      baseSpeed: state.speed,
                      speedMultiplier: speedById[state.id],
                      speedOptions: SPEED_OPTIONS,
                      sizes: [64, 20],
                      palette: ["#246CE0", "#CE3DA2", "#FD8502", "#FFFFFF"],
                    })}
                  >
                    {state.id}.json
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cognition-handoff">
        <p className="eyebrow">Product pairing</p>
        <div>
          <h2>Voice orb for intent. Cognition orb for progress.</h2>
          <p>The two systems now live on separate pages and can be evaluated independently before deciding which states belong in the product.</p>
          <a href={import.meta.env.BASE_URL}>Return to the primary orb system</a>
        </div>
      </section>

      <footer><span>DEMI / COGNITION MOTION / V1</span><span>9 states · 2 sizes · light + dark</span></footer>
    </main>
  );
}
