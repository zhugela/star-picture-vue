<template>
  <div id="app" class="app-root">
    <GlobalHeader />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--space-3);
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}
</style>
