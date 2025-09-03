/**
 * Movement configuration for a character-controlled entity.
 */
export interface CharacterControllerOptions {
  /** Base walking speed in units per second. */
  movementSpeed?: number
  /** Multiplier applied to {@link movementSpeed} when sprinting. */
  sprintMultiplier?: number
  /** Upward impulse applied when jumping. */
  jumpImpulse?: number
}

export class CharacterController {
  /** Base walking speed in units per second. */
  movementSpeed: number
  /** Multiplier applied to {@link movementSpeed} when sprinting. */
  sprintMultiplier: number
  /** Upward impulse applied when jumping. */
  jumpImpulse: number
  /** Whether the character is currently crouching. */
  isCrouching = false
  /** Whether the character is touching the ground. */
  isGrounded = false

  constructor(options: CharacterControllerOptions = {}) {
    const {
      movementSpeed = 5,
      sprintMultiplier = 1.5,
      jumpImpulse = 5,
    } = options
    this.movementSpeed = movementSpeed
    this.sprintMultiplier = sprintMultiplier
    this.jumpImpulse = jumpImpulse
  }
}
