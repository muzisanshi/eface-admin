

export default {
  state: {
    uploadMainUrl: 'http://172.16.30.218:21002/resourceService/upload'
  },
  mutations: {
    UPDATE_UPLOAD_MAIN_URL (state, url) {
      state.uploadMainUrl = url
    }
  },
  actions: {
  }
}
