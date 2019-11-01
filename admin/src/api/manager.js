import {axios} from '@/utils/request'

const URI = {
  getById: '/manager/getById',
  page: '/manager/getPage',
  saveOrUpdate: '/manager/saveOrUpdate',
  del: '/manager/delete',
  resetPassword: '/manager/resetPassword',
  updatePassword: '/manager/updatePassword'
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

function resetPassword (parameter) {
  return axios({
    url: URI.resetPassword,
    params: parameter
  })
}


function updatePassword(parameter) {
  return axios({
    url: URI.updatePassword,
    params: parameter
  })
}

export default {
  getById,
  getPage,
  del,
  saveOrUpdate,
  resetPassword,
  updatePassword
}