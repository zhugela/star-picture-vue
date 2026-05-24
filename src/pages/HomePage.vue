<template>
  <div id="homePage" class="home-page">
    <section class="card search-card">
      <h1 class="hero-title">发现优质图片</h1>
      <p class="hero-subtitle">搜索你喜欢的图片素材</p>
      <a-input-search
        v-model:value="searchParams.searchText"
        placeholder="输入关键词搜索"
        enter-button="搜索"
        size="large"
        class="hero-search"
        @search="doSearch"
      />
    </section>

    <section class="card tabs-card">
      <a-tabs v-model:active-key="selectedCategory" type="line" class="category-tabs" @change="onCategoryChange">
        <a-tab-pane key="all" tab="全部" />
        <a-tab-pane v-for="category in categoryList" :key="category" :tab="category" />
      </a-tabs>
    </section>

    <section class="card tags-card">
      <span class="tags-label">标签</span>
      <div class="tags-row">
        <a-space :size="[8, 8]" wrap>
          <a-checkable-tag
            v-for="(tag, index) in tagList"
            :key="tag"
            v-model:checked="selectedTagList[index]"
            class="tag-item"
            @change="doSearch"
          >
            {{ tag }}
          </a-checkable-tag>
        </a-space>
      </div>
    </section>

    <section class="card list-card">
      <PictureList v-if="dataList.length > 0 || loading" :data-list="dataList" :loading="loading" />
      <div v-else class="empty-holder">
        <a-empty description="暂无图片，试试调整筛选或稍后重试" />
      </div>
    </section>

    <div class="pagination-bar">
      <a-pagination
        v-model:current="searchParams.current"
        v-model:page-size="searchParams.pageSize"
        :total="total"
        show-size-changer
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost,
} from '@/api/pictureController.ts'
import PictureList from '@/components/PictureList.vue'

const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(true)

const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagList = ref<boolean[]>([])

const fetchData = async () => {
  loading.value = true
  try {
    const params: API.PictureQueryRequest = {
      ...searchParams,
      searchText: searchParams.searchText?.trim() || undefined,
      tags: [],
      nullSpaceId: true,
    }
    if (selectedCategory.value !== 'all') {
      params.category = selectedCategory.value
    }
    selectedTagList.value.forEach((useTag, index) => {
      if (useTag && tagList.value[index]) {
        params.tags!.push(tagList.value[index])
      }
    })
    if (!params.tags?.length) {
      delete params.tags
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

const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

const onCategoryChange = () => {
  doSearch()
}

const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    tagList.value = res.data.data.tagList ?? []
    categoryList.value = res.data.data.categoryList ?? []
    selectedTagList.value = tagList.value.map(() => false)
  } else {
    message.error('获取标签分类列表失败，' + res.data.message)
  }
}

onMounted(async () => {
  await getTagCategoryOptions()
  await fetchData()
})
</script>

<style scoped>
.home-page {
  width: 100%;
  max-width: 100%;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  padding: 24px;
}

.search-card {
  text-align: center;
}

.hero-title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  line-height: 1.35;
}

.hero-subtitle {
  margin: 0 0 20px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}

.hero-search {
  max-width: 520px;
  margin: 0 auto;
}

.tabs-card {
  padding-bottom: 8px;
}

.category-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 0;
}

.category-tabs :deep(.ant-tabs-tab) {
  padding: 10px 0;
  font-size: 14px;
}

.category-tabs :deep(.ant-tabs-ink-bar) {
  height: 2px;
  border-radius: 1px;
}

.tags-card {
  padding-top: 16px;
  padding-bottom: 16px;
}

.tags-label {
  display: block;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.55);
}

.tags-row :deep(.ant-checkable-tag) {
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
  background: #fafafa;
}

.tags-row :deep(.ant-checkable-tag-checked) {
  background: rgba(22, 119, 255, 0.1);
  border-color: #91caff;
  color: #1677ff;
}

.list-card {
  min-height: 280px;
  margin-bottom: 24px;
}

.empty-holder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  padding: 24px 0;
}

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  padding: 0 8px 8px 0;
  max-width: 100%;
}

.pagination-bar :deep(.ant-pagination) {
  flex-wrap: wrap;
  justify-content: flex-end;
  row-gap: 8px;
}

@media (max-width: 576px) {
  .card {
    padding: 16px;
    margin-bottom: 16px;
  }

  .hero-title {
    font-size: 18px;
  }

  .pagination-bar {
    justify-content: center;
    padding: 0;
  }

  .pagination-bar :deep(.ant-pagination) {
    justify-content: center;
  }
}
</style>
