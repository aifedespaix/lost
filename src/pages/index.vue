<script setup lang="ts">
import DebugOverlay from '~/dev/DebugOverlay.vue'

const showDebug = import.meta.env.DEV
const hasTouch = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0

const isLocked = ref(false)
const setupRef = ref<{
  handleStick: (x: number, y: number) => void
  handleJump: (pressed: boolean) => void
  handleInteract: (pressed: boolean) => void
  handleCrouch: (pressed: boolean) => void
  handleSprint: (pressed: boolean) => void
} | null>(null)

function handleStick(x: number, y: number): void {
  setupRef.value?.handleStick(x, y)
}

function handleJump(pressed: boolean): void {
  setupRef.value?.handleJump(pressed)
}
function handleInteract(pressed: boolean): void {
  setupRef.value?.handleInteract(pressed)
}
function handleCrouch(pressed: boolean): void {
  setupRef.value?.handleCrouch(pressed)
}
function handleSprint(pressed: boolean): void {
  setupRef.value?.handleSprint(pressed)
}
</script>

<template>
  <ThreeCanvas background="#0e0e12">
    <FpsDemoSetup ref="setupRef" v-model:locked="isLocked" :has-touch="hasTouch" />
    <Ui>
      <DebugOverlay v-if="showDebug" />
      <UiHudCrosshair v-if="isLocked || hasTouch" />
      <UiHudInputHints v-if="isLocked && !hasTouch" />
      <UiInputVirtualStick
        v-if="hasTouch"
        class="absolute bottom-4 left-4"
        @move="handleStick"
      />
      <UiInputActionButtons
        v-if="hasTouch"
        class="absolute bottom-4 right-4"
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
