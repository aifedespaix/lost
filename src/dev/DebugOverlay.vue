<script setup lang="ts">
const engine = useThreeEngine()
const paused = ref(false)
const helpersVisible = ref(true)

function togglePause(): void {
  if (paused.value) {
    engine.start()
  }
  else {
    engine.stop()
  }
  paused.value = !paused.value
}

function toggleHelpers(): void {
  helpersVisible.value = !helpersVisible.value
  engine.setHelpersVisible(helpersVisible.value)
}

const fps = ref(0)
let last = performance.now()
let frames = 0
function measure(now: number): void {
  frames++
  if (now > last + 1000) {
    fps.value = frames
    frames = 0
    last = now
  }
  requestAnimationFrame(measure)
}
requestAnimationFrame(measure)
</script>

<template>
  <div class="debug-overlay pointer-events-auto">
    <button @click="togglePause">
      {{ paused ? 'Resume' : 'Pause' }}
    </button>
    <button @click="toggleHelpers">
      Helpers
    </button>
    <span>{{ fps }} FPS</span>
  </div>
</template>

<style scoped>
.debug-overlay {
  position: fixed;
  top: 0;
  left: 0;
  padding: 8px;
  color: white;
  z-index: 1000;
}

button {
  margin-right: 4px;
}
</style>
