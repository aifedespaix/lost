import { Action, InputSource, type InputState } from './types'

/**
 * Coordinates multiple {@link InputSource}s and exposes immutable snapshots
 * of the current input state each frame.
 */
export class InputEngine {
  private readonly actions: Record<Action, boolean>
  private readonly listeners: Map<Action, Set<(pressed: boolean) => void>> = new Map()
  private readonly sources = new Set<InputSource>()
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
  }

  /** Stop all registered input sources. */
  stop(): void {
    if (!this.running)
      return
    this.running = false
    for (const source of this.sources)
      source.detach()
  }

  /**
   * Returns an immutable snapshot of the current input state.
   * Each call produces a new frozen object to avoid shared mutations.
   */
  snapshot(): InputState {
    for (const source of this.sources)
      source.poll()
    const actions = Object.freeze({ ...this.actions }) as Readonly<Record<Action, boolean>>
    return Object.freeze({ actions })
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

  private createDefaultActionState(): Record<Action, boolean> {
    const state: Record<Action, boolean> = {} as Record<Action, boolean>
    for (const action of Object.values(Action))
      state[action] = false
    return state
  }
}
