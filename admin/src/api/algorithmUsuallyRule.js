import { axios } from '@/utils/request'

const URI = {
  getById: '/algorithmUsuallyRule/getById',
  page: '/algorithmUsuallyRule/getPage',
  getAll: '/algorithmUsuallyRule/getAll',
  saveOrUpdate: '/algorithmUsuallyRule/saveOrUpdate',
  del: '/algorithmUsuallyRule/delete'
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
