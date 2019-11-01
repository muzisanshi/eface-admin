import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'

import constants from './modules/constants'
import system from './modules/system'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    constants,
    system
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})
