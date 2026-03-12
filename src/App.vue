<template>
  <div id="app">
    <GlobalHeader />

    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入我们之前写好的导航栏组件
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<style scoped>
/* 给下面的内容留点边距，稍微美化一下 */
.main-content {
  padding: 20px;
}
</style>
