import { axios } from '@/utils/request'

const URI = {
  batchSaveOrUpdate: '/userEstate/batchSaveOrUpdate',
  del: '/userEstate/delete'
}

function saveOrUpdate (parameter) {
  return axios({
    url: URI.batchSaveOrUpdate,
    params: parameter
  })
}

function del (parameter) {
  return axios({
    url: URI.del,
    params: parameter
  })
}

export default {
  del,
  saveOrUpdate
}
