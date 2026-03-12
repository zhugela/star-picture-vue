/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 核心修复点：在此处添加 BASE_URL 的类型声明
interface ImportMetaEnv {
  readonly BASE_URL: string
  // 如果你还有其他变量（如 VITE_API_URL），也请写在这里
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
