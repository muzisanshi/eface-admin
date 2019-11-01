import api from '@/api/index'

export default {
  state: {
    uploadMainUrl: ''
  },
  mutations: {
    UPDATE_UPLOAD_MAIN_URL (state, url) {
      state.uploadMainUrl = url
    }
  },
  actions: {
    loadSystemSetting({
      commit
    }) {
      api.system.getUploadParams().then(res => {
        commit('UPDATE_UPLOAD_MAIN_URL', res.uploadMainUrl)
      }).catch(err => {})
    }
  }
}
