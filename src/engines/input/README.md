# Input Engine

The input engine normalises signals from multiple devices (keyboard, gamepad,
mobile gestures...) into a consistent set of actions. Each frame the engine
produces an immutable snapshot of the current state allowing systems to safely
read inputs without risk of mutation.

## Flow

```
+-------------+      +---------------+      +-----------------+
| InputSource | ---> | Input Engine  | ---> | Game Systems    |
+-------------+      +---------------+      +-----------------+
```

1. **Sources** translate raw device events into high level {@link Action} values.
2. The **engine** aggregates these events, updates its internal state and
   notifies listeners registered via `onAction`.
3. Systems call `snapshot()` every frame to obtain a frozen
   {@link InputState} object representing the current actions.

## API

- `start()` / `stop()` — control all registered sources.
- `snapshot()` — polls sources and returns the current immutable {@link InputState}.
- `onAction(action, cb)` — observe transitions for a specific action.
- `registerSource(source)` — plug in a new device input translator.

## Input Sources

An `InputSource` exposes three methods:

- `attach(emit)` — begin listening to the underlying device and queue events.
- `detach()` — remove listeners and clear internal state.
- `poll()` — flush queued events through the `emit` callback.

Sources are intentionally decoupled from the engine so new devices can be
supported without modifying existing logic.
