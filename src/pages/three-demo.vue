<script setup lang="ts">
import DebugOverlay from '~/dev/DebugOverlay.vue'

const showDebug = import.meta.env.DEV
</script>

<template>
  <ThreeCanvas background="#0e0e12" :show-helpers="true" />
  <DebugOverlay v-if="showDebug" />
</template>
