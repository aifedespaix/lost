import type { PerspectiveCamera } from 'three'

import type { System } from '~/engines/graphics/GameEngine'
import { FpsCamera } from '~/ecs/components/FpsCamera'
import { InputEngine } from '~/engines/input/InputEngine'
import type { InputState } from '~/engines/input/types'

/**
 * Options for {@link createFpsLookSystem}.
 */
export interface FpsLookSystemOptions {
  /** Engine providing per-frame look deltas. */
  readonly input: InputEngine
  /** Component storing camera orientation. */
  readonly camera: FpsCamera
  /** Three.js camera to update. */
  readonly target: PerspectiveCamera
}

/**
 * Creates a system applying look deltas to a first-person camera.
 *
 * The system consumes `lookX` and `lookY` values from the {@link InputEngine}
 * and updates yaw and pitch on the provided {@link FpsCamera}. Pitch is
 * automatically clamped to the component's configured limits.
 *
 * The Three.js camera's rotation is kept in sync using `YXZ` order to avoid
 * roll accumulation.
 */
export function createFpsLookSystem(options: FpsLookSystemOptions): System {
  const { input, camera, target } = options
  target.rotation.order = 'YXZ'

  return () => {
    const state: InputState = input.snapshot()
    const dx = state.lookX ?? 0
    const dy = state.lookY ?? 0
    if (dx === 0 && dy === 0)
      return

    camera.yaw += dx
    camera.pitch = camera.pitch + dy

    target.rotation.y = camera.yaw
    target.rotation.x = camera.pitch
  }
}

