import { axios } from '@/utils/request'

const URI = {
  getById: '/country/getById',
  page: '/country/getPage',
  getAll: '/country/getAll',
  saveOrUpdate: '/country/saveOrUpdate',
  del: '/country/delete'
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
  saveOrUpdate,
  getAll
}
