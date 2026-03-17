<template>
  <header class="global-header">
    <div class="header-inner">
      <router-link to="/" class="title-bar">
        <span class="logo" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffd1dc" />
                <stop offset="100%" stop-color="#e0bbe4" />
              </linearGradient>
            </defs>
            <path d="M20 4l2.5 7.5L30 14l-7.5 2.5L20 24l-2.5-7.5L10 14l7.5-2.5L20 4z" fill="url(#logo-grad)"/>
            <circle cx="28" cy="8" r="2" fill="#fff4bd" opacity="0.9"/>
            <circle cx="12" cy="28" r="1.5" fill="#b2e2f2" opacity="0.9"/>
          </svg>
        </span>
        <span class="title">星图集</span>
      </router-link>

      <nav class="nav-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: current === item.path }"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <div class="user-area">
        <div v-if="loginUserStore.loginUser.id" class="user-logged">
          <a-dropdown :trigger="['click']">
            <div class="user-trigger">
              <a-avatar :src="loginUserStore.loginUser.userAvatar" :size="32" />
              <span class="user-name">{{ loginUserStore.loginUser.userName ?? '无名' }}</span>
            </div>
            <template #overlay>
              <a-menu class="dropdown-menu">
                <a-menu-item @click="doLogout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <a v-else href="/user/login" class="btn-login">登录</a>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { LogoutOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLogoutUsingPost } from '@/api/userController'

const loginUserStore = useLoginUserStore()
const router = useRouter()
const route = useRoute()
const current = ref(route.path)

watch(
  () => route.path,
  (path) => {
    current.value = path
  }
)

const menuItems = [
  { path: '/', label: '主页' },
  { path: '/about', label: '关于' },
]

const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
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
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: var(--glass-border);
  box-shadow: var(--shadow-soft);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-2) var(--space-3);
  gap: var(--space-3);
}

.title-bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  color: var(--color-ink);
  font-weight: var(--font-title);
  letter-spacing: var(--letter-relaxed);
  transition: all var(--duration) var(--ease-smooth);
}
.title-bar:hover {
  opacity: 0.88;
}

.logo {
  display: flex;
  align-items: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}
.logo svg {
  width: 100%;
  height: 100%;
}

.title {
  font-size: 1.125rem;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.nav-link {
  padding: var(--space-1) var(--space-2);
  color: var(--color-ink);
  text-decoration: none;
  font-weight: 600;
  border: var(--border-soft);
  background: var(--bg-card);
  border-radius: var(--radius-btn);
  transition: all var(--duration) var(--ease-smooth);
}
.nav-link:hover {
  background: var(--gradient-soft);
  box-shadow: var(--shadow-soft);
  transform: translateY(-2px);
}
.nav-link.active {
  background: var(--gradient-primary);
  color: #fff;
  border-color: var(--color-sakura-border);
  box-shadow: var(--glow-sakura);
}

.user-area {
  display: flex;
  align-items: center;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border: var(--border-soft);
  background: var(--bg-card);
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: all var(--duration) var(--ease-smooth);
}
.user-trigger:hover {
  box-shadow: var(--shadow-soft);
  transform: translateY(-2px);
}

.user-name {
  font-weight: 600;
  max-width: 96px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-login {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1) var(--space-3);
  background: var(--gradient-primary);
  color: #fff !important;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid var(--color-sakura-border);
  border-radius: var(--radius-btn);
  box-shadow: var(--glow-sakura);
  transition: all var(--duration) var(--ease-smooth);
}
.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow-sakura), var(--shadow-soft);
}

:deep(.dropdown-menu) {
  border: var(--border-soft);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-soft-lg);
  overflow: hidden;
}
</style>
