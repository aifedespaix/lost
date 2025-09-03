<script setup lang="ts">
/**
 * Minimal dual-axis reticle rendered at the center of the screen.
 *
 * Purely decorative; it does not react to input or emit events.
 */
</script>

<template>
  <div class="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
    <!-- vertical arms -->
    <span class="absolute top-0 left-1/2 h-2 w-px -translate-x-1/2 bg-white/40" />
    <span class="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-white/40" />
    <!-- horizontal arms -->
    <span class="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-white/40" />
    <span class="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-white/40" />
  </div>
</template>
