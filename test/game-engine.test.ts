import * as THREE from 'three'
import { describe, expect, it, vi } from 'vitest'
import { GameEngine } from '~/3d/engine/GameEngine'

class WebGLRendererStub {
  domElement = document.createElement('canvas')
  shadowMap = { enabled: false, type: THREE.PCFSoftShadowMap }
  renderLists = { dispose: vi.fn() }
  setSize = vi.fn()
  setPixelRatio = vi.fn()
  setClearColor = vi.fn()
  render = vi.fn()
  dispose = vi.fn()
  physicallyCorrectLights = false
  outputColorSpace = THREE.SRGBColorSpace
  toneMapping = THREE.ACESFilmicToneMapping
}

describe('game engine', () => {
  it('instantiates and disposes without errors', () => {
    const original = THREE.WebGLRenderer
    Object.defineProperty(THREE, 'WebGLRenderer', {
      configurable: true,
      value: WebGLRendererStub,
    })
    const canvas = document.createElement('canvas')
    const engine = new GameEngine({ canvas, width: 100, height: 100 })
    engine.start()
    engine.dispose()
    const renderer = engine.getRenderer() as unknown as WebGLRendererStub
    expect(renderer.dispose).toHaveBeenCalled()
    Object.defineProperty(THREE, 'WebGLRenderer', { value: original })
  })
})
