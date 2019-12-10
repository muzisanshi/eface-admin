  import { axios } from '@/utils/request'

const URI = {
  saveOrUpdate: '/adDist/saveOrUpdate',
  getDeviceScreen: '/adDist/getDeviceScreen'
}

function saveOrUpdate (parameter) {
  return axios({
    url: URI.saveOrUpdate,
    params: parameter
  })
}

function getDeviceScreen (parameter) {
  return axios({
    url: URI.getDeviceScreen,
    params: parameter
  })
}

export default {
  getDeviceScreen,
  saveOrUpdate
}