<template>
  <div class="url-picture-upload">
    <a-input-group compact>
      <a-input
        v-model:value="fileUrl"
        style="width: calc(100% - 120px)"
        placeholder="请输入图片地址"
        allow-clear
      />
      <a-button type="primary" style="width: 120px" :loading="loading" @click="handleUpload">
        提交
      </a-button>
    </a-input-group>
    <div class="img-wrapper">
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { uploadPictureUrlUsingPost } from '@/api/pictureController.ts'

interface Props {
  picture?: API.PictureVO
  spaceId?: string
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

const fileUrl = ref<string>('')
const loading = ref<boolean>(false)

/**
 * 上传图片
 */
const handleUpload = async () => {
  const url = fileUrl.value?.trim()
  if (!url) {
    message.warning('请输入图片地址')
    return
  }
  loading.value = true
  try {
    const params: API.PictureUploadRequest = { fileUrl: url }
    if (props.picture?.id != null) {
      params.id = props.picture.id
    }
    if (props.spaceId) {
      params.spaceId = props.spaceId
    }
    const res = await uploadPictureUrlUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功')
      props.onSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (error) {
    console.error('图片上传失败', error)
    const msg = error instanceof Error ? error.message : String(error)
    message.error('图片上传失败，' + msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.url-picture-upload {
  margin-bottom: 16px;
}

.url-picture-upload img {
  max-width: 100%;
  max-height: 480px;
}

.url-picture-upload .img-wrapper {
  text-align: center;
  margin-top: 16px;
}
</style>
