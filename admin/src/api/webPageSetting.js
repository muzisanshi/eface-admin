  import { axios } from '@/utils/request'

const URI = {
  saveOrUpdate: '/webPageSetting/saveOrUpdate',
  getInfo: '/webPageSetting/getInfo'
}

function saveOrUpdate (parameter) {
  return axios({
    url: URI.saveOrUpdate,
    params: parameter
  })
}

function getInfo (parameter) {
  return axios({
    url: URI.getInfo,
    params: parameter
  })
}

export default {
  getInfo,
  saveOrUpdate
}