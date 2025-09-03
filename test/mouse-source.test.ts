import { describe, expect, it, vi } from 'vitest'
import { MouseSource } from '~/engines/input/sources/MouseSource'

describe('mouse source', () => {
  const setPointerLock = (locked: boolean): void => {
    (document as any).pointerLockElement = locked ? document.body : null
    document.dispatchEvent(new Event('pointerlockchange'))
  }

  it('emits scaled movement when pointer is locked', () => {
    const emit = vi.fn()
    const source = new MouseSource({ sensitivity: 0.5 })
    source.attach(emit)

    setPointerLock(true)
    const event = new MouseEvent('mousemove')
    Object.defineProperty(event, 'movementX', { value: 10 })
    Object.defineProperty(event, 'movementY', { value: -20 })
    window.dispatchEvent(event)

    source.poll()

    expect(emit).toHaveBeenCalledWith(5, -10)
    source.detach()
  })

  it('inverts Y axis when configured', () => {
    const emit = vi.fn()
    const source = new MouseSource({ invertY: true })
    source.attach(emit)

    setPointerLock(true)
    const event = new MouseEvent('mousemove')
    Object.defineProperty(event, 'movementX', { value: 0 })
    Object.defineProperty(event, 'movementY', { value: 8 })
    window.dispatchEvent(event)

    source.poll()

    expect(emit).toHaveBeenCalledWith(0, -8)
    source.detach()
  })

  it('falls back to client deltas when pointer not locked', () => {
    const emit = vi.fn()
    const source = new MouseSource()
    source.attach(emit)

    setPointerLock(false)
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }))
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 90, clientY: 130 }))

    source.poll()

    expect(emit).toHaveBeenCalledWith(-10, 30)
    source.detach()
  })
})
