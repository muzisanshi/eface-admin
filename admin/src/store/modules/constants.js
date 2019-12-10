import api from '@/api/index'
import { UPDATE_LOGO_DATA } from '@/store/mutation-types'
import { setStore } from '@/utils/storage'
export default {
  state: {
    data: {},
    list: {},
    logoData: {}
  },
  mutations: {
    UPDATE_CONSTANTS(state, data) {
      state.data = data
    },
    UPDATE_CONSTANTS_LIST(state, list) {
      state.list = list
    },
    UPDATE_LOGO_DATA (state, data) {
      state.logoData = data
    }
  },
  actions: {
    loadConstants({
      commit
    }) {
      api.constants.getEnumData().then(res => {
        let list = {}
        for(let i in res){
          let l = []
          for(let j in res[i]){
            res[i][j].label = res[i][j].name
            l.push({
              label: res[i][j].name,
              value: res[i][j].value
            })
          }
          list[i] = l
        }
        commit("UPDATE_CONSTANTS", res)
        commit("UPDATE_CONSTANTS_LIST", list)
      }).catch(err => {})
    },

    loadLogoData ({
       commit
    }) {
    api.webPageSetting.getInfo().then(res => {
      commit("UPDATE_LOGO_DATA", res)
    }).catch(err => {})
    }
  }
}
