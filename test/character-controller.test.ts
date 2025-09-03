import { describe, expect, it } from 'vitest'
import { CharacterController } from '~/ecs/components/CharacterController'

describe('character controller', () => {
  it('initializes with default values', () => {
    const controller = new CharacterController()
    expect(controller.movementSpeed).toBe(5)
    expect(controller.sprintMultiplier).toBe(1.5)
    expect(controller.jumpImpulse).toBe(5)
    expect(controller.isCrouching).toBe(false)
    expect(controller.isGrounded).toBe(false)
  })

  it('accepts custom configuration', () => {
    const controller = new CharacterController({ movementSpeed: 3, sprintMultiplier: 2, jumpImpulse: 8 })
    expect(controller.movementSpeed).toBe(3)
    expect(controller.sprintMultiplier).toBe(2)
    expect(controller.jumpImpulse).toBe(8)
  })
})
