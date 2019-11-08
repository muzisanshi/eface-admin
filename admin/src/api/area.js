import { axios } from '@/utils/request'

const URI = {
  getById: '/area/getById',
  getAllParent: '/area/getAllParent',
  logicalDelete: '/area/logicalDelete',
  getAll: '/area/getAll',
  page: '/area/getPage',
  saveOrUpdate: '/area/saveOrUpdate',
  del: '/area/delete'
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

function getAll (parameter) {
  return axios({
    url: URI.getAll,
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
  getAll,
  getAllParent,
  logicalDelete,
  getPage,
  del,
  saveOrUpdate
}