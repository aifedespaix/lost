<script setup lang="ts">
/**
 * Centered minimal crosshair reticle for the heads-up display.
 *
 * Purely visual; emits no events and captures no input.
 */
</script>

<template>
  <div class="crosshair">
    <div class="line horizontal" />
    <div class="line vertical" />
  </div>
</template>

<style scoped>
.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.line {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
}

.horizontal {
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  transform: translateY(-50%);
}

.vertical {
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  transform: translateX(-50%);
}
</style>

