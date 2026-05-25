<template>
  <a-modal
    v-model:open="visible"
    title="批量编辑图片"
    :confirm-loading="submitting"
    ok-text="提交"
    cancel-text="取消"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form layout="vertical">
      <a-form-item label="分类">
        <a-input v-model:value="form.category" placeholder="留空则不修改" allow-clear />
      </a-form-item>
      <a-form-item label="标签">
        <a-select
          v-model:value="form.tags"
          mode="tags"
          placeholder="留空则不修改"
          style="width: 100%"
          allow-clear
        />
      </a-form-item>
      <a-typography-text type="secondary">
        将应用于当前空间列表中的 {{ pictureList.length }} 张图片
      </a-typography-text>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { editPictureByBatchUsingPost } from '@/api/pictureController.ts'
import { toIdString } from '@/utils/id'

interface Props {
  spaceId?: string
  pictureList?: API.PictureVO[]
  onSuccess?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  pictureList: () => [],
})

const visible = ref(false)
const submitting = ref(false)

const form = reactive<API.PictureEditByBatchRequest>({
  category: undefined,
  tags: undefined,
})

const openModal = () => {
  form.category = undefined
  form.tags = undefined
  visible.value = true
}

const handleClose = () => {
  visible.value = false
}

const handleSubmit = async () => {
  if (!props.spaceId) {
    message.error('空间 id 无效')
    return
  }
  if (!form.category && (!form.tags || form.tags.length === 0)) {
    message.warning('请至少填写分类或标签')
    return
  }
  submitting.value = true
  try {
    const res = await editPictureByBatchUsingPost({
      spaceId: toIdString(props.spaceId),
      category: form.category || undefined,
      tags: form.tags?.length ? form.tags : undefined,
    })
    if (res.data.code === 0) {
      message.success('批量编辑成功')
      visible.value = false
      props.onSuccess?.()
    } else {
      message.error('批量编辑失败，' + res.data.message)
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    message.error('批量编辑失败：' + msg)
  } finally {
    submitting.value = false
  }
}

defineExpose({
  openModal,
})
</script>
