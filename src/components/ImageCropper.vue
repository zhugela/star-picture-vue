<template>
  <a-modal
    class="image-cropper"
    v-model:open="visible"
    title="编辑图片"
    :footer="false"
    width="800px"
    destroy-on-close
    @cancel="closeModal"
  >
    <a-spin :spinning="imageLoading" tip="图片加载中...">
      <vue-cropper
        v-if="visible && cropperImg"
        :key="cropperImg"
        ref="cropperRef"
        :img="cropperImg"
        output-type="png"
        :info="true"
        :can-move-box="true"
        :fixed-box="false"
        :auto-crop="true"
        :center-box="true"
        @img-load="onImgLoad"
        @img-load-error="onImgLoadError"
      />
      <a-empty
        v-else-if="visible && !imageLoading"
        description="图片加载失败，请确认后端已启动且返回 editUrl"
      />
    </a-spin>
    <div style="margin-bottom: 16px" />
    <div class="image-cropper-actions">
      <a-space wrap>
        <a-button @click="rotateLeft">向左旋转</a-button>
        <a-button @click="rotateRight">向右旋转</a-button>
        <a-button @click="changeScale(1)">放大</a-button>
        <a-button @click="changeScale(-1)">缩小</a-button>
        <a-button type="primary" :loading="loading" @click="handleConfirm">确认</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { uploadPictureUsingPost } from '@/api/fileController.ts'
import request from '@/request'
import { resolvePictureEditorRawUrl } from '@/utils/picture'

interface Props {
  imageUrl?: string
  picture?: API.PictureVO
  spaceId?: string
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

const cropperRef = ref<{
  changeScale: (num: number) => void
  rotateLeft: () => void
  rotateRight: () => void
  getCropBlob: (cb: (blob: Blob) => void) => void
}>()

/** 传给 vue-cropper 的 blob/data 地址（避免 COS 跨域 + 携带登录 cookie） */
const cropperImg = ref<string>()
const imageLoading = ref(false)
let objectUrlToRevoke: string | undefined

const revokeObjectUrl = () => {
  if (objectUrlToRevoke) {
    URL.revokeObjectURL(objectUrlToRevoke)
    objectUrlToRevoke = undefined
  }
}

const loadCropperImage = async (): Promise<boolean> => {
  const raw = resolvePictureEditorRawUrl(props.picture) || props.imageUrl
  if (!raw) {
    cropperImg.value = undefined
    return false
  }
  revokeObjectUrl()
  imageLoading.value = true
  try {
    const res = await request.get('/api/picture/proxy/editor', {
      params: { url: raw },
      responseType: 'blob',
    })
    objectUrlToRevoke = URL.createObjectURL(res.data)
    cropperImg.value = objectUrlToRevoke
    return true
  } catch (error: unknown) {
    console.error('代理加载编辑图片失败', error)
    const msg = error instanceof Error ? error.message : String(error)
    message.error('图片加载失败：' + msg)
    cropperImg.value = undefined
    return false
  }
}

const onImgLoad = () => {
  imageLoading.value = false
}

const onImgLoadError = () => {
  imageLoading.value = false
  message.error('图片加载失败，请检查 COS CORS 或后端 /api/picture/proxy/editor')
}

const changeScale = (num: number) => {
  cropperRef.value?.changeScale(num)
}

const rotateLeft = () => {
  cropperRef.value?.rotateLeft()
}

const rotateRight = () => {
  cropperRef.value?.rotateRight()
}

const loading = ref(false)

const handleConfirm = () => {
  if (!cropperRef.value) {
    message.warning('裁切器未就绪')
    return
  }
  cropperRef.value.getCropBlob((blob: Blob) => {
    const fileName = (props.picture?.name || 'image') + '.png'
    const file = new File([blob], fileName, { type: blob.type || 'image/png' })
    void handleUpload({ file })
  })
}

const handleUpload = async ({ file }: { file: File }) => {
  loading.value = true
  try {
    const params: API.UploadPictureUsingPOSTParams = props.picture?.id ? { id: props.picture.id } : {}
    if (props.spaceId) {
      params.spaceId = props.spaceId
    }
    const res = await uploadPictureUsingPost(params, {}, file)
    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功')
      props.onSuccess?.(res.data.data)
      closeModal()
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (error: unknown) {
    console.error('图片上传失败', error)
    const msg = error instanceof Error ? error.message : String(error)
    message.error('图片上传失败，' + msg)
  } finally {
    loading.value = false
  }
}

const visible = ref(false)

const openModal = async () => {
  visible.value = true
  const ok = await loadCropperImage()
  if (!ok) {
    visible.value = false
    if (!resolvePictureEditorRawUrl(props.picture) && !props.imageUrl) {
      message.warning('无可用的图片地址，请确认 get/vo 返回了 editUrl 或 url')
    }
  }
}

const closeModal = () => {
  visible.value = false
  cropperImg.value = undefined
  imageLoading.value = false
  revokeObjectUrl()
}

defineExpose({
  openModal,
})
</script>

<style>
.image-cropper {
  text-align: center;
}

.image-cropper .vue-cropper {
  height: 400px !important;
}

.image-cropper-actions {
  text-align: center;
}
</style>
