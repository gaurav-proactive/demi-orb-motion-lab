# Demi orb motion lab

This landing page is a live browser implementation of the Demi orb motion system.

Two animation systems are available:

- `/` contains the primary eight-state voice and intent orb.
- `/cognition` contains the alternate nine-state particle cognition set in Demi colors.

## Interaction

- Move the pointer near the right edge of the live stage to test proximity.
- Hold `Space`, `F`, or the on-screen `fn` key to simulate the native function-key press.
- The command-recognized state turns on the exact Demi gradient after “Hey Demi”.
- Release the key to move from agentic listening to working, approval, and resolve.
- Use the speed control under any state to preview it independently at `0.6×`, `1×`, or `1.4×`.

Browsers do not consistently expose the macOS hardware `fn` key. The product integration should wire the native key event into the same state machine represented here.

## Motion files

Every live animation reads an individual file from `public/animations/`:

- `dormant.json`
- `proximity.json`
- `awake.json`
- `dictating.json`
- `command-recognized.json`
- `agentic-listening.json`
- `working.json`
- `resolve.json`

These JSON files are the recommended first product handoff because they keep timing and semantic behavior editable. Once the motion language is approved, the same state machine can be recreated in Rive with named state-machine inputs for proximity, function-key state, voice amplitude, command recognition, working, approval, and completion.

Each JSON button generates the current specimen configuration in the browser, including the selected `speed` and the supported `speedOptions`.

The alternate cognition page renders the installed `thinking-orbs` package at its two tuned sizes and exposes matching descriptors in `public/cognition/`.
