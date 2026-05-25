<template>
  <div id="userProfilePage" class="profile-page">
    <section class="card profile-card">
      <h1 class="page-title">个人资料</h1>
      <p class="page-desc">更新你的昵称、头像和简介，保存后在顶部导航同步显示。</p>

      <div class="avatar-block">
        <a-upload
          name="file"
          :show-upload-list="false"
          :before-upload="beforeAvatarUpload"
          :custom-request="handleAvatarUpload"
          accept="image/*"
        >
          <div class="avatar-wrap">
            <a-avatar :src="form.userAvatar" :size="96" class="profile-avatar">
              {{ avatarFallback }}
            </a-avatar>
            <span class="avatar-mask">更换头像</span>
          </div>
        </a-upload>
        <div class="avatar-tip">支持 JPG / PNG，建议 200×200 以上</div>
      </div>

      <a-form layout="vertical" class="profile-form">
        <a-form-item label="昵称">
          <a-input v-model:value="form.userName" placeholder="请输入昵称" maxlength="20" show-count />
        </a-form-item>
        <a-form-item label="账号">
          <a-input :value="loginUserStore.loginUser.userAccount" disabled />
        </a-form-item>
        <a-form-item label="简介">
          <a-textarea
            v-model:value="form.userProfile"
            placeholder="写一句介绍吧"
            :rows="4"
            maxlength="200"
            show-count
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" :loading="saving" @click="handleSave">保存修改</a-button>
            <a-button @click="resetForm">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { updateMyProfileUsingPost } from '@/api/userController'
import { uploadAvatarUsingPost } from '@/api/fileController'

const loginUserStore = useLoginUserStore()
const saving = ref(false)

const form = reactive({
  userName: '',
  userAvatar: '',
  userProfile: '',
})

const avatarFallback = computed(() => {
  const name = form.userName || loginUserStore.loginUser.userName || '用'
  return name.charAt(0).toUpperCase()
})

const syncForm = () => {
  const u = loginUserStore.loginUser
  form.userName = u.userName ?? ''
  form.userAvatar = u.userAvatar ?? ''
  form.userProfile = u.userProfile ?? ''
}

onMounted(async () => {
  await loginUserStore.fetchLoginUser()
  syncForm()
})

const resetForm = () => syncForm()

const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片需小于 2MB')
  }
  return isImage && isLt2M
}

const handleAvatarUpload: UploadProps['customRequest'] = async (options) => {
  const file = options.file as File
  try {
    const res = await uploadAvatarUsingPost({}, file)
    const body = res.data as API.BaseResponseString_
    if (body.code === 0 && body.data) {
      form.userAvatar = body.data
      message.success('头像上传成功，记得点保存')
      options.onSuccess?.(body)
    } else {
      message.error(body.message || '头像上传失败')
      options.onError?.(new Error(body.message))
    }
  } catch (e) {
    message.error('头像上传失败')
    options.onError?.(e as Error)
  }
}

const handleSave = async () => {
  if (!form.userName?.trim()) {
    message.warning('昵称不能为空')
    return
  }
  saving.value = true
  try {
    const res = await updateMyProfileUsingPost({
      userName: form.userName.trim(),
      userAvatar: form.userAvatar,
      userProfile: form.userProfile,
    })
    if (res.data.code === 0) {
      message.success('保存成功')
      await loginUserStore.fetchLoginUser()
      syncForm()
    } else {
      message.error(res.data.message || '保存失败')
    }
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 640px;
  margin: 0 auto;
}

.profile-card {
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.page-title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
}

.page-desc {
  margin: 0 0 28px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.avatar-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
}

.avatar-wrap {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
}

.profile-avatar {
  background: linear-gradient(135deg, #1677ff, #69b1ff);
  color: #fff;
  font-size: 36px;
}

.avatar-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 13px;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-wrap:hover .avatar-mask {
  opacity: 1;
}

.avatar-tip {
  margin-top: 10px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.profile-form {
  margin-top: 8px;
}
</style>
