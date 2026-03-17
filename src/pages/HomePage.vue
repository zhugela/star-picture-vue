<template>
  <div id="homePage" class="home-page">
    <section class="hero">
      <h1 class="page-title">星图集</h1>
      <p class="page-desc">爱豆写真云 · 从海量图片里发现你的心动瞬间</p>
      <div class="search-card">
        <a-input-search
          v-model:value="searchParams.searchText"
          placeholder="输入关键词搜索"
          enter-button="搜索"
          size="large"
          class="search-input"
          @search="doSearch"
        />
      </div>
    </section>

    <section class="filters">
      <div class="filter-tabs">
        <button
          v-for="cat in ['all', ...categoryList]"
          :key="cat"
          type="button"
          class="tab-btn"
          :class="{ active: selectedCategory === (cat === 'all' ? 'all' : cat) }"
          @click="selectCategory(cat === 'all' ? 'all' : cat)"
        >
          {{ cat === 'all' ? '全部' : cat }}
        </button>
      </div>
      <div class="tag-bar">
        <span class="tag-label">标签：</span>
        <div class="tag-list">
          <button
            v-for="(tag, index) in tagList"
            :key="tag"
            type="button"
            class="tag-btn"
            :class="{ active: selectedTagList[index] }"
            @click="toggleTag(index)"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </section>

    <section class="pagination-row">
      <a-pagination
        v-model:current="searchParams.current"
        v-model:pageSize="searchParams.pageSize"
        :total="total"
        show-size-changer
        class="pagination-style"
        @change="onPageChange"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'

const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagList = ref<boolean[]>([])

const dataList = ref<any[]>([])
const total = ref(0)
const loading = ref(true)

const searchParams = reactive<any>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const fetchData = async () => {
  loading.value = true
  const params = { ...searchParams, tags: [] as string[] }
  if (selectedCategory.value !== 'all') params.category = selectedCategory.value
  selectedTagList.value.forEach((useTag, index) => {
    if (useTag) params.tags.push(tagList.value[index])
  })
  setTimeout(() => {
    total.value = 50
    loading.value = false
  }, 500)
}

const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

const selectCategory = (cat: string) => {
  selectedCategory.value = cat
  doSearch()
}

const toggleTag = (index: number) => {
  selectedTagList.value[index] = !selectedTagList.value[index]
  doSearch()
}

const getTagCategoryOptions = async () => {
  categoryList.value = ['写真', '演唱会', '红毯', '日常']
  tagList.value = ['高清', '生图', '饭拍', '壁纸']
  selectedTagList.value = tagList.value.map(() => false)
}

onMounted(() => {
  getTagCategoryOptions()
  fetchData()
})
</script>

<style scoped>
.home-page {
  padding: var(--space-4) 0;
}

.hero {
  margin-bottom: var(--space-6);
  text-align: center;
}

.page-title {
  font-size: 2rem;
  font-weight: var(--font-title);
  letter-spacing: var(--letter-relaxed);
  margin: 0 0 var(--space-2);
  color: var(--color-ink);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-desc {
  margin: 0 0 var(--space-4);
  color: var(--color-ink);
  opacity: 0.85;
  line-height: var(--line-body);
}

.search-card {
  max-width: 480px;
  margin: 0 auto;
  padding: var(--space-3);
  border: var(--border-soft);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-soft);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
}

.search-input :deep(.ant-input-search-button) {
  border: var(--border-soft);
  background: var(--gradient-primary);
  color: #fff;
  font-weight: 600;
  border-radius: 0 var(--radius-btn) var(--radius-btn) 0;
  transition: all var(--duration) var(--ease-smooth);
}
.search-input :deep(.ant-input-search-button:hover) {
  transform: translateY(-1px);
  box-shadow: var(--glow-sakura);
}
.search-input :deep(.ant-input) {
  border: var(--border-soft);
  border-radius: var(--radius-btn) 0 0 var(--radius-btn);
}

.filters {
  margin-bottom: var(--space-4);
}

.filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-bottom: var(--space-3);
}

.tab-btn {
  padding: var(--space-1) var(--space-2);
  border: var(--border-soft);
  background: var(--bg-card);
  border-radius: var(--radius-btn);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration) var(--ease-smooth);
}
.tab-btn:hover {
  background: var(--gradient-soft);
  box-shadow: var(--shadow-soft);
  transform: translateY(-2px);
}
.tab-btn.active {
  background: var(--gradient-primary);
  color: #fff;
  border-color: var(--color-sakura-border);
  box-shadow: var(--glow-sakura);
}

.tag-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tag-label {
  font-weight: 600;
  flex-shrink: 0;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.tag-btn {
  padding: var(--space-1) var(--space-2);
  border: var(--border-soft);
  background: var(--bg-card);
  border-radius: var(--radius-btn);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--duration) var(--ease-smooth);
}
.tag-btn:hover,
.tag-btn.active {
  background: linear-gradient(135deg, var(--color-cream) 0%, var(--color-sakura) 100%);
  box-shadow: var(--glow-cream);
  transform: translateY(-2px);
}

.pagination-row {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-4);
}

.pagination-style :deep(.ant-pagination-item) {
  border: var(--border-soft);
  border-radius: var(--radius-btn);
  transition: all var(--duration) var(--ease-smooth);
}
.pagination-style :deep(.ant-pagination-item:hover),
.pagination-style :deep(.ant-pagination-item-active) {
  box-shadow: var(--shadow-soft);
}
</style>
