import type { PerspectiveCamera, WebGLRenderer } from 'three'
import { describe, expect, it, vi } from 'vitest'
import { ResizeHandler } from '~/engines/graphics/ResizeHandler'

describe('resize handler', () => {
  it('updates renderer size, camera aspect and reacts to DPR changes', () => {
    const setSize = vi.fn()
    const setPixelRatio = vi.fn()
    const renderer = { setSize, setPixelRatio } as unknown as WebGLRenderer
    const updateProjectionMatrix = vi.fn()
    const camera = { aspect: 1, updateProjectionMatrix } as unknown as PerspectiveCamera
    const engine = {
      getRenderer: () => renderer,
      getCamera: () => camera,
    }

    ;(window as any).innerWidth = 800
    ;(window as any).innerHeight = 600
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 1 })

    let dprListener: ((e: MediaQueryListEvent) => void) | undefined
    ;(window as any).matchMedia = vi.fn().mockImplementation(() => ({
      addEventListener: (_: 'change', cb: (e: MediaQueryListEvent) => void) => { dprListener = cb },
      removeEventListener: (_: 'change', cb: (e: MediaQueryListEvent) => void) => {
        if (dprListener === cb)
          dprListener = undefined
      },
    }) as unknown as MediaQueryList)

    const handler = new ResizeHandler()
    handler.attach(engine)
    window.dispatchEvent(new Event('resize'))

    expect(setSize).toHaveBeenCalledWith(800, 600)
    expect(setPixelRatio).toHaveBeenLastCalledWith(1)
    expect(camera.aspect).toBeCloseTo(800 / 600)
    expect(updateProjectionMatrix).toHaveBeenCalledTimes(2)

    setPixelRatio.mockClear()
    updateProjectionMatrix.mockClear()
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 2 })
    dprListener?.({ matches: true } as MediaQueryListEvent)

    expect(setPixelRatio).toHaveBeenCalledWith(2)
    expect(camera.aspect).toBeCloseTo(800 / 600)
    expect(updateProjectionMatrix).toHaveBeenCalledTimes(1)

    handler.detach()
    expect(dprListener).toBeUndefined()
  })
})
