
export default {
  state: {
    uploadMainUrl: process.env.VUE_APP_RESOURCE_SERVICE_BASE_URL + '/upload'
  },
  mutations: {
    UPDATE_UPLOAD_MAIN_URL (state, url) {
      state.uploadMainUrl = url
    }
  },
  actions: {
  }
}
