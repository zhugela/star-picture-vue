import request from '@/request'

function getApiBase(): string {
  const base = request.defaults.baseURL
  if (typeof base === 'string' && base) {
    return base.replace(/\/$/, '')
  }
  return 'http://localhost:8123'
}

/**
 * 将 COS / 外链转为同源代理地址，供 vue-cropper 使用（避免跨域灰格）。
 */
export function toEditorProxyUrl(cosUrl: string): string {
  if (!cosUrl || cosUrl.startsWith('data:') || cosUrl.startsWith('blob:')) {
    return cosUrl
  }
  if (cosUrl.includes('/api/picture/proxy/editor')) {
    return cosUrl
  }
  const encoded = encodeURIComponent(cosUrl)
  // 开发：走 Vite /api 代理到 8123；也可直接用后端完整地址
  if (import.meta.env.DEV) {
    return `/api/picture/proxy/editor?url=${encoded}`
  }
  return `${getApiBase()}/api/picture/proxy/editor?url=${encoded}`
}

/**
 * 编辑器/裁切器原始地址优先级（再经 toEditorProxyUrl 代理）。
 */
export function resolvePictureEditorRawUrl(picture?: API.PictureVO | null): string | undefined {
  if (!picture) {
    return undefined
  }
  return (
    picture.editUrl ||
    picture.urls?.transferUrl ||
    picture.urls?.originalUrl ||
    picture.url ||
    picture.urls?.url ||
    picture.thumbnailUrl ||
    undefined
  )
}

/** 裁切器最终 img：优先 editUrl 等，并走 /api/picture/proxy/editor */
export function resolvePictureEditorUrl(picture?: API.PictureVO | null): string | undefined {
  const raw = resolvePictureEditorRawUrl(picture)
  if (!raw) {
    return undefined
  }
  return toEditorProxyUrl(raw)
}
