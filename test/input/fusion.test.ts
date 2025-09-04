import { describe, expect, it } from 'vitest'
import { InputEngine } from '~/engines/input/InputEngine'
import { KeyboardSource } from '~/engines/input/sources/KeyboardSource'
import { MouseSource } from '~/engines/input/sources/MouseSource'
import { Action } from '~/engines/input/types'
import type { MoveSource } from '~/engines/input/types'

// Utility to toggle pointer lock in tests.
function setPointerLock(locked: boolean): void {
  ;(document as any).pointerLockElement = locked ? document.body : null
  document.dispatchEvent(new Event('pointerlockchange'))
}

describe('keyboard and mouse fusion', () => {
  it('merges keyboard actions with inverted mouse look', () => {
    const engine = new InputEngine()
    engine.registerSource(new KeyboardSource())
    const mouse = new MouseSource({ invertY: true })
    engine.registerLookSource(mouse)
    engine.start()

    setPointerLock(true)

    // simulate inputs
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }))
    const move = new MouseEvent('mousemove')
    Object.defineProperty(move, 'movementX', { value: 5 })
    Object.defineProperty(move, 'movementY', { value: 3 })
    window.dispatchEvent(move)

    const snap = engine.snapshot()
    expect(snap.actions[Action.MoveForward]).toBe(true)
    expect(snap.lookX).toBe(5)
    expect(snap.lookY).toBe(-3)

    engine.stop()
  })

  it('captures analogue movement values', () => {
    const engine = new InputEngine()
    const source: MoveSource = {
      emit: null,
      attach(fn: (x: number, y: number) => void) {
        this.emit = fn
      },
      detach() {
        this.emit = null
      },
      poll() {
        this.emit?.(0.5, -0.25)
      },
    }
    engine.registerMoveSource(source)
    engine.start()

    const snap = engine.snapshot()
    expect(snap.moveX).toBeCloseTo(0.5)
    expect(snap.moveY).toBeCloseTo(-0.25)

  engine.stop()
  })
})
