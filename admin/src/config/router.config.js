// eslint-disable-next-line
import {BasicLayout, BlankLayout, PageView, RouteView, UserLayout} from '@/layouts'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: []
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/user/Login')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/exception/404')
  },
  {
    path: '/epidemicSituation',
    name: 'epidemicSituation',
    component: () => import('@/views/esManage/EpidemicSituation')
  },
  {
    path: '/bodyTemperature',
    name: 'bodyTemperature',
    component: () => import('@/views/esManage/BodyTemperature')
  },
  {
    path: '/pointInformation',
    name: 'pointInformation',
    component: () => import('@/views/esManage/PointInformation')
  },
  {
    path: '/memberTrail',
    name: 'memberTrail',
    component: () => import('@/views/esManage/MemberTrail')
  },
  {
    path: '/tempStatus',
    component: () => import('@/views/esManage/TempStatus')
  }
]
