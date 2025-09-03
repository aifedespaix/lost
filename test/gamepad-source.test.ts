import { describe, expect, it, vi } from 'vitest'
import { GamepadSource } from '~/engines/input/sources/GamepadSource'
import { Action } from '~/engines/input/types'

function createGamepad(): Gamepad {
  const buttons = Array.from({ length: 17 }, () => ({ pressed: false, value: 0, touched: false }))
  const gp: Gamepad = {
    axes: [0, 0, 0, 0],
    buttons: buttons as any,
    connected: true,
    id: 'stub',
    index: 0,
    mapping: 'standard',
    timestamp: 0,
  }
  return gp
}

describe('GamepadSource', () => {
  it('emits actions and look data', () => {
    const pad = createGamepad()
    pad.axes[1] = -1 // forward
    pad.axes[2] = 0.5
    pad.axes[3] = -0.25
    pad.buttons[0] = { pressed: true, value: 1, touched: true }

    const emit = vi.fn()
    const look = vi.fn()
    const source = new GamepadSource({ onLook: look })

    ;(navigator as any).getGamepads = () => [pad]

    source.attach(emit)
    window.dispatchEvent(new Event('gamepadconnected', { bubbles: true }))

    source.poll()

    expect(emit).toHaveBeenCalledWith(Action.MoveForward, true)
    expect(emit).toHaveBeenCalledWith(Action.Jump, true)
    expect(look).toHaveBeenCalledWith(0.5, -0.25)
  })

  it('releases actions on disconnect', () => {
    const pad = createGamepad()
    pad.buttons[0] = { pressed: true, value: 1, touched: true }

    const emit = vi.fn()
    const source = new GamepadSource()
    ;(navigator as any).getGamepads = () => [pad]

    source.attach(emit)
    const connect = new Event('gamepadconnected') as any
    connect.gamepad = pad
    window.dispatchEvent(connect)

    source.poll()
    expect(emit).toHaveBeenCalledWith(Action.Jump, true)

    const disconnect = new Event('gamepaddisconnected') as any
    disconnect.gamepad = pad
    window.dispatchEvent(disconnect)

    expect(emit).toHaveBeenCalledWith(Action.Jump, false)
  })

  it('plays rumble effect when supported', async () => {
    const pad = createGamepad()
    const playEffect = vi.fn().mockResolvedValue(undefined)
    ;(pad as any).vibrationActuator = { type: 'dual-rumble', playEffect }
    ;(navigator as any).getGamepads = () => [pad]

    const source = new GamepadSource()
    source.attach(vi.fn())
    const connect = new Event('gamepadconnected') as any
    connect.gamepad = pad
    window.dispatchEvent(connect)

    await source.rumble({ duration: 200 })
    expect(playEffect).toHaveBeenCalled()
  })
})

