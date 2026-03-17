<template>
  <div id="userRegisterPage" class="register-page">
    <div class="register-card">
      <h1 class="card-title">星图集 · 注册</h1>
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
        <a-form-item
          name="checkPassword"
          :rules="[
            { required: true, message: '请输入确认密码' },
            { min: 8, message: '确认密码长度不能小于 8 位' },
          ]"
        >
          <a-input-password v-model:value="formState.checkPassword" placeholder="请输入确认密码" size="large" />
        </a-form-item>
        <div class="tips">
          已有账号？
          <RouterLink to="/user/login" class="link">去登录</RouterLink>
        </div>
        <a-form-item>
          <button type="submit" class="memphis-btn submit-btn">注册</button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { userRegisterUsingPost } from '@/api/userController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
import router from '@/router'

const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

const handleSubmit = async (values: API.UserRegisterRequest & { checkPassword?: string }) => {
  if (values.userPassword !== values.checkPassword) {
    message.error('两次输入的密码不一致')
    return
  }
  const res = await userRegisterUsingPost({
    userAccount: values.userAccount,
    userPassword: values.userPassword,
    checkPassword: values.checkPassword,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('注册成功')
    router.push({ path: '/user/login', replace: true })
  } else {
    message.error('注册失败，' + res.data.message)
  }
}
</script>

<style scoped>
.register-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.register-card {
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
