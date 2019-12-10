import { axios } from '@/utils/request'

const URI = {
  canRegister: '/face/canRegister',
  save: '/face/save',
  del: '/face/delete'
}

function canRegister (parameter) {
  return axios({
    url: URI.canRegister,
    params: parameter
  })
}

function save (parameter) {
  return axios({
    url: URI.save,
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
  canRegister,
  save,
  del,
  upload
}