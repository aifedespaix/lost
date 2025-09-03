import type { Clock } from 'three'
import { describe, expect, it, vi } from 'vitest'
import { Loop } from '~/3d/engine/Loop'

describe('loop', () => {
  it('calls render once per frame in fixed-step mode', () => {
    const step = 1 / 60
    const clock = {
      start: vi.fn(),
      getDelta: vi.fn().mockReturnValue(step * 3),
      elapsedTime: 0,
    } as unknown as Clock

    const loop = new Loop({ fixed: true, fps: 60 }, clock)
    const update = vi.fn()
    const render = vi.fn()
    loop.onUpdate(update)
    loop.onRender(render)

    let frame: FrameRequestCallback | undefined
    const raf = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        frame = cb
        return 0
      })

    loop.start()
    frame?.()

    expect(update).toHaveBeenCalledTimes(3)
    expect(render).toHaveBeenCalledTimes(1)
    expect(render.mock.calls[0][0]).toBeCloseTo(step)

    loop.stop()
    raf.mockRestore()
  })
})
