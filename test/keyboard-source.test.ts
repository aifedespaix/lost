import { describe, expect, it, vi } from 'vitest'
import { Action } from '~/engines/input/types'
import { KeyboardSource } from '~/engines/input/sources/KeyboardSource'

describe('KeyboardSource', () => {
  it('emits mapped key actions when polled', () => {
    const emit = vi.fn()
    const source = new KeyboardSource()
    source.attach(emit)

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }))
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW' }))
    source.poll()

    expect(emit).toHaveBeenNthCalledWith(1, Action.MoveForward, true)
    expect(emit).toHaveBeenNthCalledWith(2, Action.MoveForward, false)

    source.detach()
  })

  it('emits mouse button actions', () => {
    const emit = vi.fn()
    const source = new KeyboardSource()
    source.attach(emit)

    window.dispatchEvent(new MouseEvent('mousedown', { button: 0 }))
    window.dispatchEvent(new MouseEvent('mouseup', { button: 0 }))
    source.poll()

    expect(emit).toHaveBeenNthCalledWith(1, Action.Primary, true)
    expect(emit).toHaveBeenNthCalledWith(2, Action.Primary, false)

    source.detach()
  })
})
