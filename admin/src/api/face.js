import { axios } from '@/utils/request'

const URI = {
  getFaces: '/face/getFaces',
  del: '/area/delete'
}

function getFaces (parameter) {
  return axios({
    url: URI.getFaces,
    params: parameter
  })
}

function del (parameter) {
  return axios({
    url: URI.del,
    params: parameter
  })
}

function upload (url, parameter) {
  return axios({
    url: url,
    upload: 'upload',
    enctype: 'application/x-www-form-urlencoded',
    params: parameter
  })
}


export default {
  getFaces,
  del,
  upload
}