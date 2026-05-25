<template>
  <div id="addSpacePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? '修改空间' : '创建空间' }}
    </h2>
    <a-form name="spaceForm" layout="vertical" :model="spaceForm" @finish="handleSubmit">
      <a-form-item name="spaceName" label="空间名称">
        <a-input v-model:value="spaceForm.spaceName" placeholder="请输入空间" allow-clear />
      </a-form-item>
      <a-form-item name="spaceLevel" label="空间级别">
        <a-select
          v-model:value="spaceForm.spaceLevel"
          style="min-width: 180px"
          placeholder="请选择空间级别"
          :options="SPACE_LEVEL_OPTIONS"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading" style="width: 100%">
          提交
        </a-button>
      </a-form-item>
    </a-form>
    <a-card title="空间级别介绍">
      <a-typography-paragraph>
        * 目前仅支持开通普通版，如需升级空间，请联系
        <a href="https://codefather.cn" target="_blank" rel="noopener noreferrer">程序员鱼皮</a>
      </a-typography-paragraph>
      <a-typography-paragraph v-for="(spaceLevel, index) in spaceLevelList" :key="spaceLevel.value ?? index">
        {{ spaceLevel.text }}：大小 {{ formatSize(spaceLevel.maxSize) }}，数量
        {{ spaceLevel.maxCount }}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  addSpaceUsingPost,
  getSpaceVoByIdUsingGet,
  listSpaceLevelUsingGet,
  updateSpaceUsingPost,
} from '@/api/spaceController.ts'
import { useRoute, useRouter } from 'vue-router'
import { SPACE_LEVEL_OPTIONS } from '@/constants/space.ts'
import { formatSize } from '@/utils'
import { queryId, toIdString } from '@/utils/id'

const route = useRoute()
const router = useRouter()

const space = ref<API.SpaceVO>()
const spaceForm = reactive<API.SpaceAddRequest & API.SpaceUpdateRequest>({})
const loading = ref(false)
const spaceLevelList = ref<API.SpaceLevel[]>([])

const fetchSpaceLevelList = async () => {
  const res = await listSpaceLevelUsingGet()
  if (res.data.code === 0 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else {
    message.error('获取空间级别失败，' + res.data.message)
  }
}

const getOldSpace = async () => {
  const id = queryId(route.query as Record<string, unknown>, 'id')
  if (id) {
    const res = await getSpaceVoByIdUsingGet({
      id,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      space.value = data
      spaceForm.spaceName = data.spaceName
      spaceForm.spaceLevel = data.spaceLevel
    }
  }
}

onMounted(async () => {
  await fetchSpaceLevelList()
  await getOldSpace()
})

const handleSubmit = async () => {
  const spaceId = space.value?.id
  loading.value = true
  try {
    if (spaceId != null) {
      const res = await updateSpaceUsingPost({
        id: spaceId,
        spaceName: spaceForm.spaceName,
        spaceLevel: spaceForm.spaceLevel,
      })
      if (res.data.code === 0) {
        message.success('操作成功')
        router.push({ path: `/space/${spaceId}` })
      } else {
        message.error('操作失败，' + res.data.message)
      }
    } else {
      const res = await addSpaceUsingPost({
        spaceName: spaceForm.spaceName,
        spaceLevel: spaceForm.spaceLevel,
      })
      if (res.data.code === 0 && res.data.data != null) {
        message.success('操作成功')
        router.push({ path: `/space/${toIdString(res.data.data)}` })
      } else {
        message.error('操作失败，' + res.data.message)
      }
    }
  } catch (e) {
    console.error(e)
    message.error('操作失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
#addSpacePage {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 16px 24px;
}
</style>
