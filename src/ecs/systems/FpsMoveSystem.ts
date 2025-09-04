import type { Object3D } from 'three'
import { Vector3 } from 'three'

import type { System } from '~/engines/graphics/GameEngine'
import { CharacterController } from '~/ecs/components/CharacterController'
import { FpsCamera } from '~/ecs/components/FpsCamera'
import { InputEngine } from '~/engines/input/InputEngine'
import type { InputState } from '~/engines/input/types'
import { Action } from '~/engines/input/types'

// Rapier types are optional and only used when present at runtime.
import type { RigidBody } from '@dimforge/rapier3d-compat'

/**
 * Options for {@link createFpsMoveSystem}.
 */
export interface FpsMoveSystemOptions {
  /** Engine providing movement input. */
  readonly input: InputEngine
  /** Orientation reference for movement directions. */
  readonly camera: FpsCamera
  /** Character controller configuration and state. */
  readonly controller: CharacterController
  /** Object to translate when physics is unavailable. */
  readonly target: Object3D
  /** Optional Rapier rigid body for physics-based movement. */
  readonly body?: RigidBody
}

/**
 * Creates a system applying first-person character movement.
 *
 * Movement is derived from `moveX`/`moveY` axes or, when absent, from the
 * corresponding directional actions. Sprinting and crouching modify the base
 * speed while jumping applies an impulse. When a Rapier rigid body is provided
 * the system updates its kinematic translation; otherwise the target object is
 * directly moved.
 */
export function createFpsMoveSystem(options: FpsMoveSystemOptions): System {
  const { input, camera, controller, target, body } = options
  const local = new Vector3()
  const world = new Vector3()

  return (dt: number) => {
    const state: InputState = input.snapshot()
    const { actions } = state

    const moveX = state.moveX ?? ((actions[Action.MoveRight] ? 1 : 0) - (actions[Action.MoveLeft] ? 1 : 0))
    const moveY = state.moveY ?? ((actions[Action.MoveForward] ? 1 : 0) - (actions[Action.MoveBackward] ? 1 : 0))

    controller.isCrouching = actions[Action.Crouch]

    let speed = controller.movementSpeed
    if (actions[Action.Sprint])
      speed *= controller.sprintMultiplier
    if (controller.isCrouching)
      speed *= 0.5

    local.set(moveX, 0, moveY)
    if (local.lengthSq() > 1)
      local.normalize()
    local.multiplyScalar(speed * dt)

    const sinYaw = Math.sin(camera.yaw)
    const cosYaw = Math.cos(camera.yaw)
    world.set(
      local.x * cosYaw - local.z * sinYaw,
      0,
      local.x * sinYaw + local.z * cosYaw,
    )

    if (body) {
      const t = body.translation()
      ;(body as any).setNextKinematicTranslation({
        x: t.x + world.x,
        y: t.y + world.y,
        z: t.z + world.z,
      })
      if (actions[Action.Jump] && controller.isGrounded) {
        controller.isGrounded = false
        ;(body as any).applyImpulse({ x: 0, y: controller.jumpImpulse, z: 0 }, true)
      }
    }
    else {
      target.position.add(world)
      if (actions[Action.Jump] && controller.isGrounded) {
        controller.isGrounded = false
        target.position.y += controller.jumpImpulse * dt
      }
    }
  }
}

