import { PerspectiveCamera, Vector3 } from 'three'

export interface MainCameraOptions {
  fov?: number
  near?: number
  far?: number
  position?: Vector3
  target?: Vector3
}

/**
 * Creates the primary perspective camera.
 */
export function createMainCamera(options: MainCameraOptions = {}): PerspectiveCamera {
  const {
    fov = 60,
    near = 0.1,
    far = 2000,
    position = new Vector3(6, 6, 6),
    target = new Vector3(0, 0, 0),
  } = options

  const camera = new PerspectiveCamera(fov, 1, near, far)
  camera.position.copy(position)
  camera.lookAt(target)
  return camera
}
