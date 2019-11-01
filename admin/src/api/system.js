import {axios} from '@/utils/request'

const URI = {
  getUploadParams: '/system/getUploadParams'
}

function getUploadParams(parameter) {
  return axios({
    url: URI.getUploadParams,
    params: parameter
  })
}

export default {
  getUploadParams
}
