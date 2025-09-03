<script setup lang="ts">
import { GameEngine } from '~/3d/engine/GameEngine'

const props = defineProps<{
  antialias?: boolean
  background?: string | number
  showHelpers?: boolean
}>()
const canvasEl = ref<HTMLCanvasElement | null>(null)
let engine: GameEngine | undefined

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
})

onBeforeUnmount(() => {
  engine?.dispose()
})
</script>

<template>
  <canvas ref="canvasEl" class="three-canvas" />
</template>

<style src="~/styles/three.css"></style>
