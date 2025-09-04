import { Object3D } from 'three'
import { describe, expect, it } from 'vitest'
import { CharacterController } from '~/ecs/components/CharacterController'
import { FpsCamera } from '~/ecs/components/FpsCamera'
import { createFpsMoveSystem } from '~/ecs/systems/FpsMoveSystem'
import type { InputEngine } from '~/engines/input/InputEngine'
import { Action } from '~/engines/input/types'

describe('FpsMoveSystem', () => {
  function createInput(actions: Partial<Record<Action, boolean>>): InputEngine {
    const state: Record<Action, boolean> = {} as any
    for (const a of Object.values(Action)) state[a] = false
    Object.assign(state, actions)
    return { snapshot: () => ({ actions: state }) } as unknown as InputEngine
  }

  it('moves forward respecting orientation', () => {
    const camera = new FpsCamera({ yaw: 0 })
    const controller = new CharacterController()
    const target = new Object3D()
    const input = createInput({ [Action.MoveForward]: true })
    const system = createFpsMoveSystem({ input, camera, controller, target })

    system(1)
    expect(target.position.z).toBeCloseTo(5)
  })

  it('normalises diagonal movement and applies sprint', () => {
    const camera = new FpsCamera({ yaw: 0 })
    const controller = new CharacterController()
    const target = new Object3D()
    const input = createInput({
      [Action.MoveForward]: true,
      [Action.MoveRight]: true,
      [Action.Sprint]: true,
    })
    const system = createFpsMoveSystem({ input, camera, controller, target })

    system(1)
    const expected = controller.movementSpeed * controller.sprintMultiplier / Math.sqrt(2)
    expect(target.position.x).toBeCloseTo(expected)
    expect(target.position.z).toBeCloseTo(expected)
  })
})

