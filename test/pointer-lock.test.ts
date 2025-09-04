import { describe, expect, it, vi } from 'vitest'
import { usePointerLock } from '~/composables/usePointerLock'

describe('usePointerLock', () => {
  it('handles request and exit and tracks lock state', () => {
    const element = Object.assign(document.createElement('div'), {
      requestPointerLock: vi.fn(),
    }) as HTMLElement & { requestPointerLock: ReturnType<typeof vi.fn> }

    const exitStub = vi.fn()
    // @ts-expect-error allow assigning stub
    document.exitPointerLock = exitStub

    const { isLocked, requestLock, exitLock } = usePointerLock(element)

    requestLock()
    expect(element.requestPointerLock).toHaveBeenCalled()

    // Simulate entering pointer lock
    // @ts-expect-error allow setting readonly field
    document.pointerLockElement = element
    document.dispatchEvent(new Event('pointerlockchange'))
    expect(isLocked.value).toBe(true)

    exitLock()
    expect(exitStub).toHaveBeenCalled()

    // Simulate exiting pointer lock
    // @ts-expect-error allow setting readonly field
    document.pointerLockElement = null
    document.dispatchEvent(new Event('pointerlockchange'))
    expect(isLocked.value).toBe(false)
  })
})
