<template>
  <a-modal
    v-model:open="visible"
    title="分享图片"
    :footer="null"
    @cancel="handleClose"
  >
    <div class="share-content">
      <p>分享链接：</p>
      <a-input v-model:value="shareLink" readonly>
        <template #append>
          <a-button @click="handleCopy">复制</a-button>
        </template>
      </a-input>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'

interface Props {
  link?: string
}

const props = defineProps<Props>()

const visible = ref<boolean>(false)
const shareLink = ref<string>('')

watch(() => props.link, (newVal) => {
  if (newVal) {
    shareLink.value = newVal
  }
})

const openModal = () => {
  visible.value = true
}

const handleClose = () => {
  visible.value = false
}

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    message.success('复制成功')
  } catch {
    message.error('复制失败')
  }
}

defineExpose({
  openModal,
})
</script>

<style scoped>
.share-content {
  padding: 16px 0;
}
</style>
