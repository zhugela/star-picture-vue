<template>
  <div id="app" class="app-root">
    <main class="app-main">
      <router-view />
    </main>
    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import GlobalFooter from '@/components/GlobalFooter.vue'
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
