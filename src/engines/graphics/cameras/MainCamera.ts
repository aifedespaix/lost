import { PerspectiveCamera, Vector3 } from 'three'

export interface MainCameraOptions {
  fov?: number
  near?: number
  far?: number
  /** Initial camera position. Defaults to a neutral standing height. */
  position?: Vector3
  /** Initial yaw rotation in radians. */
  yaw?: number
  /** Initial pitch rotation in radians. */
  pitch?: number
}

/**
 * Creates the primary perspective camera.
 */
export function createMainCamera(options: MainCameraOptions = {}): PerspectiveCamera {
  const {
    fov = 60,
    near = 0.1,
    far = 2000,
    position = new Vector3(0, 1.8, 0),
    yaw = 0,
    pitch = 0,
  } = options

  const camera = new PerspectiveCamera(fov, 1, near, far)
  camera.position.copy(position)
  camera.rotation.order = 'YXZ'
  camera.rotation.y = yaw
  camera.rotation.x = pitch
  return camera
}
