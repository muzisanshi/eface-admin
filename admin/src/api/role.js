import { axios } from '@/utils/request'

const URI = {
  page: '/role/getPage',
  getById: '/role/getById',
  saveOrUpdate: '/role/saveOrUpdate',
  getAll: '/role/getAll',
  del: '/role/delete',
  authorize: '/role/authorize',
  getPermissionsById: '/role/getPermissionsById'
}

function getPage(parameter) {
  return axios({
    url: URI.page,
    params: parameter
  })
}

function getById(parameter) {
  return axios({
    url: URI.getById,
    params: parameter
  })
}

function saveOrUpdate(parameter) {
  return axios({
    url: URI.saveOrUpdate,
    params: parameter
  })
}

function del(parameter) {
  return axios({
    url: URI.del,
    params: parameter
  })
}

function getAll(parameter) {
  return axios({
    url: URI.getAll,
    params: parameter
  })
}

function authorize(parameter) {
  return axios({
    url: URI.authorize,
    params: parameter
  })
}

function getPermissionsById(parameter) {
  return axios({
    url: URI.getPermissionsById,
    params: parameter
  })
}

export default {
  getPage,
  getById,
  del,
  saveOrUpdate,
  getAll,
  authorize,
  getPermissionsById
}
