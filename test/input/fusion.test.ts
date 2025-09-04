import { describe, expect, it } from 'vitest'
import { InputEngine } from '~/engines/input/InputEngine'
import { KeyboardSource } from '~/engines/input/sources/KeyboardSource'
import { MouseSource } from '~/engines/input/sources/MouseSource'
import { Action } from '~/engines/input/types'

// Utility to toggle pointer lock in tests.
function setPointerLock(locked: boolean): void {
  ;(document as any).pointerLockElement = locked ? document.body : null
  document.dispatchEvent(new Event('pointerlockchange'))
}

describe('keyboard and mouse fusion', () => {
  it('merges keyboard actions with inverted mouse look', () => {
    const engine = new InputEngine()
    engine.registerSource(new KeyboardSource())
    engine.start()

    const look = { x: 0, y: 0 }
    const mouse = new MouseSource({ invertY: true })
    mouse.attach((dx, dy) => {
      look.x += dx
      look.y += dy
    }, window)

    // integrate look deltas into engine snapshots
    const baseSnapshot = engine.snapshot.bind(engine)
    engine.snapshot = () => {
      const snap = baseSnapshot()
      mouse.poll()
      const state: any = { ...snap }
      if (look.x !== 0 || look.y !== 0) {
        state.lookX = look.x
        state.lookY = look.y
        look.x = 0
        look.y = 0
      }
      return state
    }

    setPointerLock(true)

    // simulate inputs
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }))
    const move = new MouseEvent('mousemove')
    Object.defineProperty(move, 'movementX', { value: 5 })
    Object.defineProperty(move, 'movementY', { value: 3 })
    window.dispatchEvent(move)

    const snap = engine.snapshot() as any
    expect(snap.actions[Action.MoveForward]).toBe(true)
    expect(snap.lookX).toBe(5)
    expect(snap.lookY).toBe(-3)

    engine.stop()
    mouse.detach()
  })
})

