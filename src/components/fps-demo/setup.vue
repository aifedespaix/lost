<script setup lang="ts">
import { GamepadSource } from '~/engines/input/sources/GamepadSource'
import { KeyboardSource } from '~/engines/input/sources/KeyboardSource'
import { MouseSource } from '~/engines/input/sources/MouseSource'
import { TouchSource } from '~/engines/input/sources/TouchSource'
import { Action } from '~/engines/input/types'
import type { InputSource, MoveSource } from '~/engines/input/types'

/**
 * Registers input sources for the FPS demo and forwards pointer-lock state
 * to the parent component.
 */
const props = defineProps<{ hasTouch: boolean }>()
const emit = defineEmits<{ 'update:locked': [value: boolean] }>()

const MOUSE_LOOK_SENSITIVITY = 0.002
const TOUCH_LOOK_SENSITIVITY = 0.002
const GAMEPAD_LOOK_SENSITIVITY = 0.04

const engine = useThreeEngine()
const move = reactive({ x: 0, y: 0 })

const isLocked = ref(false)
useEventListener(document, 'pointerlockchange', () => {
  const locked = document.pointerLockElement !== null
  isLocked.value = locked
  emit('update:locked', locked)
})

const mobileSource: InputSource & {
  trigger: (action: Action, pressed: boolean) => void
} = (() => {
  let emitAction: ((action: Action, pressed: boolean) => void) | null = null
  return {
    attach(e) {
      emitAction = e
    },
    detach() {
      emitAction = null
    },
    poll() {},
    trigger(action, pressed) {
      emitAction?.(action, pressed)
    },
  }
})()

let mouse: MouseSource | undefined
let touch: TouchSource | undefined

onMounted(() => {
  const input = engine.getInputEngine()

  input.registerSource(new KeyboardSource())
  input.registerSource(
    new GamepadSource({
      onLook(dx, dy) {
        input.addLook(
          dx * GAMEPAD_LOOK_SENSITIVITY,
          dy * GAMEPAD_LOOK_SENSITIVITY,
        )
      },
    }),
  )

  mouse = new MouseSource({ sensitivity: MOUSE_LOOK_SENSITIVITY })
  input.registerLookSource(mouse)

  if (props.hasTouch) {
    touch = new TouchSource({ sensitivity: TOUCH_LOOK_SENSITIVITY })
    input.registerLookSource(touch)
    input.registerSource(mobileSource)
    input.registerMoveSource({
      emit: null,
      attach(e) {
        this.emit = e
      },
      detach() {
        this.emit = null
      },
      poll() {
        this.emit?.(move.x, move.y)
      },
    } as MoveSource)
  }
})

function handleStick(x: number, y: number): void {
  move.x = x
  move.y = -y
}

function handleJump(pressed: boolean): void {
  mobileSource.trigger(Action.Jump, pressed)
}
function handleInteract(pressed: boolean): void {
  mobileSource.trigger(Action.Interact, pressed)
}
function handleCrouch(pressed: boolean): void {
  mobileSource.trigger(Action.Crouch, pressed)
}
function handleSprint(pressed: boolean): void {
  mobileSource.trigger(Action.Sprint, pressed)
}

defineExpose({
  handleStick,
  handleJump,
  handleInteract,
  handleCrouch,
  handleSprint,
})
</script>

<template />

