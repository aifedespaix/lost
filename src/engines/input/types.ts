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
 *
 * Besides high-level {@link Action} flags the snapshot may include analogue
 * axes used for smooth first-person camera control and character movement.
 */
export interface InputState {
  /** Boolean map of active actions. */
    readonly actions: Readonly<Record<Action, boolean>>;
  /** Horizontal look delta in radians accumulated this frame. */
    readonly lookX?: number;
  /** Vertical look delta in radians accumulated this frame. */
    readonly lookY?: number;
  /** Horizontal movement axis in the range [-1,1]. */
    readonly moveX?: number;
  /** Vertical movement axis in the range [-1,1]. */
    readonly moveY?: number;
}

/**
 * An input source translates raw device signals into high-level {@link Action}
 * values. Sources attach to an event target, translate native events into
 * actions and expose them through the provided callback when polled.
 */
export interface InputSource {
  /** Begin listening to the underlying device. */
    attach: (emit: (action: Action, pressed: boolean) => void) => void;
  /** Stop listening to the device and release any resources. */
    detach: () => void;
  /** Flush any queued events and emit resulting action changes. */
    poll: () => void;
}

/**
 * Source emitting relative look deltas for first-person camera control.
 */
export interface LookSource {
    attach: (emit: (deltaX: number, deltaY: number) => void, target?: EventTarget) => void;
    detach: () => void;
    poll: () => void;
}

/**
 * Source providing analogue movement axes.
 */
export interface MoveSource {
    attach: (emit: (x: number, y: number) => void, target?: EventTarget) => void;
    detach: () => void;
    poll: () => void;
}
