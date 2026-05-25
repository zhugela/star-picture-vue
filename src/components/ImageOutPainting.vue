<template>
  <a-modal
    class="image-out-painting"
    v-model:open="visible"
    title="AI 扩图"
    :footer="false"
    width="900px"
    @cancel="closeModal"
  >
    <a-row :gutter="16">
      <a-col :span="12">
        <h4>原始图片</h4>
        <img :src="picture?.url" :alt="picture?.name" style="max-width: 100%" />
      </a-col>
      <a-col :span="12">
        <h4>扩图结果</h4>
        <img
          v-if="resultImageUrl"
          :src="resultImageUrl"
          :alt="picture?.name"
          style="max-width: 100%"
        />
        <a-empty v-else description="点击生成图片后在此预览" />
      </a-col>
    </a-row>
    <div style="margin-bottom: 16px" />
    <a-flex justify="center" gap="16">
      <a-button type="primary" :loading="!!taskId" ghost @click="createTask">生成图片</a-button>
      <a-button v-if="resultImageUrl" type="primary" :loading="uploadLoading" @click="handleUpload">
        应用结果
      </a-button>
    </a-flex>
  </a-modal>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue'
import {
  createPictureOutPaintingTaskUsingPost,
  getPictureOutPaintingTaskUsingGet,
  uploadPictureUrlUsingPost,
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { toIdString } from '@/utils/id'

interface Props {
  picture?: API.PictureVO
  spaceId?: string
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

const resultImageUrl = ref('')
const taskId = ref<string>()
let pollingTimer: ReturnType<typeof setInterval> | null = null

const createTask = async () => {
  if (!props.picture?.id) {
    message.warning('请先上传图片')
    return
  }
  resultImageUrl.value = ''
  try {
    const res = await createPictureOutPaintingTaskUsingPost({
      pictureId: toIdString(props.picture.id),
      parameters: {
        xScale: 2,
        yScale: 2,
      },
    })
    if (res.data.code === 0 && res.data.data?.output?.taskId) {
      message.success('创建任务成功，请耐心等待，不要关闭弹窗')
      taskId.value = res.data.data.output.taskId
      startPolling()
    } else {
      message.error('创建扩图任务失败，' + (res.data.message ?? res.data.data?.output?.message ?? ''))
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    message.error('创建扩图任务失败：' + msg)
  }
}

const stopPollingTimer = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

const startPolling = () => {
  const currentTaskId = taskId.value
  if (!currentTaskId) return
  // 只清定时器，不能清 taskId，否则轮询请求会缺 taskId 导致 400
  stopPollingTimer()
  pollingTimer = setInterval(async () => {
    try {
      const res = await getPictureOutPaintingTaskUsingGet({
        taskId: currentTaskId,
      })
      if (res.data.code === 0 && res.data.data?.output) {
        const taskResult = res.data.data.output
        if (taskResult.taskStatus === 'SUCCEEDED') {
          message.success('扩图任务执行成功')
          resultImageUrl.value = taskResult.outputImageUrl ?? ''
          finishPolling()
        } else if (taskResult.taskStatus === 'FAILED') {
          message.error('扩图任务执行失败：' + (taskResult.message ?? ''))
          finishPolling()
        }
      }
    } catch (error: unknown) {
      console.error('扩图任务轮询失败', error)
      const msg = error instanceof Error ? error.message : String(error)
      message.error('扩图任务轮询失败：' + msg)
      finishPolling()
    }
  }, 3000)
}

/** 任务结束：停轮询并允许再次点击「生成」 */
const finishPolling = () => {
  stopPollingTimer()
  taskId.value = undefined
}

/** 关闭弹窗等场景：停轮询并清空任务 */
const clearPolling = () => {
  stopPollingTimer()
  taskId.value = undefined
}

onBeforeUnmount(() => {
  clearPolling()
})

const uploadLoading = ref(false)

const handleUpload = async () => {
  if (!resultImageUrl.value) {
    message.warning('请先生成扩图结果')
    return
  }
  uploadLoading.value = true
  try {
    const params: API.PictureUploadRequest = {
      fileUrl: resultImageUrl.value,
    }
    if (props.picture?.id) {
      params.id = toIdString(props.picture.id)
    }
    if (props.spaceId) {
      params.spaceId = props.spaceId
    }
    const res = await uploadPictureUrlUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      message.success('图片应用成功')
      props.onSuccess?.(res.data.data)
      closeModal()
    } else {
      message.error('图片应用失败，' + res.data.message)
    }
  } catch (error: unknown) {
    console.error('图片应用失败', error)
    const msg = error instanceof Error ? error.message : String(error)
    message.error('图片应用失败：' + msg)
  } finally {
    uploadLoading.value = false
  }
}

const visible = ref(false)

const openModal = () => {
  if (!props.picture?.id) {
    message.warning('请先上传图片')
    return
  }
  resultImageUrl.value = ''
  clearPolling()
  visible.value = true
}

const closeModal = () => {
  clearPolling()
  visible.value = false
}

defineExpose({
  openModal,
})
</script>

<style>
.image-out-painting {
  text-align: center;
}
</style>
