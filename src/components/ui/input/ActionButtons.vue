<script setup lang="ts">
/**
 * Mobile action buttons for jump, interact, crouch and sprint.
 *
 * Each button emits its respective event with a boolean indicating whether the
 * button is pressed (`true`) or released (`false`).
 */
const emit = defineEmits<{
  (e: 'jump', pressed: boolean): void
  (e: 'interact', pressed: boolean): void
  (e: 'crouch', pressed: boolean): void
  (e: 'sprint', pressed: boolean): void
}>()

function press(action: 'jump' | 'interact' | 'crouch' | 'sprint', pressed: boolean): void {
  emit(action, pressed)
}
</script>

<template>
  <div class="action-buttons pointer-events-auto">
    <button
      class="action-button"
      @touchstart.prevent="press('jump', true)"
      @touchend.prevent="press('jump', false)"
      @touchcancel.prevent="press('jump', false)"
    >
      Jump
    </button>
    <button
      class="action-button"
      @touchstart.prevent="press('interact', true)"
      @touchend.prevent="press('interact', false)"
      @touchcancel.prevent="press('interact', false)"
    >
      Interact
    </button>
    <button
      class="action-button"
      @touchstart.prevent="press('crouch', true)"
      @touchend.prevent="press('crouch', false)"
      @touchcancel.prevent="press('crouch', false)"
    >
      Crouch
    </button>
    <button
      class="action-button"
      @touchstart.prevent="press('sprint', true)"
      @touchend.prevent="press('sprint', false)"
      @touchcancel.prevent="press('sprint', false)"
    >
      Sprint
    </button>
  </div>
</template>

<style scoped>
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  touch-action: none;
}

.action-button {
  width: 80px;
  height: 40px;
  border-radius: 0.25rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
</style>
