# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Demi orb direction

- Use the supplied Demi palette exactly: navy `#040120`, blue `#246CE0`, magenta `#CE3DA2`, orange `#FD8502`, and white `#FFFFFF`.
- The orb begins as a near-invisible edge dot, expands with cursor proximity, wakes while the function key is held, and shows voice waves during dictation.
- Recognition of “Hey Demi” turns the color on and marks the transition from dictation to an agentic command.
- Agentic listening combines a restrained 4-6% breathing cycle with voice-responsive surface motion.
- Working uses quiet upward internal flow. Approval is a held halo. Completion contracts back toward the edge dot.
- Keep the visual language subtle and product-like. Avoid particle explosions, rainbow color, sci-fi HUD styling, excessive glow, and generic AI blobs.
- Every animation state must have an individual JSON definition that is consumed by the live renderer and can be downloaded from the page.
- Hold should feel actively primed, using a contained pulse and slow internal orbital tension rather than a static breathing circle.
- Voice waves should be materially present in the orb surface: thicker, softly luminous, and strong enough to read at product size without becoming an equalizer.
- “Hey Demi” acknowledgment should be unmistakable through a quick color reveal, bright rim sweep, and expanding confirmation bloom that resolves into agentic listening.
- Do not add the particle-based cognition gallery inside the primary orb page; the user rejected mixing those systems. A separate `/cognition` page is approved as an alternate system.
- The separate cognition page should expose all nine `thinking-orbs` states in the exact Demi gradient, provide standard and compact product sizes, support light and dark themes, and keep individual JSON descriptors downloadable.
- Keep a generous safety area around each orb and its halo. The full animation must remain visible in featured cards, the live stage, and the state gallery rather than clipping against an edge.
- Support both full-page dark and light themes with the same interactions and motion definitions. Dark should feel native and quiet; light should preserve strong text, border, and orb contrast.
- Every primary and cognition specimen must expose an independent 0.6×, 1×, and 1.4× speed control. The selected rate must affect every duplicate of that state and be included in the JSON generated from that specimen.
