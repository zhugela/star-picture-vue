<template>
  <div class="picture-list">
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <a-card hoverable @click="doClickPicture(picture)">
            <template #cover>
              <img
                :alt="picture.name"
                :src="picture.thumbnailUrl ?? picture.url"
                style="height: 180px; object-fit: cover; width: 100%"
                loading="lazy"
              />
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex wrap="wrap" gap="small">
                  <a-tag color="green">{{ picture.category ?? '默认' }}</a-tag>
                  <a-tag v-for="tag in parseTags(picture)" :key="tag">{{ tag }}</a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <template v-if="showOp" #actions>
              <SearchOutlined key="search" @click="(e: Event) => doSearch(picture, e)" />
              <ShareAltOutlined key="share" @click="(e: Event) => doShare(picture, e)" />
              <EditOutlined key="edit" @click="(e: Event) => doEdit(picture, e)" />
              <DeleteOutlined key="delete" @click="(e: Event) => doDelete(picture, e)" />
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <ShareModal ref="shareModalRef" :link="shareLink" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { deletePictureUsingPost } from '@/api/pictureController.ts'
import ShareModal from '@/components/ShareModal.vue'

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
})

const router = useRouter()
const shareModalRef = ref<InstanceType<typeof ShareModal> | null>(null)
const shareLink = ref<string>('')

function parseTags(picture: API.PictureVO): string[] {
  const raw = picture.tags as unknown
  if (raw == null) return []
  if (Array.isArray(raw)) return raw as string[]
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

const doClickPicture = (picture: API.PictureVO) => {
  if (picture.id == null) return
  router.push({ path: `/picture/${picture.id}` })
}

const doSearch = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  if (picture.id == null) return
  window.open(`/search_picture?pictureId=${picture.id}`)
}

const doShare = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  if (picture.id == null) return
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  shareModalRef.value?.openModal()
}

const doEdit = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  const q: Record<string, string> = {
    id: String(picture.id),
  }
  if (picture.spaceId != null && picture.spaceId !== '') {
    q.spaceId = String(picture.spaceId)
  }
  router.push({
    path: '/add_picture',
    query: q,
  })
}

const doDelete = async (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  const id = picture.id
  if (id == null) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    props.onReload?.()
  } else {
    message.error('删除失败，' + (res.data.message ?? ''))
  }
}
</script>

<style scoped></style>
