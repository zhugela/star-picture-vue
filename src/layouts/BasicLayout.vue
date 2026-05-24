<template>
  <div id="basicLayout" class="basic-layout">
    <a-layout class="layout-root">
      <a-layout-header class="site-header">
        <GlobalHeader />
      </a-layout-header>

      <a-layout-content class="site-content">
        <div class="content-inner">
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<style scoped>
.basic-layout {
  min-height: 100vh;
  background: #f5f7fa;
  overflow-x: clip;
}

.layout-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f7fa;
}

.site-header {
  height: 64px;
  line-height: 64px;
  padding: 0;
  margin: 0;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
}

.site-content {
  flex: 1;
  min-width: 0;
  padding: 24px;
  background: #f5f7fa;
}

.content-inner {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>
