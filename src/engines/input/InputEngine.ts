import { Action, InputSource, type InputState, type LookSource, type MoveSource } from './types'
import { clamp } from './utils'

/**
 * Coordinates multiple {@link InputSource}s and exposes immutable snapshots
 * of the current input state each frame.
 */
export class InputEngine {
  private readonly actions: Record<Action, boolean>
  private readonly listeners: Map<Action, Set<(pressed: boolean) => void>> = new Map()
  private readonly sources = new Set<InputSource>()
  private readonly lookSources = new Set<LookSource>()
  private readonly moveSources = new Set<MoveSource>()
  private lookX = 0
  private lookY = 0
  private moveX = 0
  private moveY = 0
  private running = false

  constructor() {
    this.actions = this.createDefaultActionState()
  }

  /** Start all registered input sources. */
  start(): void {
    if (this.running)
      return
    this.running = true
    for (const source of this.sources)
      source.attach(this.handleInput)
    for (const source of this.lookSources)
      source.attach(this.handleLook)
    for (const source of this.moveSources)
      source.attach(this.handleMove)
  }

  /** Stop all registered input sources. */
  stop(): void {
    if (!this.running)
      return
    this.running = false
    for (const source of this.sources)
      source.detach()
    for (const source of this.lookSources)
      source.detach()
    for (const source of this.moveSources)
      source.detach()
  }

  /**
   * Returns an immutable snapshot of the current input state.
   * Each call produces a new frozen object to avoid shared mutations.
   */
  snapshot(): InputState {
    for (const source of this.sources)
      source.poll()
    for (const source of this.lookSources)
      source.poll()
    for (const source of this.moveSources)
      source.poll()
    const actions = Object.freeze({ ...this.actions }) as Readonly<Record<Action, boolean>>
    const state: {
      actions: Readonly<Record<Action, boolean>>
      lookX?: number
      lookY?: number
      moveX?: number
      moveY?: number
    } = { actions }
    if (this.lookX !== 0 || this.lookY !== 0) {
      state.lookX = this.lookX
      state.lookY = this.lookY
      this.lookX = 0
      this.lookY = 0
    }
    if (this.moveX !== 0 || this.moveY !== 0) {
      state.moveX = clamp(this.moveX, -1, 1)
      state.moveY = clamp(this.moveY, -1, 1)
      this.moveX = 0
      this.moveY = 0
    }
    return Object.freeze(state) as InputState
  }

  /**
   * Register a callback fired when the specified action changes.
   * Returns a function that removes the listener.
   */
  onAction(action: Action, callback: (pressed: boolean) => void): () => void {
    let set = this.listeners.get(action)
    if (!set) {
      set = new Set()
      this.listeners.set(action, set)
    }
    set.add(callback)
    return () => {
      set!.delete(callback)
      if (set!.size === 0)
        this.listeners.delete(action)
    }
  }

  /**
   * Registers an {@link InputSource}. If the engine is already running the
   * source is immediately started.
   */
  registerSource(source: InputSource): void {
    this.sources.add(source)
    if (this.running)
      source.attach(this.handleInput)
  }

  /**
   * Register a {@link LookSource}. The engine accumulates deltas from all
   * sources each frame, allowing multiple devices (mouse, touch, gamepad) to
   * contribute simultaneously.
   */
  registerLookSource(source: LookSource): void {
    this.lookSources.add(source)
    if (this.running)
      source.attach(this.handleLook)
  }

  /**
   * Register a {@link MoveSource} providing analogue movement axes.
   */
  registerMoveSource(source: MoveSource): void {
    this.moveSources.add(source)
    if (this.running)
      source.attach(this.handleMove)
  }

  /**
   * Manually accumulate look deltas. Useful for sources that expose their own
   * callbacks (e.g. gamepads).
   */
  addLook(dx: number, dy: number): void {
    this.lookX += dx
    this.lookY += dy
  }

  /**
   * Manually accumulate analogue movement axes.
   */
  addMove(x: number, y: number): void {
    this.moveX += x
    this.moveY += y
  }

  private readonly handleInput = (action: Action, pressed: boolean): void => {
    if (this.actions[action] === pressed)
      return
    this.actions[action] = pressed
    const listeners = this.listeners.get(action)
    if (listeners) {
      for (const listener of listeners)
        listener(pressed)
    }
  }

  private readonly handleLook = (dx: number, dy: number): void => {
    this.addLook(dx, dy)
  }

  private readonly handleMove = (x: number, y: number): void => {
    this.addMove(x, y)
  }

  private createDefaultActionState(): Record<Action, boolean> {
    const state: Record<Action, boolean> = {} as Record<Action, boolean>
    for (const action of Object.values(Action))
      state[action] = false
    return state
  }
}
