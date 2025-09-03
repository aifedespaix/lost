import { describe, expect, it } from 'vitest'
import { FpsCamera } from '~/ecs/components/FpsCamera'

describe('fps camera', () => {
  it('clamps pitch within provided limits', () => {
    const camera = new FpsCamera({ minPitch: -1, maxPitch: 1 })
    camera.pitch = 2
    expect(camera.pitch).toBe(1)
    camera.pitch = -2
    expect(camera.pitch).toBe(-1)
  })
})
