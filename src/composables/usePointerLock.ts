import type { Ref } from 'vue'

/**
 * Manages Pointer Lock API state for a given element.
 *
 * @param target - Target element or ref of the element to lock the pointer on.
 * @returns Reactive lock state and helpers to request or exit pointer lock.
 */
export function usePointerLock(target?: Ref<HTMLElement | null> | HTMLElement | null) {
  const element = isRef(target) ? target : ref(target ?? null)
  const isLocked = ref(false)

  /** Request pointer lock on the target element. */
  function requestLock(): void {
    element.value?.requestPointerLock()
  }

  /** Exit pointer lock if currently locked. */
  function exitLock(): void {
    if (document.pointerLockElement)
      document.exitPointerLock()
  }

  function handleChange(): void {
    isLocked.value = document.pointerLockElement === element.value
  }

  useEventListener(document, 'pointerlockchange', handleChange)

  onBeforeUnmount(() => {
    if (isLocked.value)
      exitLock()
  })

  return {
    isLocked: readonly(isLocked),
    requestLock,
    exitLock,
  }
}

