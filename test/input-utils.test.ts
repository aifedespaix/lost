import { describe, expect, it } from 'vitest'
import { applyDeadzone, clamp, layoutHintFromLocale, smoothDamp, type LayoutHint } from '~/engines/input/utils'

describe('clamp', () => {
  it('restricts value within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-5, 0, 10)).toBe(0)
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('throws when min is greater than max', () => {
    expect(() => clamp(0, 10, 0)).toThrow(RangeError)
  })
})

describe('smoothDamp', () => {
  it('converges toward the target without overshoot', () => {
    let value = 0
    let velocity = 0
    for (let i = 0; i < 60; i++) {
      const result = smoothDamp(value, 1, velocity, 0.2, 1 / 60, Infinity)
      value = result.value
      velocity = result.velocity
    }
    expect(value).toBeCloseTo(1, 2)
  })

  it('handles zero delta time', () => {
    const res = smoothDamp(0, 1, 0, 0.3, 0, Infinity)
    expect(res.value).toBe(0)
    expect(res.velocity).toBe(0)
  })
})

describe('applyDeadzone', () => {
  it('returns zero inside the deadzone', () => {
    expect(applyDeadzone(0.05, 0.1)).toBe(0)
  })

  it('scales values outside the deadzone', () => {
    expect(applyDeadzone(0.5, 0.2)).toBeCloseTo(0.375)
    expect(applyDeadzone(-0.5, 0.2)).toBeCloseTo(-0.375)
  })

  it('rejects invalid deadzone values', () => {
    expect(() => applyDeadzone(0.5, -0.1)).toThrow(RangeError)
    expect(() => applyDeadzone(0.5, 1.1)).toThrow(RangeError)
  })
})

describe('layoutHintFromLocale', () => {
  const cases: Array<[string, LayoutHint]> = [
    ['fr', 'azerty'],
    ['fr-FR', 'azerty'],
    ['de-DE', 'qwertz'],
    ['en-US', 'qwerty'],
    ['es-ES', 'qwerty'],
  ]

  for (const [input, expected] of cases) {
    it(`maps ${input} to ${expected}`, () => {
      expect(layoutHintFromLocale(input)).toBe(expected)
    })
  }
})

