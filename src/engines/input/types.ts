export enum Action {
  MoveForward = 'move-forward',
  MoveBackward = 'move-backward',
  MoveLeft = 'move-left',
  MoveRight = 'move-right',
  Jump = 'jump',
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
 * An input source translates raw device events into high-level actions.
 * Sources are expected to emit action changes via the provided callback.
 */
export interface InputSource {
  start(emit: (action: Action, pressed: boolean) => void): void;
  stop(): void;
}
