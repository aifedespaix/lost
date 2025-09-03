export enum Action {
  MoveForward = 'move-forward',
  MoveBackward = 'move-backward',
  MoveLeft = 'move-left',
  MoveRight = 'move-right',
  Jump = 'jump',
  Sprint = 'sprint',
  Crouch = 'crouch',
  Interact = 'interact',
  Primary = 'primary',
  Secondary = 'secondary',
  Pause = 'pause',
}

/**
 * Immutable snapshot of the user's input for a single frame.
 * All values are boolean flags describing the active state of each action.
 */
export interface InputState {
  readonly actions: Readonly<Record<Action, boolean>>;
}

/**
 * An input source translates raw device signals into high-level {@link Action}
 * values. Sources attach to an event target, translate native events into
 * actions and expose them through the provided callback when polled.
 */
export interface InputSource {
  /** Begin listening to the underlying device. */
  attach(emit: (action: Action, pressed: boolean) => void): void;
  /** Stop listening to the device and release any resources. */
  detach(): void;
  /** Flush any queued events and emit resulting action changes. */
  poll(): void;
}
