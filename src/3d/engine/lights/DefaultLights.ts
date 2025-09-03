import type { Group, Scene } from 'three'
import {
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper,
} from 'three'

export interface DefaultLightsOptions {
  helpers?: Group
}

/**
 * Adds default ambient and directional lights.
 */
export function createDefaultLights(scene: Scene, options: DefaultLightsOptions = {}): void {
  const { helpers } = options

  const ambient = new AmbientLight(0xFFFFFF, 0.5)
  const directional = new DirectionalLight(0xFFFFFF, 1)
  directional.position.set(5, 10, 5)
  directional.castShadow = true
  directional.shadow.mapSize.set(1024, 1024)

  scene.add(ambient)
  scene.add(directional)

  if (helpers)
    helpers.add(new DirectionalLightHelper(directional, 1))
}
