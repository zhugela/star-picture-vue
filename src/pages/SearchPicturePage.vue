<template>
  <div id="searchPicturePage">
    <h2 style="margin-bottom: 16px">以图搜图</h2>
    <PictureList :data-list="dataList" :loading="loading" />
    <a-empty v-if="!loading && dataList.length === 0" description="未找到相似图片" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { searchPictureByPictureUsingPost } from '@/api/pictureController.ts'
import PictureList from '@/components/PictureList.vue'
import { queryId } from '@/utils/id'

const route = useRoute()
const dataList = ref<API.PictureVO[]>([])
const loading = ref(true)

const fetchData = async () => {
  const pictureId = queryId(route.query as Record<string, unknown>, 'pictureId')
  if (!pictureId) {
    message.error('缺少有效的 pictureId')
    loading.value = false
    return
  }
  loading.value = true
  try {
    const res = await searchPictureByPictureUsingPost({ pictureId })
    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data
    } else {
      message.error('搜索失败，' + res.data.message)
      dataList.value = []
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    message.error('搜索失败：' + msg)
    dataList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
#searchPicturePage {
  margin-bottom: 16px;
}
</style>
