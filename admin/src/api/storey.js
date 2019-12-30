  import { axios } from '@/utils/request'

const URI = {
  getById: '/storey/getById',
  page: '/storey/getPage',
  getAll: '/storey/getAll',
  saveOrUpdate: '/storey/saveOrUpdate',
  getMaxRoomNum: '/room/getMaxRoomNum',
  del: '/storey/delete'
}

function getPage (parameter) {
  return axios({
    url: URI.page,
    params: parameter
  })
}

function getById (parameter) {
  return axios({
    url: URI.getById,
    params: parameter
  })
}

function getMaxRoomNum (parameter) {
  return axios({
    url: URI.getMaxRoomNum,
    params: parameter
  })
}

function saveOrUpdate (parameter) {
  return axios({
    url: URI.saveOrUpdate,
    params: parameter
  })
}

function del (parameter) {
  return axios({
    url: URI.del,
    params: parameter
  })
}

function getAll (parameter) {
  return axios({
    url: URI.getAll,
    params: parameter
  })
}

export default {
  getById,
  getPage,
  del,
  getAll,
  saveOrUpdate,
  getMaxRoomNum
}