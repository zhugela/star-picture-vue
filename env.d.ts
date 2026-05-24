/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly BASE_URL: string
  /** 文件上传（multipart）接口前缀，默认 `/api/file` */
  readonly VITE_FILE_API_BASE?: string
  /** PictureController 业务前缀，默认 `/api/picture`。本仓库有 context-path `/api` 时不要改成 `/picture`。 */
  readonly VITE_PICTURE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
