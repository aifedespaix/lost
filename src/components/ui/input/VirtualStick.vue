<script setup lang="ts">
/**
 * Virtual thumb stick providing analog movement on touch devices.
 *
 * The component emits normalized `x` and `y` values in the range `[-1, 1]`
 * whenever the stick is dragged. Values are reset to zero when the touch
 * ends.
 */
const emit = defineEmits<{
  (e: 'move', x: number, y: number): void
}>()

const radius = 50
const position = ref({ x: 0, y: 0 })
let startX = 0
let startY = 0
let active = false

function handleStart(event: TouchEvent): void {
  const touch = event.touches[0]
  startX = touch.clientX
  startY = touch.clientY
  active = true
  event.preventDefault()
}

function handleMove(event: TouchEvent): void {
  if (!active)
    return
  const touch = event.touches[0]
  const dx = touch.clientX - startX
  const dy = touch.clientY - startY
  const distance = Math.min(Math.hypot(dx, dy), radius)
  const angle = Math.atan2(dy, dx)
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance
  position.value = { x, y }
  emit('move', x / radius, y / radius)
  event.preventDefault()
}

function handleEnd(): void {
  if (!active)
    return
  active = false
  position.value = { x: 0, y: 0 }
  emit('move', 0, 0)
}

const thumbStyle = computed(() => ({
  transform: `translate(calc(-50% + ${position.value.x}px), calc(-50% + ${position.value.y}px))`,
}))
</script>

<template>
  <div
    class="virtual-stick pointer-events-auto"
    @touchstart.prevent="handleStart"
    @touchmove.prevent="handleMove"
    @touchend.prevent="handleEnd"
    @touchcancel.prevent="handleEnd"
  >
    <div class="thumb" :style="thumbStyle" />
  </div>
</template>

<style scoped>
.virtual-stick {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.05);
  touch-action: none;
}

.thumb {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: transform 0.05s linear;
}
</style>
