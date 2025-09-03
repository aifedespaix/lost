import { Action, type InputSource } from '../types'

/**
 * Translates keyboard and mouse events into high level {@link Action} values.
 *
 * The source queues events on native input and flushes them when polled. This
 * keeps input processing aligned with the engine's update loop and avoids
 * stale state.
 */
export class KeyboardSource implements InputSource {
  private emit: ((action: Action, pressed: boolean) => void) | null = null
  private target: EventTarget | null = null
  private readonly queue: Array<{ action: Action; pressed: boolean }> = []

  attach(emit: (action: Action, pressed: boolean) => void, target: EventTarget = window): void {
    if (this.emit)
      return
    this.emit = emit
    this.target = target
    target.addEventListener('keydown', this.handleKeyDown)
    target.addEventListener('keyup', this.handleKeyUp)
    target.addEventListener('mousedown', this.handleMouseDown)
    target.addEventListener('mouseup', this.handleMouseUp)
  }

  detach(): void {
    if (!this.emit || !this.target)
      return
    this.target.removeEventListener('keydown', this.handleKeyDown)
    this.target.removeEventListener('keyup', this.handleKeyUp)
    this.target.removeEventListener('mousedown', this.handleMouseDown)
    this.target.removeEventListener('mouseup', this.handleMouseUp)
    this.emit = null
    this.target = null
    this.queue.length = 0
  }

  poll(): void {
    if (!this.emit)
      return
    for (const { action, pressed } of this.queue)
      this.emit(action, pressed)
    this.queue.length = 0
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat)
      return
    const action = this.mapKey(event.code)
    if (!action)
      return
    event.preventDefault()
    this.queue.push({ action, pressed: true })
  }

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    const action = this.mapKey(event.code)
    if (!action)
      return
    event.preventDefault()
    this.queue.push({ action, pressed: false })
  }

  private readonly handleMouseDown = (event: MouseEvent): void => {
    const action = this.mapMouseButton(event.button)
    if (!action)
      return
    event.preventDefault()
    this.queue.push({ action, pressed: true })
  }

  private readonly handleMouseUp = (event: MouseEvent): void => {
    const action = this.mapMouseButton(event.button)
    if (!action)
      return
    event.preventDefault()
    this.queue.push({ action, pressed: false })
  }

  private mapKey(code: string): Action | null {
    switch (code) {
      case 'KeyW':
        return Action.MoveForward
      case 'KeyS':
        return Action.MoveBackward
      case 'KeyA':
        return Action.MoveLeft
      case 'KeyD':
        return Action.MoveRight
      case 'Space':
        return Action.Jump
      case 'ShiftLeft':
      case 'ShiftRight':
        return Action.Sprint
      case 'ControlLeft':
      case 'ControlRight':
        return Action.Crouch
      case 'KeyE':
        return Action.Interact
      case 'Escape':
        return Action.Pause
      default:
        return null
    }
  }

  private mapMouseButton(button: number): Action | null {
    switch (button) {
      case 0:
        return Action.Primary
      case 2:
        return Action.Secondary
      default:
        return null
    }
  }
}
