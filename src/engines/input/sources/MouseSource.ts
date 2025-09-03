/**
 * Captures relative mouse movement for look controls.
 *
 * Movement is reported via the provided callback when {@link poll} is invoked.
 * Values are accumulated from `mousemove` events and scaled by sensitivity.
 * Optional Y-axis inversion is supported to match user preference.
 */
export interface MouseSourceOptions {
  /** Scalar applied to movement deltas. */
  readonly sensitivity?: number
  /** Inverts the Y axis when true. */
  readonly invertY?: boolean
}

export class MouseSource {
  private emit: ((deltaX: number, deltaY: number) => void) | null = null
  private target: EventTarget | null = null
  private readonly sensitivity: number
  private readonly invertY: boolean
  private locked = false
  private lastX: number | null = null
  private lastY: number | null = null
  private deltaX = 0
  private deltaY = 0

  constructor(options: MouseSourceOptions = {}) {
    this.sensitivity = options.sensitivity ?? 1
    this.invertY = options.invertY ?? false
  }

  /** Begin listening to mouse movement. */
  attach(emit: (deltaX: number, deltaY: number) => void, target: EventTarget = window): void {
    if (this.emit)
      return
    this.emit = emit
    this.target = target
    target.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('pointerlockchange', this.handlePointerLockChange)
    this.locked = document.pointerLockElement !== null
  }

  /** Stop listening and reset internal state. */
  detach(): void {
    if (!this.emit || !this.target)
      return
    this.target.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('pointerlockchange', this.handlePointerLockChange)
    this.emit = null
    this.target = null
    this.deltaX = 0
    this.deltaY = 0
    this.lastX = null
    this.lastY = null
    this.locked = false
  }

  /** Flush accumulated movement through the emit callback. */
  poll(): void {
    if (!this.emit)
      return
    if (this.deltaX === 0 && this.deltaY === 0)
      return
    const factor = this.invertY ? -1 : 1
    const dx = this.deltaX * this.sensitivity
    const dy = this.deltaY * this.sensitivity * factor
    this.emit(dx, dy)
    this.deltaX = 0
    this.deltaY = 0
  }

  private readonly handlePointerLockChange = (): void => {
    this.locked = document.pointerLockElement !== null
    this.lastX = null
    this.lastY = null
  }

  private readonly handleMouseMove = (event: MouseEvent): void => {
    if (this.locked) {
      this.deltaX += event.movementX
      this.deltaY += event.movementY
      return
    }
    if (this.lastX !== null && this.lastY !== null) {
      this.deltaX += event.clientX - this.lastX
      this.deltaY += event.clientY - this.lastY
    }
    this.lastX = event.clientX
    this.lastY = event.clientY
  }
}
