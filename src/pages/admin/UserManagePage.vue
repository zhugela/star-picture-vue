<template>
  <div id="userManagePage" class="manage-page">
    <div class="manage-card">
      <h1 class="card-title">用户管理</h1>
      <a-form layout="inline" :model="searchParams" @finish="doSearch" class="search-form">
        <a-form-item label="账号">
          <a-input v-model:value="searchParams.userAccount" placeholder="输入账号" allow-clear />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-model:value="searchParams.userName" placeholder="输入用户名" allow-clear />
        </a-form-item>
        <a-form-item>
          <button type="submit" class="memphis-btn btn-search">搜索</button>
        </a-form-item>
      </a-form>
      <div class="table-wrap">
        <a-table
          :columns="columns"
          :data-source="dataList"
          :pagination="pagination"
          @change="doTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'userAvatar'">
              <a-image :src="record.userAvatar" :width="120" />
            </template>
            <template v-else-if="column.dataIndex === 'userRole'">
              <div v-if="record.userRole === 'admin'">
                <a-tag color="green">管理员</a-tag>
              </div>
              <div v-else>
                <a-tag color="blue">普通用户</a-tag>
              </div>
            </template>
            <template v-if="column.dataIndex === 'createTime'">
              {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template v-else-if="column.key === 'action'">
              <a-button danger @click="doDelete(record.id)">删除</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { deleteUserUsingPost, listUserVoByPageUsingPost } from '@/api/userController.ts'
import dayjs from 'dayjs'

const columns = [
  { title: 'id', dataIndex: 'id' },
  { title: '账号', dataIndex: 'userAccount' },
  { title: '用户名', dataIndex: 'userName' },
  { title: '头像', dataIndex: 'userAvatar' },
  { title: '简介', dataIndex: 'userProfile' },
  { title: '用户角色', dataIndex: 'userRole' },
  { title: '创建时间', dataIndex: 'createTime' },
  { title: '更新时间', dataIndex: 'updateTime' },
  { title: '操作', key: 'action' },
]

const doDelete = async (id: number) => {
  const res = await deleteUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    await fetchData()
  } else {
    message.error('删除失败')
  }
}

const dataList = ref<API.UserVO[]>([])
const total = ref(0)
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'ascend',
})

const fetchData = async () => {
  const res = await listUserVoByPageUsingPost({ ...searchParams })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

const doTableChange = (page: { current: number; pageSize: number }) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

const pagination = computed(() => ({
  current: searchParams.current,
  pageSize: searchParams.pageSize,
  total: total.value,
  showSizeChanger: true,
  showTotal: (t: number) => `共 ${t} 条`,
}))

onMounted(() => fetchData())
</script>

<style scoped>
.manage-page {
  padding: var(--space-4) 0;
}

.manage-card {
  padding: var(--space-4);
  border: var(--border-soft);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-soft);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
}

.card-title {
  font-size: 1.5rem;
  font-weight: var(--font-title);
  letter-spacing: var(--letter-relaxed);
  margin: 0 0 var(--space-4);
  color: var(--color-ink);
}

.search-form {
  margin-bottom: var(--space-4);
}

.search-form :deep(.ant-form-item) {
  margin-right: var(--space-2);
  margin-bottom: var(--space-2);
}

.search-form :deep(.ant-input) {
  border: var(--border-soft);
  border-radius: var(--radius-btn);
}

.btn-search {
  padding: var(--space-1) var(--space-3);
  font-weight: 700;
  border: 1px solid var(--color-sakura-border);
  border-radius: var(--radius-btn);
  background: var(--gradient-primary);
  color: #fff;
  cursor: pointer;
  box-shadow: var(--glow-sakura);
  transition: all var(--duration) var(--ease-smooth);
}
.btn-search:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow-sakura), var(--shadow-soft);
}
.btn-search:active {
  transform: translateY(1px);
}

.table-wrap :deep(.ant-table) {
  border: var(--border-soft);
  border-radius: var(--radius-card);
  overflow: hidden;
}
.table-wrap :deep(.ant-table-thead > tr > th) {
  border-bottom: var(--border-soft);
  font-weight: 700;
}
</style>
