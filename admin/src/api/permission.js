import { axios } from '@/utils/request'

const URI = {
  page: '/permission/getPage',
  getById: '/permission/getById',
  saveOrUpdate: '/permission/saveOrUpdate',
  getPermissionByToken: '/permission/getPermissionByToken',
  del: '/permission/delete',
  getPermissionsByRoleId: '/permission/getPermissionsByRoleId',
  getPermissionTree: '/permission/getPermissionTree'
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

function getPermissionByToken(parameter) {
  return axios({
    url: URI.getPermissionByToken,
    params: parameter
  })
}

function getPermissionsByRoleId(parameter) {
  return axios({
    url: URI.getPermissionsByRoleId,
    params: parameter
  })
}

function getPermissionTree(parameter) {
  return axios({
    url: URI.getPermissionTree,
    params: parameter
  })
}

export default {
  getPage,
  getById,
  del,
  saveOrUpdate,
  getPermissionByToken,
  getPermissionsByRoleId,
  getPermissionTree
}
