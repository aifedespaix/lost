<script setup lang="ts">
import { layoutHintFromLocale } from '~/engines/input/utils'

/**
 * Displays movement control hints based on the active input device.
 *
 * Keyboard hints adapt to the user's locale, showing either WASD or ZQSD.
 * When a gamepad is connected, a left-stick icon replaces the keys.
 */
const { locale } = useI18n()

const activeDevice = ref<'keyboard' | 'gamepad'>('keyboard')

function handleKeyboard(): void {
  activeDevice.value = 'keyboard'
}

function handleGamepad(): void {
  activeDevice.value = 'gamepad'
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyboard, { passive: true })
  window.addEventListener('gamepadconnected', handleGamepad)
  window.addEventListener('gamepaddisconnected', handleKeyboard)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard)
  window.removeEventListener('gamepadconnected', handleGamepad)
  window.removeEventListener('gamepaddisconnected', handleKeyboard)
})

const keys = computed(() => {
  if (activeDevice.value !== 'keyboard')
    return []
  const hint = layoutHintFromLocale(locale.value)
  return hint === 'azerty' ? ['Z', 'Q', 'S', 'D'] : ['W', 'A', 'S', 'D']
})
</script>

<template>
  <div class="input-hints">
    <template v-if="activeDevice === 'keyboard'">
      <span v-for="key in keys" :key="key" class="key">{{ key }}</span>
    </template>
    <template v-else>
      <div class="gamepad-stick" aria-hidden="true" />
    </template>
  </div>
</template>

<style scoped>
.input-hints {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.25rem;
  pointer-events: none;
  color: rgba(255, 255, 255, 0.7);
}

.key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
}

.gamepad-stick {
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.3);
}

.gamepad-stick::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.4);
  transform: translate(-50%, -50%);
}
</style>

