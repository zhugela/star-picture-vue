<template>
  <header class="global-header">
    <div class="header-inner">
      <router-link to="/" class="brand">
        <span class="logo" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffd1dc" />
                <stop offset="100%" stop-color="#e0bbe4" />
              </linearGradient>
            </defs>
            <path
              d="M20 4l2.5 7.5L30 14l-7.5 2.5L20 24l-2.5-7.5L10 14l7.5-2.5L20 4z"
              fill="url(#logo-grad)"
            />
            <circle cx="28" cy="8" r="2" fill="#fff4bd" opacity="0.9" />
            <circle cx="12" cy="28" r="1.5" fill="#b2e2f2" opacity="0.9" />
          </svg>
        </span>
        <span class="brand-name">星图集</span>
      </router-link>

      <nav class="main-nav" aria-label="主导航">
        <router-link
          v-for="item in visibleMenuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <div class="user-area">
        <div v-if="loginUserStore.loginUser.id" class="user-logged">
          <a-dropdown :trigger="['click']">
            <button type="button" class="user-trigger">
              <a-avatar :src="avatarSrc" :size="32" class="header-avatar">
                {{ avatarFallback }}
              </a-avatar>
              <span class="user-name">{{ loginUserStore.loginUser.userName ?? '用户' }}</span>
            </button>
            <template #overlay>
              <a-menu class="dropdown-menu">
                <a-menu-item @click="goProfile">
                  <UserOutlined />
                  个人资料
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item @click="doLogout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <router-link v-else to="/user/login" class="btn-login">登录</router-link>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLogoutUsingPost } from '@/api/userController'
import { clearToken } from '@/utils/token'

const loginUserStore = useLoginUserStore()
const router = useRouter()
const route = useRoute()
const currentPath = ref(route.path)

watch(
  () => route.path,
  (path) => {
    currentPath.value = path
  },
)

const menuItems = [
  { path: '/', label: '公共图库' },
  { path: '/my_space', label: '我的空间', needLogin: true },
  { path: '/add_picture', label: '创建图片', needLogin: true },
  { path: '/admin/pictureManage', label: '图片管理', admin: true },
  { path: '/admin/spaceManage', label: '空间管理', admin: true },
  { path: '/about', label: '关于' },
]

const visibleMenuItems = computed(() => {
  const user = loginUserStore.loginUser
  return menuItems.filter((item) => {
    if (item.admin && user.userRole !== 'admin') return false
    if (item.needLogin && !user.id) return false
    return true
  })
})

const avatarSrc = computed(() => loginUserStore.loginUser.userAvatar || undefined)

const avatarFallback = computed(() => {
  const name = loginUserStore.loginUser.userName || '用'
  return name.charAt(0).toUpperCase()
})

function isActive(path: string) {
  if (path === '/') {
    return currentPath.value === '/'
  }
  return currentPath.value === path || currentPath.value.startsWith(path + '/')
}

const goProfile = () => {
  router.push('/user/profile')
}

const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    clearToken()
    loginUserStore.setLoginUser({ userName: '未登录' })
    message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    message.error('退出登录失败，' + res.data.message)
  }
}
</script>

<style scoped>
.global-header {
  height: 64px;
  background: #fff;
}

.header-inner {
  display: flex;
  align-items: center;
  max-width: 1200px;
  height: 64px;
  margin: 0 auto;
  padding: 0 24px;
  gap: 16px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 16px;
  line-height: 1;
}

.brand:hover {
  color: #1677ff;
}

.logo {
  display: flex;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.logo svg {
  width: 100%;
  height: 100%;
}

.brand-name {
  white-space: nowrap;
}

.main-nav {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 0;
  flex-wrap: wrap;
}

.nav-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 14px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  text-decoration: none;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
  white-space: nowrap;
}

.nav-item:hover {
  color: #1677ff;
  background: rgba(22, 119, 255, 0.06);
}

.nav-item.active {
  color: #1677ff;
  font-weight: 500;
  box-shadow: inset 0 -2px 0 #1677ff;
  border-radius: 6px 6px 0 0;
}

.user-area {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 10px;
  margin: 0;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font: inherit;
  color: rgba(0, 0, 0, 0.88);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.user-trigger:hover {
  border-color: #d9d9d9;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.header-avatar {
  background: linear-gradient(135deg, #1677ff, #69b1ff);
  color: #fff;
  font-size: 14px;
  flex-shrink: 0;
}

.user-name {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.btn-login {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  text-decoration: none;
  background: #1677ff;
  border-radius: 8px;
  border: none;
  transition: background 0.2s;
}

.btn-login:hover {
  color: #fff;
  background: #4096ff;
}

:deep(.dropdown-menu) {
  border-radius: 8px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
}

@media (max-width: 900px) {
  .header-inner {
    flex-wrap: wrap;
    height: auto;
    min-height: 64px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .main-nav {
    order: 3;
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
