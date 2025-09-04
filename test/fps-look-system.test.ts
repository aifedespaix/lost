import { PerspectiveCamera } from 'three'
import { describe, expect, it } from 'vitest'
import { FpsCamera } from '~/ecs/components/FpsCamera'
import { createFpsLookSystem } from '~/ecs/systems/FpsLookSystem'
import type { InputEngine } from '~/engines/input/InputEngine'
import type { InputState } from '~/engines/input/types'

describe('FpsLookSystem', () => {
  it('clamps pitch to component limits', () => {
    const camera = new FpsCamera({ minPitch: -0.5, maxPitch: 0.5 })
    const target = new PerspectiveCamera()
    const inputState: InputState = { actions: {}, lookY: 1 }
    const input = { snapshot: () => inputState } as unknown as InputEngine
    const system = createFpsLookSystem({ input, camera, target })

    system(0)
    expect(camera.pitch).toBe(0.5)
    expect(target.rotation.x).toBe(0.5)

    inputState.lookY = -2
    system(0)
    expect(camera.pitch).toBe(-0.5)
    expect(target.rotation.x).toBe(-0.5)
  })
})

