import { describe, expect, it } from 'vitest'
import { FpsCamera } from '~/ecs/components/FpsCamera'

describe('fps camera', () => {
  it('defaults to neutral yaw and pitch', () => {
    const camera = new FpsCamera()
    expect(camera.yaw).toBe(0)
    expect(camera.pitch).toBe(0)
  })

  it('clamps pitch within provided limits', () => {
    const camera = new FpsCamera({ minPitch: -1, maxPitch: 1 })
    camera.pitch = 2
    expect(camera.pitch).toBe(1)
    camera.pitch = -2
    expect(camera.pitch).toBe(-1)
  })
})
