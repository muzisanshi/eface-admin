import { axios } from '@/utils/request'

const URI = {
  getById: '/estate/getById',
  getLimitPage: '/estate/getLimitPage',
  page: '/estate/getPage',
  getAll: '/estate/getAll',
  saveOrUpdate: '/estate/saveOrUpdate',
  del: '/estate/delete'
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

function getAll (parameter) {
  return axios({
    url: URI.getAll,
    params: parameter
  })
}

function del (parameter) {
  return axios({
    url: URI.del,
    params: parameter
  })
}

function getLimitPage (parameter) {
  return axios({
    url: URI.getLimitPage,
    params: parameter
  })
}

export default {
  getById,
  getLimitPage,
  getAll,
  getPage,
  del,
  saveOrUpdate
}
