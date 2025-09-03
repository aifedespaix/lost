import type { PerspectiveCamera, WebGLRenderer } from 'three'
import { describe, expect, it, vi } from 'vitest'
import { ResizeHandler } from '~/3d/engine/ResizeHandler'

describe('resize handler', () => {
  it('updates renderer size and camera aspect', () => {
    const setSize = vi.fn()
    const setPixelRatio = vi.fn()
    const renderer = { setSize, setPixelRatio } as unknown as WebGLRenderer
    const camera = { aspect: 1, updateProjectionMatrix: vi.fn() } as unknown as PerspectiveCamera
    const engine = {
      getRenderer: () => renderer,
      getCamera: () => camera,
    }

    const handler = new ResizeHandler()
    handler.attach(engine)

    ;(window as unknown as { innerWidth: number }).innerWidth = 800
    ;(window as unknown as { innerHeight: number }).innerHeight = 600
    window.dispatchEvent(new Event('resize'))

    expect(setSize).toHaveBeenCalledWith(800, 600)
    expect(setPixelRatio).toHaveBeenCalled()
    expect(camera.aspect).toBeCloseTo(800 / 600)
    expect(camera.updateProjectionMatrix).toHaveBeenCalled()

    handler.detach()
  })
})
