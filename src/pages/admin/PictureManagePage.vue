<template>
  <div id="userManagePage">
    <a-flex justify="space-between">
      <h2>图片管理</h2>
      <a-space>
        <a-button type="primary" href="/add_picture" target="_blank">+ 创建图片</a-button>
        <a-button type="primary" href="/add_picture/batch" target="_blank" ghost>
          + 批量创建图片
        </a-button>
      </a-space>
    </a-flex>
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="关键词" name="searchText">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="从名称和简介搜索"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="类型" name="category">
        <a-input v-model:value="searchParams.category" placeholder="请输入类型" allow-clear />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="searchParams.tags"
          mode="tags"
          placeholder="请输入标签"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="审核状态" name="reviewStatus">
        <a-select
          v-model:value="searchParams.reviewStatus"
          :options="PIC_REVIEW_STATUS_OPTIONS"
          placeholder="请输入审核状态"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px" />
    <!-- 表格：横向滚动 + 紧凑行高，详情用 Popover -->
    <a-table
      row-key="id"
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      :scroll="{ x: 1320 }"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image
            :src="record.url"
            :width="56"
            :height="56"
            class="pic-thumb"
          />
        </template>
        <!-- 标签 -->
        <template v-else-if="column.dataIndex === 'tags'">
          <template v-for="parts in [tagParts(record)]" :key="String(record.id) + '-tags'">
            <a-space v-if="parts.shown.length" wrap size="small" class="tags-cell">
              <a-tag v-for="tag in parts.shown" :key="tag">{{ tag }}</a-tag>
              <span v-if="parts.more > 0" class="tags-more">+{{ parts.more }}</span>
            </a-space>
            <span v-else>—</span>
          </template>
        </template>
        <!-- 图片信息：一行摘要 + 悬浮详情 -->
        <template v-else-if="column.dataIndex === 'picInfo'">
          <a-popover placement="leftTop" overlay-class-name="picture-manage-popover">
            <template #content>
              <div class="popover-detail">
                <div>格式：{{ record.picFormat ?? '—' }}</div>
                <div>宽度：{{ record.picWidth ?? '—' }}</div>
                <div>高度：{{ record.picHeight ?? '—' }}</div>
                <div>宽高比：{{ record.picScale ?? '—' }}</div>
                <div>大小：{{ picSizeKb(record.picSize) }}</div>
              </div>
            </template>
            <span class="cell-ellipsis">{{ picInfoSummary(record) }}</span>
          </a-popover>
        </template>
        <!-- 审核信息：一行状态 + 悬浮详情 -->
        <template v-else-if="column.dataIndex === 'reviewMessage'">
          <a-popover placement="leftTop" overlay-class-name="picture-manage-popover">
            <template #content>
              <div class="popover-detail">
                <div>
                  审核状态：{{
                    record.reviewStatus != null ? PIC_REVIEW_STATUS_MAP[record.reviewStatus] : '—'
                  }}
                </div>
                <div>审核信息：{{ record.reviewMessage || '—' }}</div>
                <div>审核人：{{ record.reviewerId ?? '—' }}</div>
              </div>
            </template>
            <span class="cell-ellipsis">{{ reviewSummary(record) }}</span>
          </a-popover>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
              type="link"
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
            >
              通过
            </a-button>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
              type="link"
              danger
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
            >
              拒绝
            </a-button>
            <a-button type="link" :href="`/add_picture?id=${record.id}`" target="_blank"
              >编辑
            </a-button>
            <a-button type="link" danger @click="doDelete(String(record.id))">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import type { TableProps } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  deletePictureUsingPost,
  doPictureReviewUsingPost,
  listPictureByPageUsingPost,
} from '@/api/pictureController.ts'
import {
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_OPTIONS,
} from '@/constants/picture.ts'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 112,
    ellipsis: true,
  },
  {
    title: '图片',
    dataIndex: 'url',
    width: 72,
    align: 'center' as const,
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 140,
    ellipsis: true,
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    width: 160,
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'category',
    width: 100,
    ellipsis: true,
  },
  {
    title: '标签',
    dataIndex: 'tags',
    width: 168,
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
    width: 200,
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 112,
    ellipsis: true,
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 158,
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
    width: 158,
  },
  {
    title: '操作',
    key: 'action',
    width: 220,
    fixed: 'right' as const,
  },
]

function parseTags(tags: string | undefined): string[] {
  if (!tags) return []
  try {
    const parsed = JSON.parse(tags) as unknown
    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return []
  }
}

function tagParts(record: API.PictureVO) {
  const tags = parseTags(record.tags)
  return { shown: tags.slice(0, 4), more: tags.length > 4 ? tags.length - 4 : 0 }
}

function picSizeKb(size: number | undefined): string {
  if (size == null || Number.isNaN(size)) return '—'
  return `${(size / 1024).toFixed(2)} KB`
}

function picInfoSummary(record: API.PictureVO): string {
  const fmt = record.picFormat ?? ''
  const w = record.picWidth ?? '—'
  const h = record.picHeight ?? '—'
  const kb = record.picSize != null ? `${(record.picSize / 1024).toFixed(1)}KB` : '—'
  const s = `${fmt} ${w}×${h} ${kb}`.trim()
  return s || '—'
}

function reviewSummary(record: API.PictureVO): string {
  if (record.reviewStatus == null) return '—'
  return PIC_REVIEW_STATUS_MAP[record.reviewStatus] ?? String(record.reviewStatus)
}

// 数据
const dataList = ref<API.PictureVO[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (n: number) => `共 ${n} 条`,
  }
})

// 获取数据
const fetchData = async () => {
  const res = await listPictureByPageUsingPost({
    ...searchParams,
  })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 获取数据
const doSearch = () => {
  // 重置搜索条件
  searchParams.current = 1
  fetchData()
}

// 表格变化处理
const doTableChange: TableProps['onChange'] = (pag) => {
  searchParams.current = pag?.current ?? 1
  searchParams.pageSize = pag?.pageSize ?? 10
  fetchData()
}

const doDelete = async (id: string) => {
  if (id == null) {
    message.error('id 为空')
    return
  }
  const deleteResponse = await deletePictureUsingPost({ id })
  if (deleteResponse.data.data && deleteResponse.data.code === 0) {
    await fetchData()
    message.success('删除成功')
  } else {
    message.error('删除失败')
  }
}

const handleReview = async (record: API.PictureVO, reviewStatus: number) => {
  const reviewMessage =
    reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员操作通过' : '管理员操作拒绝'
  const res = await doPictureReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage,
  })
  if (res.data.code === 0) {
    message.success('审核操作成功')
    // 重新获取列表
    fetchData()
  } else {
    message.error('审核操作失败，' + res.data.message)
  }
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
#userManagePage :deep(.ant-table-tbody > tr > td) {
  vertical-align: middle;
}

.pic-thumb :deep(.ant-image-img),
.pic-thumb :deep(img) {
  object-fit: cover;
  border-radius: 4px;
}

.cell-ellipsis {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  cursor: default;
}

.popover-detail {
  min-width: 200px;
  line-height: 1.7;
}

.tags-more {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.tags-cell {
  max-width: 168px;
}
</style>

<style>
/* Popover 挂在 body，需非 scoped */
.picture-manage-popover .ant-popover-inner-content {
  max-width: 360px;
}
</style>
