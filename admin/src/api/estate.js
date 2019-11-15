  import { axios } from '@/utils/request'

const URI = {
  getById: '/estate/getById',
  getLimitPage: '/estate/getLimitPage',
  page: '/estate/getPage',
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

function del (parameter) {
  return axios({
    url: URI.del,
    params: parameter
  })
}


function getAllParent (parameter) {
  return axios({
    url: URI.getAllParent,
    params: parameter
  })
}

function getLimitPage (parameter) {
  return axios({
    url: URI.getLimitPage,
    params: parameter
  })
}

function logicalDelete (parameter) {
  return axios({
    url: URI.logicalDelete,
    params: parameter
  })
}

export default {
  getById,
  getLimitPage,
  getAllParent,
  logicalDelete,
  getPage,
  del,
  saveOrUpdate
}