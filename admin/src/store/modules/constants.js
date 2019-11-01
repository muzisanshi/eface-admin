import api from '@/api/index'

export default {
  state: {
    data: {},
    list: {}
  },
  mutations: {
    UPDATE_CONSTANTS(state, data) {
      state.data = data
    },
    UPDATE_CONSTANTS_LIST(state, list) {
      state.list = list
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
    }
  }
}
