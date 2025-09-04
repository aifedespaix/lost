import { describe, expect, it, vi } from 'vitest'
import { GameEngine } from '~/engines/graphics/GameEngine'

vi.mock('three', async () => {
  const actual = await vi.importActual<typeof import('three')>('three')
  class WebGLRendererStub {
    domElement = document.createElement('canvas')
    shadowMap = { enabled: false, type: actual.PCFSoftShadowMap }
    renderLists = { dispose: vi.fn() }
    setSize = vi.fn()
    setPixelRatio = vi.fn()
    setClearColor = vi.fn()
    render = vi.fn()
    dispose = vi.fn()
    physicallyCorrectLights = false
    outputColorSpace = actual.SRGBColorSpace
    toneMapping = actual.ACESFilmicToneMapping
  }
  return { ...actual, WebGLRenderer: WebGLRendererStub }
})

describe('game engine', () => {
  it('instantiates and disposes without errors', () => {
    const canvas = document.createElement('canvas')
    const engine = new GameEngine({ canvas, width: 100, height: 100 })
    engine.start()
    engine.dispose()
    const renderer = engine.getRenderer() as unknown as { dispose: ReturnType<typeof vi.fn> }
    expect(renderer.dispose).toHaveBeenCalled()
  })

  it('reattaches resize and visibility listeners after restart', () => {
    const raf = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => 0)
    const canvas = document.createElement('canvas')
    const engine = new GameEngine({ canvas, width: 100, height: 100 })

    engine.start()
    engine.stop()

    const renderer = engine.getRenderer() as unknown as { setSize: ReturnType<typeof vi.fn>, setPixelRatio: ReturnType<typeof vi.fn> }
    const loop = (engine as unknown as { loop: { pause: () => void, resume: () => void } }).loop
    const pauseSpy = vi.spyOn(loop, 'pause')
    const resumeSpy = vi.spyOn(loop, 'resume')

    engine.start()

    renderer.setSize.mockClear()
    renderer.setPixelRatio.mockClear()
    pauseSpy.mockClear()
    resumeSpy.mockClear()

    ;(window as unknown as { innerWidth: number }).innerWidth = 200
    ;(window as unknown as { innerHeight: number }).innerHeight = 150
    window.dispatchEvent(new Event('resize'))

    expect(renderer.setSize).toHaveBeenCalledWith(200, 150)
    expect(renderer.setPixelRatio).toHaveBeenCalled()

    const hiddenDescriptor = Object.getOwnPropertyDescriptor(document, 'hidden')
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    document.dispatchEvent(new Event('visibilitychange'))
    expect(pauseSpy).toHaveBeenCalledTimes(1)
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    document.dispatchEvent(new Event('visibilitychange'))
    expect(resumeSpy).toHaveBeenCalledTimes(1)
    if (hiddenDescriptor)
      Object.defineProperty(document, 'hidden', hiddenDescriptor)

    raf.mockRestore()
  })
})
