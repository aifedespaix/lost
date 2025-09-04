# Input Engine

The input engine normalises signals from multiple devices (keyboard, gamepad,
mobile gestures...) into a consistent set of actions and analogue axes. Each
frame the engine produces an immutable snapshot of the current state allowing
systems to safely read inputs without risk of mutation.

## Flow

```
+-------------+      +---------------+      +-----------------+
| InputSource | ---> |               |      |                 |
| LookSource  | ---> | Input Engine  | ---> | Game Systems    |
| MoveSource  | ---> |               |      |                 |
+-------------+      +---------------+      +-----------------+
```

1. **Sources** translate raw device events into high level {@link Action}
   values and optional analogue axes.
2. The **engine** aggregates these events, updates its internal state and
   notifies listeners registered via `onAction`.
3. Systems call `snapshot()` every frame to obtain a frozen
   {@link InputState} object representing the current actions and axes.

## API

- `start()` / `stop()` — control all registered sources.
- `snapshot()` — polls sources and returns the current immutable
  {@link InputState}.
- `onAction(action, cb)` — observe transitions for a specific action.
- `registerSource(source)` — plug in a new device input translator.
- `registerLookSource(source)` — add relative look deltas for FPS cameras.
- `registerMoveSource(source)` — add analogue movement axes.
- `addLook(dx, dy)` / `addMove(x, y)` — manually feed deltas into the next
  snapshot.

## Input Sources

An `InputSource` exposes three methods:

- `attach(emit)` — begin listening to the underlying device and queue events.
- `detach()` — remove listeners and clear internal state.
- `poll()` — flush queued events through the `emit` callback.

`LookSource` and `MoveSource` follow the same structure but emit `(dx, dy)` and
`(x, y)` values respectively. This keeps the engine extensible while maintaining
a minimal API surface.

Sources are intentionally decoupled from the engine so new devices can be
supported without modifying existing logic.
