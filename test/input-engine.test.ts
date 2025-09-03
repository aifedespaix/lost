import { describe, expect, it, vi } from 'vitest'
import { InputEngine } from '~/engines/input/InputEngine'
import { Action, type InputSource } from '~/engines/input/types'

describe('InputEngine', () => {
  class MockSource implements InputSource {
    private emit: ((action: Action, pressed: boolean) => void) | null = null
    attach(emit: (action: Action, pressed: boolean) => void): void {
      this.emit = emit
    }
    detach(): void {
      this.emit = null
    }
    poll(): void {}
    trigger(action: Action, pressed: boolean): void {
      this.emit?.(action, pressed)
    }
  }

  it('produces immutable snapshots', () => {
    const engine = new InputEngine()
    const source = new MockSource()
    engine.registerSource(source)
    engine.start()
    source.trigger(Action.Jump, true)
    const snap = engine.snapshot()
    expect(snap.actions[Action.Jump]).toBe(true)
    expect(Object.isFrozen(snap)).toBe(true)
    expect(Object.isFrozen(snap.actions)).toBe(true)
    expect(() => {
      ;(snap.actions as any)[Action.Jump] = false
    }).toThrow()
    const next = engine.snapshot()
    expect(next.actions[Action.Jump]).toBe(true)
  })

  it('notifies listeners on action change', () => {
    const engine = new InputEngine()
    const source = new MockSource()
    engine.registerSource(source)
    const listener = vi.fn()
    engine.onAction(Action.Primary, listener)
    engine.start()
    source.trigger(Action.Primary, true)
    expect(listener).toHaveBeenCalledWith(true)
  })
})
