<template>
  <div id="spaceManagePage">
    <a-flex justify="space-between">
      <h2>空间管理</h2>
      <a-space>
        <a-button type="primary" href="/add_space" target="_blank">+ 创建空间</a-button>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px" />
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="空间名称" name="spaceName">
        <a-input v-model:value="searchParams.spaceName" placeholder="请输入空间名称" allow-clear />
      </a-form-item>
      <a-form-item name="spaceLevel" label="空间级别">
        <a-select
          v-model:value="searchParams.spaceLevel"
          style="min-width: 180px"
          placeholder="请选择空间级别"
          :options="SPACE_LEVEL_OPTIONS"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="用户 id" name="userId">
        <a-input-number
          v-model:value="searchParams.userId"
          placeholder="请输入用户 id"
          style="min-width: 160px"
          :min="1"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px" />
    <a-table
      row-key="id"
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'spaceLevel'">
          <div>
            {{
              record.spaceLevel != null ? SPACE_LEVEL_MAP[record.spaceLevel] ?? record.spaceLevel : '-'
            }}
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'spaceUseInfo'">
          <div>大小：{{ formatSize(record.totalSize) }} / {{ formatSize(record.maxSize) }}</div>
          <div>数量：{{ record.totalCount ?? '-' }} / {{ record.maxCount ?? '-' }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button type="link" :href="`/add_space?id=${record.id}`" target="_blank">编辑</a-button>
            <a-button type="link" danger @click="doDelete(String(record.id))">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import type { TableProps } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { deleteSpaceUsingPost, listSpaceByPageUsingPost } from '@/api/spaceController.ts'
import { SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS } from '@/constants/space.ts'
import { formatSize } from '@/utils'

const columns = [
  { title: 'id', dataIndex: 'id', width: 80 },
  { title: '空间名称', dataIndex: 'spaceName' },
  { title: '空间级别', dataIndex: 'spaceLevel' },
  { title: '使用情况', dataIndex: 'spaceUseInfo' },
  { title: '用户 id', dataIndex: 'userId', width: 80 },
  { title: '创建时间', dataIndex: 'createTime' },
  { title: '编辑时间', dataIndex: 'editTime' },
  { title: '操作', key: 'action' },
]

const dataList = ref<API.Space[]>([])
const total = ref(0)

const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const fetchData = async () => {
  const res = await listSpaceByPageUsingPost({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

onMounted(() => {
  fetchData()
})

const pagination = computed(() => ({
  current: searchParams.current ?? 1,
  pageSize: searchParams.pageSize ?? 10,
  total: total.value,
  showSizeChanger: true,
  showTotal: (n: number) => `共 ${n} 条`,
}))

const doTableChange: TableProps['onChange'] = (pag) => {
  searchParams.current = pag?.current ?? 1
  searchParams.pageSize = pag?.pageSize ?? 10
  fetchData()
}

const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

const doDelete = async (id?: string) => {
  if (id == null || id === '') {
    message.error('id 为空')
    return
  }
  const res = await deleteSpaceUsingPost({ spaceId: String(id) })
  if (res.data.code === 0) {
    message.success('删除成功')
    fetchData()
  } else {
    message.error('删除失败，' + (res.data.message ?? ''))
  }
}
</script>

<style scoped>
#spaceManagePage {
  padding: 16px;
}
</style>
