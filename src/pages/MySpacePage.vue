<template>
  <div id="mySpacePage">
    <p>正在跳转，请稍后。。。</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { listSpaceVoByPageUsingPost } from '@/api/spaceController.ts'

const router = useRouter()
const loginUserStore = useLoginUserStore()

const checkUserSpace = async () => {
  const loginUser = loginUserStore.loginUser
  if (!loginUser?.id) {
    router.replace('/user/login')
    return
  }
  const res = await listSpaceVoByPageUsingPost({
    userId: loginUser.id,
    current: 1,
    pageSize: 1,
  })
  if (res.data.code === 0) {
    if (res.data.data?.records && res.data.data.records.length > 0) {
      const space = res.data.data.records[0]
      if (space && space.id != null) {
        router.replace(`/space/${String(space.id)}`)
      } else {
        router.replace('/add_space')
        message.warn('请先创建空间')
      }
    } else {
      router.replace('/add_space')
      message.warn('请先创建空间')
    }
  } else {
    message.error('加载我的空间失败，' + res.data.message)
  }
}

onMounted(() => {
  void checkUserSpace()
})
</script>
