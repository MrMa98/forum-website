import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: () => import('../components/HomePage.vue'),
      children: [
        {
          path: 'post',
          component: () => import('../components/PostManage.vue'),
        },
        {
          path: 'record',
          component: () => import('../components/OperationRecord.vue'),
        },
        {
          path: 'forum',
          component: () => import('../components/TopicForum.vue'),
        },
      ]
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component: () => import('../components/TopicDetail.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../components/LoginPage.vue'),
      props: { mode: 'login' }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../components/LoginPage.vue'),
      props: { mode: 'register' }
    },
    {
      path: '/error',
      name: '404',
      component: () => import('../components/NotFoundPage.vue')
    },
  ]
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.beforeEach(async (to, _from) => {
  const token = localStorage.getItem('token');
  if(to.path === '/'|| to.path === '/home'){
    router.push('/home/post');
  }
  if (
    // 检查用户是否已登录
    !token && to.name !== 'Login' && to.name !== 'Register'
  ) {
    // 将用户重定向到登录页面
    router.push('/login');
    return { name: 'Login' }
  }

  if (
    // 检查用户是否已登录
    token && (to.name == 'Login' || to.name == 'Register')
  ) {
    // 将用户重定向到登录页面
    router.push('/home/post');
  }
})

export default router
