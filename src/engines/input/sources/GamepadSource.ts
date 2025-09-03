import { Action, type InputSource } from '../types'
import { applyDeadzone, clamp } from '../utils'

/** Options to configure a {@link GamepadSource}. */
export interface GamepadSourceOptions {
  /** Index of the gamepad to monitor. Defaults to the first gamepad (0). */
  readonly index?: number
  /** Deadzone applied to stick axes. Defaults to `0.1`. */
  readonly deadzone?: number
  /** Callback receiving look deltas from the right stick. */
  readonly onLook?: (deltaX: number, deltaY: number) => void
}

/** Options for triggering gamepad vibration. */
export interface RumbleOptions {
  /** Duration of the effect in milliseconds. Defaults to `100`. */
  readonly duration?: number
  /** Strength of the low-frequency motor in the range `[0,1]`. Defaults to `1`. */
  readonly strongMagnitude?: number
  /** Strength of the high-frequency motor in the range `[0,1]`. Defaults to `1`. */
  readonly weakMagnitude?: number
}

/**
 * Translates Gamepad API signals into high-level {@link Action} values.
 *
 * - **Left stick** → movement actions
 * - **Right stick** → look deltas via `onLook`
 * - **Buttons** → mapped actions (A→Jump, B→Crouch, etc.)
 *
 * The source listens for connect/disconnect events and automatically resets
 * state to avoid stuck inputs. Analogue stick values are normalised to `[-1,1]`
 * and pass through a configurable deadzone.
 */
export class GamepadSource implements InputSource {
  private emit: ((action: Action, pressed: boolean) => void) | null = null
  private target: EventTarget | null = null
  private readonly index: number
  private readonly deadzone: number
  private readonly onLook?: (dx: number, dy: number) => void
  private readonly state: Record<Action, boolean> = {
    [Action.MoveForward]: false,
    [Action.MoveBackward]: false,
    [Action.MoveLeft]: false,
    [Action.MoveRight]: false,
    [Action.Jump]: false,
    [Action.Sprint]: false,
    [Action.Crouch]: false,
    [Action.Interact]: false,
    [Action.Primary]: false,
    [Action.Secondary]: false,
    [Action.Pause]: false,
  }
  private connected = false

  constructor(options: GamepadSourceOptions = {}) {
    this.index = options.index ?? 0
    this.deadzone = options.deadzone ?? 0.1
    this.onLook = options.onLook
  }

  /** Begin listening to gamepad events. */
  attach(emit: (action: Action, pressed: boolean) => void, target: EventTarget = window): void {
    if (this.emit)
      return
    this.emit = emit
    this.target = target
    target.addEventListener('gamepadconnected', this.handleConnect)
    target.addEventListener('gamepaddisconnected', this.handleDisconnect)
    this.scanGamepads()
  }

  /** Stop listening and reset internal state. */
  detach(): void {
    if (!this.emit || !this.target)
      return
    this.target.removeEventListener('gamepadconnected', this.handleConnect)
    this.target.removeEventListener('gamepaddisconnected', this.handleDisconnect)
    this.emit = null
    this.target = null
    this.connected = false
    this.releaseAll()
  }

  /** Flush current gamepad state through the emit callback. */
  poll(): void {
    if (!this.emit || !this.connected)
      return
    const pad = navigator.getGamepads()[this.index]
    if (!pad)
      return

    // Left stick controls movement
    const lx = applyDeadzone(clamp(pad.axes[0] ?? 0, -1, 1), this.deadzone)
    const ly = applyDeadzone(clamp(pad.axes[1] ?? 0, -1, 1), this.deadzone)
    this.updateAction(Action.MoveLeft, lx < 0)
    this.updateAction(Action.MoveRight, lx > 0)
    this.updateAction(Action.MoveForward, ly < 0)
    this.updateAction(Action.MoveBackward, ly > 0)

    // Right stick controls look
    if (this.onLook) {
      const rx = applyDeadzone(clamp(pad.axes[2] ?? 0, -1, 1), this.deadzone)
      const ry = applyDeadzone(clamp(pad.axes[3] ?? 0, -1, 1), this.deadzone)
      if (rx !== 0 || ry !== 0)
        this.onLook(rx, ry)
    }

    // Button mappings
    this.processButton(pad.buttons[0], Action.Jump) // A
    this.processButton(pad.buttons[1], Action.Crouch) // B
    this.processButton(pad.buttons[2], Action.Interact) // X
    this.processButton(pad.buttons[4], Action.Primary) // LB
    this.processButton(pad.buttons[5], Action.Secondary) // RB
    this.processButton(pad.buttons[9], Action.Pause) // Start
    this.processButton(pad.buttons[10], Action.Sprint) // Left stick click
  }

  /**
   * Trigger a vibration effect if the gamepad supports it. Silent when
   * unavailable.
   */
  async rumble(options: RumbleOptions = {}): Promise<void> {
    const pad = navigator.getGamepads()[this.index]
    const actuator = pad?.vibrationActuator
    if (!actuator)
      return
    await actuator.playEffect('dual-rumble', {
      startDelay: 0,
      duration: options.duration ?? 100,
      strongMagnitude: options.strongMagnitude ?? 1,
      weakMagnitude: options.weakMagnitude ?? 1,
    })
  }

  private readonly handleConnect = (event: Event): void => {
    const gp = (event as any).gamepad as Gamepad | undefined
    if (gp && gp.index === this.index)
      this.connected = true
  }

  private readonly handleDisconnect = (event: Event): void => {
    const gp = (event as any).gamepad as Gamepad | undefined
    if (gp && gp.index === this.index) {
      this.connected = false
      this.releaseAll()
    }
  }

  private processButton(button: GamepadButton | undefined, action: Action): void {
    const pressed = button?.pressed ?? false
    this.updateAction(action, pressed)
  }

  private updateAction(action: Action, pressed: boolean): void {
    if (this.state[action] === pressed)
      return
    this.state[action] = pressed
    this.emit?.(action, pressed)
  }

  private releaseAll(): void {
    for (const action of Object.keys(this.state) as Action[])
      this.updateAction(action, false)
  }

  private scanGamepads(): void {
    const pad = navigator.getGamepads()[this.index]
    this.connected = pad !== undefined && pad !== null
  }
}

