<script setup lang="ts">
import DebugOverlay from '~/dev/DebugOverlay.vue'

const showDebug = import.meta.env.DEV
const hasTouch = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0
</script>

<template>
  <ThreeCanvas background="#0e0e12" :show-helpers="true">
    <Ui>
      <DebugOverlay v-if="showDebug" />
      <UiInputVirtualStick v-if="hasTouch" class="absolute left-4 bottom-4" />
      <UiInputActionButtons v-if="hasTouch" class="absolute right-4 bottom-4" />
    </Ui>
  </ThreeCanvas>
</template>
