import { describe, expect, it } from 'vitest'
import { createMainCamera } from '~/engines/graphics/cameras/MainCamera'

import { Vector3 } from 'three'

describe('main camera', () => {
  it('initializes at neutral position and orientation', () => {
    const camera = createMainCamera()
    expect(camera.position).toEqual(new Vector3(0, 1.8, 0))
    expect(camera.rotation.y).toBe(0)
    expect(camera.rotation.x).toBe(0)
  })

  it('applies provided yaw and pitch', () => {
    const yaw = Math.PI / 4
    const pitch = -Math.PI / 6
    const camera = createMainCamera({ yaw, pitch })
    expect(camera.rotation.y).toBe(yaw)
    expect(camera.rotation.x).toBe(pitch)
  })
})
