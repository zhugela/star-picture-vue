import { saveAs } from 'file-saver'

export { queryId, toIdString } from './id'
export {
  resolvePictureEditorRawUrl,
  resolvePictureEditorUrl,
  toEditorProxyUrl,
} from './picture'

/**
 * 格式化文件大小
 * @param size
 */
export const formatSize = (size?: number) => {
  if (!size) return '未知'
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

/**
 * 下载图片
 * @param url 图片下载地址
 * @param fileName 要保存为的文件名
 */
export function downloadImage(url?: string, fileName?: string) {
  if (!url) {
    return
  }
  saveAs(url, fileName)
}

/**
 * 将后端主色调（如 0xRRGGBB）或 RGB 转为 #RRGGBB
 */
export function toHexColor(input: string): string
export function toHexColor(r: number, g: number, b: number): string
export function toHexColor(r: number | string, g?: number, b?: number): string {
  if (typeof r === 'string') {
    const colorValue = r.startsWith('0x') ? r.slice(2) : r.replace(/^#/, '')
    const hexColor = parseInt(colorValue, 16).toString(16).padStart(6, '0')
    return `#${hexColor}`
  }
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return '#' + toHex(r) + toHex(g ?? 0) + toHex(b ?? 0)
}