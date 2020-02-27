import Vue from 'vue'
import api from '@/api/index'
import { ACCESS_TOKEN,MANAGER,USER_AUTH,SYS_BUTTON_AUTH } from '@/store/mutation-types'
import { setStore } from '@/utils/storage'
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    permissionList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, {name, welcome}) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
  },

  actions: {
    // 登录
    Login({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        api.user.login(userInfo).then(response => {
          const result = response
          sessionStorage.setItem('ACCESS_TOKEN', result.managerToken, 7 * 24 * 60 * 60 * 1000)
          Vue.ls.set(MANAGER, result.managerInfoData)
          commit('SET_TOKEN', result.managerToken)
          commit('SET_INFO', result.managerInfoData)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取权限
    GetPermissionList({ commit }) {
      return new Promise((resolve, reject) => {
        api.permission.getPermissionByToken().then(response => {
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
          const menuData = [...initMenu,...response.menus]
          const authData = response.managerAuth;
          const allAuthData = response.allAuth;
          sessionStorage.setItem(USER_AUTH,JSON.stringify(authData));
          sessionStorage.setItem(SYS_BUTTON_AUTH,JSON.stringify(allAuthData));
          if (menuData && menuData.length > 0) {
            commit('SET_PERMISSIONLIST', menuData)
          } else {
            reject('getPermissionList: permissions must be a non-null array !')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        Vue.ls.remove(ACCESS_TOKEN)
        api.manager.logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }

  }
}

export default user
