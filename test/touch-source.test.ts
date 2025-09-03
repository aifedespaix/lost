import { describe, expect, it, vi } from 'vitest'
import { TouchSource } from '~/engines/input/sources/TouchSource'

describe('touch source', () => {
  const createEvent = (type: string, x: number, y: number): TouchEvent => {
    const event = new Event(type, { cancelable: true }) as TouchEvent
    Object.defineProperty(event, 'touches', { value: [{ clientX: x, clientY: y }] })
    return event
  }

  it('emits scaled movement and prevents default scrolling', () => {
    const emit = vi.fn()
    const source = new TouchSource({ sensitivity: 0.5, jitterThreshold: 0 })
    source.attach(emit)

    window.dispatchEvent(createEvent('touchstart', 0, 0))
    const move = createEvent('touchmove', 10, -20)
    window.dispatchEvent(move)

    source.poll()

    expect(emit).toHaveBeenCalledWith(5, -10)
    expect(move.defaultPrevented).toBe(true)
    source.detach()
  })

  it('ignores movement below jitter threshold', () => {
    const emit = vi.fn()
    const source = new TouchSource({ jitterThreshold: 5 })
    source.attach(emit)

    window.dispatchEvent(createEvent('touchstart', 0, 0))
    window.dispatchEvent(createEvent('touchmove', 3, 4)) // below threshold on both axes

    source.poll()

    expect(emit).not.toHaveBeenCalled()
    source.detach()
  })
})
