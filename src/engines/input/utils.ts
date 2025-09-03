/**
 * Utility helpers for input processing.
 *
 * Each function is stateless and side-effect free to ease testing and reuse.
 */

/**
 * Restrict a number to the inclusive `[min, max]` range.
 *
 * @param value - Number to clamp.
 * @param min - Lower bound.
 * @param max - Upper bound.
 * @returns Clamped number.
 * @throws {RangeError} If `min` is greater than `max`.
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max)
    throw new RangeError('clamp: min must be less than or equal to max')
  if (value < min)
    return min
  if (value > max)
    return max
  return value
}

/** Result of a {@link smoothDamp} calculation. */
export interface SmoothDampResult {
  /** New value after damping. */
  readonly value: number
  /** Updated velocity to be used for the next step. */
  readonly velocity: number
}

/**
 * Gradually changes a value towards a desired goal over time.
 *
 * The function emulates critically damped spring motion and never overshoots
 * the target. The returned velocity should be persisted and passed back on the
 * next call.
 *
 * @param current - Current value.
 * @param target - Target value to reach.
 * @param currentVelocity - Current velocity; typically persisted between calls.
 * @param smoothTime - Time the value should take to reach the target. Must be positive.
 * @param deltaTime - Time step of this update. Must be non-negative.
 * @param maxSpeed - Optional speed cap. Defaults to `Infinity`.
 * @returns New value and velocity.
 */
export function smoothDamp(
  current: number,
  target: number,
  currentVelocity: number,
  smoothTime: number,
  deltaTime: number,
  maxSpeed: number = Number.POSITIVE_INFINITY,
): SmoothDampResult {
  if (smoothTime <= 0)
    throw new RangeError('smoothDamp: smoothTime must be greater than 0')
  if (deltaTime < 0)
    throw new RangeError('smoothDamp: deltaTime must be non-negative')

  const omega = 2 / smoothTime
  const x = omega * deltaTime
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)

  let change = current - target
  const originalTo = target

  const maxChange = maxSpeed * smoothTime
  change = clamp(change, -maxChange, maxChange)
  target = current - change

  let temp = (currentVelocity + omega * change) * deltaTime
  let newVelocity = (currentVelocity - omega * temp) * exp
  let newValue = target + (change + temp) * exp

  // Prevent overshooting.
  if ((originalTo - current > 0) === (newValue > originalTo)) {
    newValue = originalTo
    newVelocity = (newValue - originalTo) / deltaTime
  }

  return { value: newValue, velocity: newVelocity }
}

/**
 * Apply an analog deadzone to a value between `-1` and `1`.
 *
 * Values within the deadzone return `0`. Remaining values are rescaled so the
 * output preserves full sensitivity outside the deadzone.
 *
 * @param value - Input value.
 * @param deadzone - Deadzone radius in the range `[0, 1)`. Defaults to `0`.
 * @returns Adjusted value.
 * @throws {RangeError} If `deadzone` is outside `[0, 1)`.
 */
export function applyDeadzone(value: number, deadzone: number = 0): number {
  if (deadzone < 0 || deadzone >= 1)
    throw new RangeError('applyDeadzone: deadzone must be in [0, 1)')

  const abs = Math.abs(value)
  if (abs <= deadzone)
    return 0
  const sign = Math.sign(value)
  return sign * ((abs - deadzone) / (1 - deadzone))
}

/** Possible keyboard layout hints. */
export type LayoutHint = 'qwerty' | 'azerty' | 'qwertz'

/**
 * Best-effort keyboard layout guess based on a BCP 47 locale string.
 *
 * The mapping is intentionally conservative and only covers the most common
 * layouts. Unknown locales default to `'qwerty'`.
 *
 * @param locale - BCP 47 language tag, e.g. `en-US` or `fr-FR`.
 * @returns Layout hint.
 */
export function layoutHintFromLocale(locale: string): LayoutHint {
  const lang = locale.toLowerCase().split('-')[0]
  switch (lang) {
    case 'fr':
      return 'azerty'
    case 'de':
      return 'qwertz'
    default:
      return 'qwerty'
  }
}

