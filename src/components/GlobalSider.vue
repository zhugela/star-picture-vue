<template>
  <a-layout-sider
    v-if="loginUserStore.loginUser.id"
    id="globalSider"
    class="site-sider-inner"
    width="180"
    breakpoint="lg"
    :collapsed-width="0"
  >
    <a-menu
      v-model:selected-keys="current"
      mode="inline"
      :items="menuItems"
      class="sider-menu"
      @click="doMenuClick"
    />
  </a-layout-sider>
</template>

<script lang="ts" setup>
import { h, onMounted, ref } from 'vue'
import { PictureOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const loginUserStore = useLoginUserStore()
const router = useRouter()

const menuItems = [
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共图库',
  },
  {
    key: '/my_space',
    label: '我的空间',
    icon: () => h(UserOutlined),
  },
]

const current = ref<string[]>([])

const syncMenu = (path: string) => {
  const keys = menuItems.map((i) => String(i.key))
  current.value = keys.includes(path) ? [path] : ['/']
}

onMounted(() => {
  syncMenu(router.currentRoute.value.path)
})

router.afterEach((to) => {
  syncMenu(to.path)
})

const doMenuClick = (info: { key: string | number }) => {
  router.push({ path: String(info.key) })
}
</script>

<style scoped>
.site-sider-inner {
  background: #fff !important;
  border-right: 1px solid #e8e8e8;
}

.site-sider-inner :deep(.ant-layout-sider-children) {
  padding-top: 16px;
}

.sider-menu {
  border-inline-end: none !important;
  background: transparent !important;
}

.sider-menu :deep(.ant-menu-item) {
  margin: 4px 8px !important;
  width: calc(100% - 16px) !important;
  border-radius: 8px !important;
  height: 40px !important;
  line-height: 40px !important;
}

.sider-menu :deep(.ant-menu-item-selected) {
  background: rgba(22, 119, 255, 0.08) !important;
  color: #1677ff !important;
}

.sider-menu :deep(.ant-menu-item-selected::after) {
  display: none;
}

.sider-menu :deep(.ant-menu-item:hover) {
  color: #1677ff !important;
}
</style>
