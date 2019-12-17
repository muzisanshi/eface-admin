import { axios } from '@/utils/request'

const URI = {
  login: '/login',
  genVerifyCode: '/genVerifyCode',
  getUserInfo: '/manager/getInfo',
  updateInfo: '/manager/update',
  getById: '/user/getById',
  page: '/user/getPage',
  saveOrUpdate: '/user/saveOrUpdate',
  del: '/user/delete'
}

function login (parameter) {
  return axios({
    url: URI.login,
    params: parameter
  })
}

function getUserInfo () {
  return axios({
    url: URI.getUserInfo
  })
}

function updateInfo (parameter) {
  return axios({
    url: URI.updateInfo,
    params: parameter
  })
}

function genVerifyCode (parameter) {
  return axios({
    url: URI.genVerifyCode,
    params: parameter
  })
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
  login,
  getUserInfo,
  updateInfo,
  genVerifyCode,
  getById,
  getPage,
  del,
  saveOrUpdate
}