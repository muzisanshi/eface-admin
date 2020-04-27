import {asyncRouterMap, constantRouterMap} from '@/config/router.config'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission(permission, route) {
  if (route.meta && route.meta.permission) {
    let flag = -1
    for (let i = 0, len = permission.length; i < len; i++) {
      flag = route.meta.permission.indexOf(permission[i])
      if (flag >= 0) {
        return true
      }
    }
    return false
  }
  return true
}

function filterAsyncRouter(routerMap, menu) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(menu.permissionList, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menu)
      }
      return true
    }
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    // 动态添加主界面路由，需要缓存
    UpdateAppRouter({ commit }, routes) {
      return new Promise(resolve => {
        let routelist = routes.constRoutes;
        commit('SET_ROUTERS', routelist)
        resolve()
      })
    }
  }
}

export default permission
