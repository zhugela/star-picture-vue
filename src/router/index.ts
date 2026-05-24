import { createRouter, createWebHistory } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import MySpacePage from '@/pages/MySpacePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import AddPicturePage from '@/pages/AddPicturePage.vue'
import AddPictureBatchPage from '@/pages/AddPictureBatchPage.vue'
import PictureManagePage from '@/pages/admin/PictureManagePage.vue'
import SpaceManagePage from '@/pages/admin/SpaceManagePage.vue'
import AddSpacePage from '@/pages/AddSpacePage.vue'
import SpaceDetailPage from '@/pages/SpaceDetailPage.vue'
import PictureDetailPage from '@/pages/PictureDetailPage.vue'
import SearchPicturePage from '@/pages/SearchPicturePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
    },
    {
      path: '/my_space',
      name: '我的空间',
      component: MySpacePage,
    },
    {
      path: '/',
      component: BasicLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomePage,
        },
        {
          path: 'admin/pictureManage',
          name: '图片管理',
          component: PictureManagePage,
        },
        {
          path: 'admin/spaceManage',
          name: '空间管理',
          component: SpaceManagePage,
        },
        {
          path: 'admin/userManage',
          name: '用户管理',
          component: UserManagePage,
        },
        {
          path: 'add_space',
          name: '创建空间',
          component: AddSpacePage,
        },
        {
          path: 'space/:id',
          name: '空间详情',
          component: SpaceDetailPage,
          props: true,
        },
        {
          path: 'add_picture',
          name: '创建图片',
          component: AddPicturePage,
        },
        {
          path: 'add_picture/batch',
          name: '批量创建图片',
          component: AddPictureBatchPage,
        },
        {
          path: 'picture/:id',
          name: '图片详情',
          component: PictureDetailPage,
          props: true,
        },
        {
          path: 'search_picture',
          name: '以图搜图',
          component: SearchPicturePage,
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
        },
      ],
    },
  ],
})

export default router
