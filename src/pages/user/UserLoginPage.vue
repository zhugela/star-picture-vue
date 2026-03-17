<template>
  <div id="userLoginPage" class="login-page">
    <div class="login-card">
      <h1 class="card-title">星图集 · 登录</h1>
      <p class="card-desc">爱豆写真云，一起追光</p>
      <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit" class="memphis-form">
        <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
          <a-input v-model:value="formState.userAccount" placeholder="请输入账号" size="large" />
        </a-form-item>
        <a-form-item
          name="userPassword"
          :rules="[
            { required: true, message: '请输入密码' },
            { min: 8, message: '密码长度不能小于 8 位' },
          ]"
        >
          <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" size="large" />
        </a-form-item>
        <div class="tips">
          没有账号？
          <RouterLink to="/user/register" class="link">去注册</RouterLink>
        </div>
        <a-form-item>
          <button type="submit" class="memphis-btn submit-btn">登录</button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { userLoginUsingPost } from '@/api/userController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
import router from '@/router'

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

const loginUserStore = useLoginUserStore()

const handleSubmit = async (values: API.UserLoginRequest) => {
  const res = await userLoginUsingPost(values)
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser()
    message.success('登录成功')
    router.push({ path: '/', replace: true })
  } else {
    message.error('登录失败，' + res.data.message)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: var(--space-5);
  border: var(--border-soft);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-soft-lg);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
}

.card-title {
  font-size: 1.5rem;
  font-weight: var(--font-title);
  letter-spacing: var(--letter-relaxed);
  text-align: center;
  margin: 0 0 var(--space-2);
  color: var(--color-ink);
}

.card-desc {
  text-align: center;
  color: var(--color-ink);
  opacity: 0.75;
  margin: 0 0 var(--space-4);
  line-height: var(--line-body);
}

.tips {
  text-align: right;
  font-size: 0.875rem;
  margin-bottom: var(--space-3);
  color: var(--color-ink);
  opacity: 0.8;
}

.link {
  color: var(--color-lilac);
  font-weight: 600;
  text-decoration: none;
  margin-left: var(--space-1);
  transition: all var(--duration) var(--ease-smooth);
}
.link:hover {
  text-decoration: underline;
  color: var(--color-sakura);
}

.memphis-form :deep(.ant-input),
.memphis-form :deep(.ant-input-password input) {
  border: var(--border-soft);
  border-radius: var(--radius-btn);
  transition: all var(--duration) var(--ease-smooth);
}
.memphis-form :deep(.ant-input:hover),
.memphis-form :deep(.ant-input-password input:hover) {
  box-shadow: var(--shadow-soft);
}

.submit-btn {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: 1rem;
  font-weight: 700;
  border: 1px solid var(--color-sakura-border);
  border-radius: var(--radius-btn);
  background: var(--gradient-primary);
  color: #fff;
  cursor: pointer;
  box-shadow: var(--glow-sakura);
  transition: all var(--duration) var(--ease-smooth);
}
.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow-sakura), var(--shadow-soft);
}
.submit-btn:active {
  transform: translateY(1px);
}
</style>
