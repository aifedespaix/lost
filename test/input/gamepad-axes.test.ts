import { describe, expect, it, vi } from 'vitest'
import { GamepadSource } from '~/engines/input/sources/GamepadSource'
import { Action } from '~/engines/input/types'

function createGamepad(): Gamepad {
  const buttons = Array.from({ length: 17 }, () => ({ pressed: false, value: 0, touched: false }))
  return {
    axes: [0, 0, 0, 0],
    buttons: buttons as any,
    connected: true,
    id: 'stub',
    index: 0,
    mapping: 'standard',
    timestamp: 0,
  }
}

describe('gamepad axes', () => {
  it('applies deadzone and normalises stick values', () => {
    const pad = createGamepad()
    ;(navigator as any).getGamepads = () => [pad]

    const emit = vi.fn()
    const look = vi.fn()
    const source = new GamepadSource({ deadzone: 0.2, onLook: look })
    source.attach(emit)

    const connect = new Event('gamepadconnected') as any
    connect.gamepad = pad
    window.dispatchEvent(connect)

    // within deadzone - no action
    pad.axes[0] = 0.1
    source.poll()
    expect(emit).not.toHaveBeenCalled()

    // outside deadzone - action emitted
    pad.axes[0] = 0.5
    source.poll()
    expect(emit).toHaveBeenCalledWith(Action.MoveRight, true)

    // large values are clamped and passed to look callback
    pad.axes[2] = 2
    pad.axes[3] = -2
    source.poll()
    expect(look).toHaveBeenCalledWith(1, -1)

    source.detach()
  })
})

