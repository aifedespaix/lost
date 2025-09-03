<script setup lang="ts">
import { layoutHintFromLocale } from '~/engines/input/utils'

/**
 * Displays movement control hints for the active input method.
 *
 * Keyboard hints adapt to the user's locale, showing either WASD or ZQSD.
 * A gamepad connection replaces the keys with a generic left-stick icon.
 */
const { locale } = useI18n()

const activeDevice = ref<'keyboard' | 'gamepad'>('keyboard')

function useKeyboard(): void {
  activeDevice.value = 'keyboard'
}

function useGamepad(): void {
  activeDevice.value = 'gamepad'
}

useEventListener(window, 'keydown', useKeyboard, { passive: true })
useEventListener(window, 'gamepadconnected', useGamepad)
useEventListener(window, 'gamepaddisconnected', useKeyboard)

const keys = computed<readonly string[]>(() => {
  if (activeDevice.value !== 'keyboard')
    return []
  const hint = layoutHintFromLocale(locale.value)
  return hint === 'azerty' ? ['Z', 'Q', 'S', 'D'] : ['W', 'A', 'S', 'D']
})
</script>

<template>
  <div class="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 text-white/70">
    <template v-if="activeDevice === 'keyboard'">
      <span
        v-for="key in keys"
        :key="key"
        class="key flex h-6 w-6 items-center justify-center rounded border border-white/20 bg-black/30 text-xs"
      >{{ key }}</span>
    </template>
    <template v-else>
      <div class="gamepad-stick i-carbon-game-console text-2xl opacity-70" aria-hidden="true" />
    </template>
  </div>
</template>
