import {
  createRouter,
  createWebHistory,
  // createWebHashHistory
} from 'vue-router'

import Layout from '@/layout/index.vue'
import LayoutMobile from '@/layout/mobile.vue'
import LayoutLine from '@/layout/Line.vue'

// 配置路由信息
export const constantRoutes = [
  {
    path: '/redirect',
    name: 'Redirect',
    component: Layout,
    meta: {
      title: 'Redirect',
      hidden: true
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/redirect/index.vue'),
        meta: {
          title: 'Redirect',
          hidden: true
        }
      }
    ]
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true,
      title: '登入'
    }
  },

  {
    path: '/404',
    name: 'Error404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      hidden: true,
      title: '404'
    }
  },
  {
    path: '/500',
    name: 'Error500',
    component: () => import('@/views/error/500.vue'),
    meta: {
      hidden: true,
      title: '500'
    }
  }
]

export const asyncRoutes = [
  {
    path: '/',
    name: 'homePage',
    redirect: '/case-tracking',
    component: Layout,
    meta: {
      title: 'ERAS 個案管理平台', 
    },
    children: [
      {
        path: '/case-account',
        name: 'CaseAccount',
        props: true, // 啟用 props 傳遞
        component: () => import('@/views/accountManagement/CaseAccount.vue'),
        meta: {
            title: '個案帳號',
            noCache: true,
            affix: true,
        },
      },
      {
        path: '/employee-account',
        name: 'EmployeeAccount',
        component: () => import('@/views/accountManagement/EmployeeAccount.vue'),
        meta: {
            title: '員工帳號',
            noCache: true,
            affix: true,
        },
      },
      {
        path: '/case-tracking',
        name: 'CaseTracking',
        props: true, // 啟用 props 傳遞
        component: () => import('@/views/caseTracking/index.vue'),
        meta: {
            title: '個案管理',
            noCache: true,
            affix: true,
        },
      },
      {
        path: '/case-tracking/Details',        
        name: 'Details',
        props: true, // 啟用 props 傳遞
        component: () => import('@/views/caseTracking/Details.vue'),
        meta: {
            title: '個案詳情',
            noCache: true,
            affix: true,
        },
      }
    ]
  },
  {
      path: '/test',
      name: 'test',      
      component: Layout,
      redirect: '/test/table',
      meta: {
            title: 'test'
      },
      children: [
        {
          path: '/test/table',
          name: 'table',      
          component: () => import('@/views/table/test.vue'),
          meta: {
              title: 'test',
              noCache: true,
              affix: true
          },
        }
      ]    
  },
  {
    path: '/caseAccount',
    name: 'caseAccount',
    component: Layout,
    redirect: '/caseAccount',
    meta: {
      title: 'caseAccount'
    },
    children: [
      {
        path: '/test',
        name: 'test',
        component: () => import('@/views/homePage/index.vue'),
        meta: {
          title: 'test',
          noCache: true,
          affix: true,
          device:'line',
        }
      },

    ]
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
    name: 'Redirect404',
    meta: {
      title: '404',
      hidden: true
    }
  }
]


export const mobileasyncRoutes = [ 
  {
    path: '/line',
    name: 'line',
    redirect: '/lineLoading',
    component: LayoutLine,  
    meta: {
      title: '聯新關骨樂活吧'
    },
    children: [
      {
        path: '/lineLoading',
        name: 'lineLoading',
        component: () => import('@/views/line/mobile.vue'),
        meta: {
          title: 'loading',
          device:'line',
          noCache: true,
          affix: true  
        }
      },
      {
        path: '/line/login',
        name: 'lineLogin',
        component: () => import('@/views/line/login.vue'),  
        meta: {
          title: '聯新關骨樂活吧',
          device:'line',
          noCache: true,
          affix: true  
        }
      },
    ]
  },
  {
    path: '/line/Outpatient',
    name: 'Outpatient',
    component: LayoutMobile,
    redirect: '/line/Outpatient/index',
    meta: {
      title: '門診掛號'
    },
    children: [
      {
        path: '/line/Outpatient/index',
        name: 'OutpatientIndex',
        component: () => import('@/views/line/Outpatient.vue'),
        props: true, // 啟用 props 傳遞
        meta: {
          title: '門診掛號',
          device:'line',
          noCache: true,
          affix: true  
        }
      },
      {
        path: '/line/Outpatient/verify',
        name: 'OutpatientVerify',
        component: () => import('@/views/line/OutpatientVerify.vue'),
        props: true, // 啟用 props 傳遞
        meta: {
          title: '門診掛號',
          device:'line',
          noCache: true,
          affix: true  
        }
      },
     
      {
        path: '/line/QueryCancellation',
        name: 'QueryCancellation',
        component: () => import('@/views/line/QueryCancellation.vue'),
        meta: {
          title: '查詢取消',
          device:'line',
          noCache: true,
          affix: true  
        }
      }
    ]
  }

]




const router = createRouter({
  // history: createWebHashHistory('./'),
  history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes.concat(asyncRoutes, mobileasyncRoutes),
  scrollBehavior: () => ({ left: 0, top: 0 })
})




export function resetRouter() {
  const WHITE_NAME_LIST = ['Login']
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router
