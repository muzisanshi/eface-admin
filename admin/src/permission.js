import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import notification from 'ant-design-vue/es/notification'
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { generateIndexRouter } from '@/utils/util'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: '/dashboard/workplace' })
      NProgress.done()
    } else {
      if (store.getters.permissionList.length === 0) {
        store
          .dispatch('GetPermissionList')
          .then(res => {
            const initMenu = [
              {
                path: '/dashboard',
                name: 'dashboard',
                enable: true,
                orderNum: 10,
                remark: null,
                title: null,
                redirect: '/dashboard/workplace',
                component: 'layouts/RouteView',
                meta: { title: '仪表盘', keepAlive: true, icon: 'home' },
                children: [
                  {
                    path: '/dashboard/workplace',
                    name: 'Workplace',
                    component: 'dashboard/Workplace',
                    meta: { title: '工作台', keepAlive: true, icon: 'desktop' }
                  }
                ]
              }
            ]
            const menuData = [...initMenu, ...res.result.menus]
            if (menuData === null || menuData === '' || menuData === undefined) {
              return
            }
            let constRoutes = []
            constRoutes = generateIndexRouter(menuData)
            // 添加主界面路由
            store.dispatch('UpdateAppRouter', { constRoutes }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户菜单失败，请重试'
            })
            store.dispatch('Logout').then(() => {
              next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
      } else {
        next(vm => {
          vm.$router.replace(from.path)
        })
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      next()
    } else {
      next({ path: '/user/login', query: { redirect: '/' } })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
