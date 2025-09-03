<script setup lang="ts">
import { GameEngine } from '~/3d/engine/GameEngine'

const props = defineProps<{
  antialias?: boolean
  background?: string | number
  showHelpers?: boolean
}>()
const canvasEl = ref<HTMLCanvasElement | null>(null)
let engine: GameEngine | undefined
// Flag indicating when the Three.js engine is ready so child content can render.
const isReady = ref<boolean>(false)

onMounted(() => {
  if (!canvasEl.value)
    return
  engine = new GameEngine({
    canvas: canvasEl.value,
    width: canvasEl.value.clientWidth || window.innerWidth,
    height: canvasEl.value.clientHeight || window.innerHeight,
    antialias: props.antialias,
    background: props.background,
    showHelpers: props.showHelpers,
  })
  provideThreeEngine(engine)
  engine.start()
  isReady.value = true
})

onBeforeUnmount(() => {
  engine?.dispose()
})
</script>

<template>
  <div class="three-canvas-container">
    <canvas ref="canvasEl" class="three-canvas" />
    <slot v-if="isReady" />
  </div>
</template>

<style src="~/styles/three.css"></style>
