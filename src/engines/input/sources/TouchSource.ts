/**
 * Captures swipe gestures for camera look on touch devices.
 *
 * Movement is accumulated from `touchmove` events and emitted when {@link poll}
 * is called. Small jitter is ignored using a configurable threshold to avoid
 * unintended camera shake. Default scrolling behaviour is prevented while the
 * source is active.
*/
import type { LookSource } from '../types'

export interface TouchSourceOptions {
  /** Multiplier applied to movement deltas. */
  readonly sensitivity?: number
  /** Invert the Y axis when true. */
  readonly invertY?: boolean
  /** Minimum delta (in pixels) required before movement is registered. */
  readonly jitterThreshold?: number
}

export class TouchSource implements LookSource {
  private emit: ((deltaX: number, deltaY: number) => void) | null = null
  private target: EventTarget | null = null
  private readonly sensitivity: number
  private readonly invertY: boolean
  private readonly jitter: number
  private deltaX = 0
  private deltaY = 0
  private lastX: number | null = null
  private lastY: number | null = null

  constructor(options: TouchSourceOptions = {}) {
    this.sensitivity = options.sensitivity ?? 1
    this.invertY = options.invertY ?? false
    this.jitter = options.jitterThreshold ?? 4
  }

  /** Start listening for touch input. */
  attach(emit: (deltaX: number, deltaY: number) => void, target: EventTarget = window): void {
    if (this.emit)
      return
    this.emit = emit
    this.target = target
    target.addEventListener('touchstart', this.handleTouchStart, { passive: false })
    target.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    target.addEventListener('touchend', this.handleTouchEnd, { passive: false })
    target.addEventListener('touchcancel', this.handleTouchEnd, { passive: false })
  }

  /** Stop listening and reset all internal state. */
  detach(): void {
    if (!this.emit || !this.target)
      return
    this.target.removeEventListener('touchstart', this.handleTouchStart)
    this.target.removeEventListener('touchmove', this.handleTouchMove)
    this.target.removeEventListener('touchend', this.handleTouchEnd)
    this.target.removeEventListener('touchcancel', this.handleTouchEnd)
    this.emit = null
    this.target = null
    this.deltaX = 0
    this.deltaY = 0
    this.lastX = null
    this.lastY = null
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

  private readonly handleTouchStart = (event: TouchEvent): void => {
    if (event.touches.length === 0)
      return
    const touch = event.touches[0]
    this.lastX = touch.clientX
    this.lastY = touch.clientY
  }

  private readonly handleTouchMove = (event: TouchEvent): void => {
    if (event.touches.length === 0)
      return
    const touch = event.touches[0]
    const x = touch.clientX
    const y = touch.clientY
    if (this.lastX !== null && this.lastY !== null) {
      const dx = x - this.lastX
      const dy = y - this.lastY
      if (Math.abs(dx) > this.jitter)
        this.deltaX += dx
      if (Math.abs(dy) > this.jitter)
        this.deltaY += dy
    }
    this.lastX = x
    this.lastY = y
    event.preventDefault()
  }

  private readonly handleTouchEnd = (): void => {
    this.lastX = null
    this.lastY = null
  }
}
