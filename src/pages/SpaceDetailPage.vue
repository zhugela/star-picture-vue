<template>
  <div id="spaceDetailPage">
    <a-flex justify="space-between" align="center" wrap="wrap" gap="middle">
      <h2 style="margin: 0">{{ space.spaceName || '空间' }}（私有空间）</h2>
      <a-space size="middle">
        <a-button type="primary" :href="`/add_picture?spaceId=${spaceId}`" target="_blank">
          + 创建图片
        </a-button>
        <a-button :icon="h(EditOutlined)" @click="doBatchEdit">批量编辑</a-button>
        <a-tooltip :title="`占用空间 ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`">
          <a-progress type="circle" :size="42" :percent="usagePercent" />
        </a-tooltip>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px" />
    <PictureSearchForm :on-search="onSearch" />
    <div style="margin-bottom: 16px" />
    <a-form layout="inline">
      <a-form-item label="按颜色搜索">
        <color-picker format="hex" @pure-color-change="onColorChange" />
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px" />
    <PictureList
      :data-list="dataList"
      :loading="loading"
      :show-op="true"
      :on-reload="fetchData"
    />
    <a-pagination
      v-model:current="searchParams.current"
      v-model:page-size="searchParams.pageSize"
      style="text-align: right; margin-top: 16px"
      :total="total"
      show-size-changer
      @change="onPageChange"
    />
    <BatchEditPictureModal
      ref="batchEditPictureModalRef"
      :space-id="spaceId"
      :picture-list="dataList"
      :on-success="onBatchEditPictureSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined } from '@ant-design/icons-vue'
import { getSpaceVoByIdUsingGet } from '@/api/spaceController.ts'
import {
  listPictureVoByPageUsingPost,
  searchPictureByColorUsingPost,
} from '@/api/pictureController.ts'
import { formatSize } from '@/utils'
import PictureList from '@/components/PictureList.vue'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import BatchEditPictureModal from '@/components/BatchEditPictureModal.vue'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'

interface Props {
  id: string | number
}

const props = defineProps<Props>()

const spaceId = computed(() => String(props.id))

const space = ref<API.SpaceVO>({})

const usagePercent = computed(() => {
  const t = space.value.totalSize ?? 0
  const m = space.value.maxSize ?? 0
  if (!m) return 0
  return Math.min(100, Number(((t * 100) / m).toFixed(1)))
})

const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: spaceId.value,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败，' + res.data.message)
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    message.error('获取空间详情失败：' + msg)
  }
}

const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(true)

const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const fetchData = async () => {
  loading.value = true
  try {
    const params: API.PictureQueryRequest = {
      spaceId: spaceId.value,
      ...searchParams,
    }
    const res = await listPictureVoByPageUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data.records ?? []
      total.value = res.data.data.total ?? 0
    } else {
      message.error('获取数据失败，' + res.data.message)
      dataList.value = []
      total.value = 0
    }
  } finally {
    loading.value = false
  }
}

const onPageChange = () => {
  fetchData()
}

const onSearch = (newSearchParams: API.PictureQueryRequest) => {
  Object.assign(searchParams, newSearchParams, { current: 1 })
  fetchData()
}

const onColorChange = async (color: string) => {
  loading.value = true
  try {
    const res = await searchPictureByColorUsingPost({
      picColor: color,
      spaceId: spaceId.value,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data ?? []
      dataList.value = data
      total.value = data.length
    } else {
      message.error('获取数据失败，' + res.data.message)
    }
  } finally {
    loading.value = false
  }
}

const batchEditPictureModalRef = ref<InstanceType<typeof BatchEditPictureModal> | null>(null)

const onBatchEditPictureSuccess = () => {
  fetchData()
}

const doBatchEdit = () => {
  batchEditPictureModalRef.value?.openModal()
}

const bootstrap = async () => {
  await fetchSpaceDetail()
  await fetchData()
}

onMounted(() => {
  void bootstrap()
})

watch(
  () => props.id,
  () => {
    void bootstrap()
  },
)
</script>

<style scoped>
#spaceDetailPage {
  margin-bottom: 16px;
}
</style>
