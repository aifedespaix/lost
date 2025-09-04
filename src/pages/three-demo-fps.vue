<script setup lang="ts">
import DebugOverlay from '~/dev/DebugOverlay.vue'
import { GamepadSource } from '~/engines/input/sources/GamepadSource'
import { KeyboardSource } from '~/engines/input/sources/KeyboardSource'
import { MouseSource } from '~/engines/input/sources/MouseSource'
import { TouchSource } from '~/engines/input/sources/TouchSource'
import { Action } from '~/engines/input/types'
import type { InputSource, MoveSource } from '~/engines/input/types'

const MOUSE_LOOK_SENSITIVITY = 0.002
const TOUCH_LOOK_SENSITIVITY = 0.002
const GAMEPAD_LOOK_SENSITIVITY = 0.04

const showDebug = import.meta.env.DEV
const hasTouch = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0

const engine = useThreeEngine()
const move = reactive({ x: 0, y: 0 })

const isLocked = ref(false)
useEventListener(document, 'pointerlockchange', () => {
  isLocked.value = document.pointerLockElement !== null
})

const mobileSource: InputSource & {
  trigger: (action: Action, pressed: boolean) => void
} = (() => {
  let emit: ((action: Action, pressed: boolean) => void) | null = null
  return {
    attach: (e) => {
      emit = e
    },
    detach: () => {
      emit = null
    },
    poll: () => {},
    trigger: (action, pressed) => {
      emit?.(action, pressed)
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
        input.addLook(dx * GAMEPAD_LOOK_SENSITIVITY, dy * GAMEPAD_LOOK_SENSITIVITY)
      },
    }),
  )

  mouse = new MouseSource({ sensitivity: MOUSE_LOOK_SENSITIVITY })
  input.registerLookSource(mouse)

  if (hasTouch) {
    touch = new TouchSource({ sensitivity: TOUCH_LOOK_SENSITIVITY })
    input.registerLookSource(touch)
    input.registerSource(mobileSource)
    input.registerMoveSource({
      emit: null,
      attach: (e) => { this.emit = e },
      detach: () => { this.emit = null },
      poll: () => { this.emit?.(move.x, move.y) },
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
</script>

<template>
  <ThreeCanvas background="#0e0e12">
    <Ui>
      <DebugOverlay v-if="showDebug" />
      <UiHudCrosshair v-if="isLocked || hasTouch" />
      <UiHudInputHints v-if="isLocked && !hasTouch" />
      <UiInputVirtualStick
        v-if="hasTouch"
        class="absolute left-4 bottom-4"
        @move="handleStick"
      />
      <UiInputActionButtons
        v-if="hasTouch"
        class="absolute right-4 bottom-4"
        @jump="handleJump"
        @interact="handleInteract"
        @crouch="handleCrouch"
        @sprint="handleSprint"
      />
      <div
        v-if="!isLocked && !hasTouch"
        class="pointer-events-none absolute inset-0 flex items-center justify-center text-white/70"
      >
        Click to capture pointer
      </div>
    </Ui>
  </ThreeCanvas>
</template>
