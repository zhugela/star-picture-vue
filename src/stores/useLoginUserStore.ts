import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLoginUserUsingGet } from '@/api/userController.ts'

export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<API.LoginUserVo>({
    userName: '未登录',
  })


  async function fetchLoginUser() {
    try {
      const res = await getLoginUserUsingGet()
      if (res.data.code === 0 && res.data.data) {
        loginUser.value = res.data.data
      }
    } catch {
      // 后端未启动、断网或 CORS 时不抛错，避免路由守卫中断；保持当前登录态展示
    }
  }


  function setLoginUser(newLoginUser: API.LoginUserVo) {
    loginUser.value = newLoginUser
  }

  return { loginUser, setLoginUser, fetchLoginUser }
})
