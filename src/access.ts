import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message } from 'ant-design-vue'
import router from '@/router'

// 是否为首次获取登录用户
let firstFetchLoginUser = true

/**
 * 全局权限校验（Vue Router 4：通过 return 控制导航，勿再使用 next()）
 */
router.beforeEach(async (to) => {
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser
  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstFetchLoginUser = false
  }
  if (to.path.startsWith('/admin')) {
    if (!loginUser || loginUser.userRole !== 'admin') {
      message.error('没有权限')
      return {
        path: '/user/login',
        query: { redirect: to.fullPath },
      }
    }
  }
})
