import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    requestType?: string
  }
}
