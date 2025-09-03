import type { Group, Scene } from 'three'
import {
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
} from 'three'

export interface BaseSceneOptions {
  helpers?: Group
}

/**
 * Populates the scene with a basic ground and cube.
 */
export function createBaseScene(scene: Scene, options: BaseSceneOptions = {}): void {
  const { helpers } = options

  const groundGeo = new PlaneGeometry(50, 50)
  const groundMat = new MeshStandardMaterial({ color: 0x808080 })
  const ground = new Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  const cubeGeo = new BoxGeometry(1, 1, 1)
  const cubeMat = new MeshStandardMaterial({ color: 0xCCCCCC })
  const cube = new Mesh(cubeGeo, cubeMat)
  cube.position.set(0, 0.5, 0)
  cube.castShadow = true
  scene.add(cube)

  if (helpers) {
    helpers.add(new AxesHelper(5))
  }
}
