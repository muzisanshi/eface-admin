import {axios} from '@/utils/request'

const URI = {
  getById: '/manager/getById',
  page: '/manager/getPage',
  saveOrUpdate: '/manager/saveOrUpdate',
  del: '/manager/delete',
  getInfo: '/manager/getInfo',
  update: '/manager/update',
  updatePassword: '/manager/updatePassword',
  logout: '/manager/logout'
}

// 用户管理---wg-2019/6/24
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


function del(parameter) {
  return axios({
    url: URI.del,
    params: parameter
  })
}

function getInfo (parameter) {
  return axios({
    url: URI.getInfo,
    params: parameter
  })
}

function update (parameter) {
  return axios({
    url: URI.update,
    params: parameter
  })
}

function updatePassword(parameter) {
  return axios({
    url: URI.updatePassword,
    params: parameter
  })
}

function logout(parameter) {
  return axios({
    url: URI.logout,
    params: parameter
  })
}

export default {
  getById,
  getPage,
  del,
  saveOrUpdate,
  getInfo,
  update,
  updatePassword,
  logout
}