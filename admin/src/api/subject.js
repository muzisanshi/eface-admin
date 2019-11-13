  import { axios } from '@/utils/request'

const URI = {
  getUnitAll: '/unit/getAll',
  page: '/unit/getPage',
  del: '/unit/delete',
  getById: '/unit/getById',
  getBuildAll: '/building/getAll',
  saveOrUpdate: '/building/saveOrUpdate'
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

function getUnitAll (parameter) {
  return axios({
    url: URI.getUnitAll,
    params: parameter
  })
}

function getBuildAll (parameter) {
  return axios({
    url: URI.getBuildAll,
    params: parameter
  })
}

export default {
  getById,
  getUnitAll,
  getBuildAll,
  getPage,
  del,
  saveOrUpdate
}