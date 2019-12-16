import { axios } from '@/utils/request'

const URI = {
  getById: '/appVersion/getById',
  page: '/appVersion/getPage',
  saveOrUpdate: '/appVersion/saveOrUpdate',
  del: '/appVersion/delete'
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

export default {
  getById,
  getPage,
  del,
  saveOrUpdate
}