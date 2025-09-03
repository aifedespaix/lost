import { Action } from '~/engines/input/types'

export const defaultInputBindings: Record<'keyboardMouse' | 'gamepad' | 'mobile', Record<Action, readonly string[]>> = {
  keyboardMouse: {
    [Action.MoveForward]: ['KeyW', 'ArrowUp'],
    [Action.MoveBackward]: ['KeyS', 'ArrowDown'],
    [Action.MoveLeft]: ['KeyA', 'ArrowLeft'],
    [Action.MoveRight]: ['KeyD', 'ArrowRight'],
    [Action.Jump]: ['Space'],
    [Action.Primary]: ['Mouse0'],
    [Action.Secondary]: ['Mouse1'],
    [Action.Pause]: ['Escape'],
  },
  gamepad: {
    [Action.MoveForward]: ['AxisLeftY-'],
    [Action.MoveBackward]: ['AxisLeftY+'],
    [Action.MoveLeft]: ['AxisLeftX-'],
    [Action.MoveRight]: ['AxisLeftX+'],
    [Action.Jump]: ['Button0'],
    [Action.Primary]: ['Button0'],
    [Action.Secondary]: ['Button1'],
    [Action.Pause]: ['Button9'],
  },
  mobile: {
    [Action.MoveForward]: ['swipe-up'],
    [Action.MoveBackward]: ['swipe-down'],
    [Action.MoveLeft]: ['swipe-left'],
    [Action.MoveRight]: ['swipe-right'],
    [Action.Jump]: ['tap-hold'],
    [Action.Primary]: ['tap'],
    [Action.Secondary]: ['double-tap'],
    [Action.Pause]: ['two-finger-tap'],
  },
}
