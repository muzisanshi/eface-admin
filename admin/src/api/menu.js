import { axios } from '@/utils/request'

const URI = {
  page: '/menu/getPage',
  getById: '/menu/getById',
  saveOrUpdate: '/menu/saveOrUpdate',
  getMenuTree: '/menu/getMenuTree',
  del: '/menu/delete'
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

function getMenuTree(parameter) {
  return axios({
    url: URI.getMenuTree,
    params: parameter
  })
}

export default {
  getPage,
  getById,
  del,
  saveOrUpdate,
  getMenuTree
}
