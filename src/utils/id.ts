/**
 * 雪花 id 超过 Number.MAX_SAFE_INTEGER，禁止 Number(id) / parseInt(id)。
 * 路由、Axios 参数、URL 拼接一律用 string。
 */
export function toIdString(value: unknown): string | undefined {
  if (value == null || value === '') {
    return undefined
  }
  if (Array.isArray(value)) {
    return toIdString(value[0])
  }
  return String(value)
}

/** 从 vue-router query 读取 id（单个 key） */
export function queryId(
  query: Record<string, unknown> | undefined,
  key: string,
): string | undefined {
  if (!query) return undefined
  return toIdString(query[key])
}
