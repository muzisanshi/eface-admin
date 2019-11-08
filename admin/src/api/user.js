import {axios} from '@/utils/request'

const URI = {
  login: '/manager/login',
  logout: '/mock/auth/logout',
  info: '/mock/user/info',
  getUserInfo: '/manager/getInfo',
  updateInfo:'/manager/update',
  queryPermissionsByUser:'/mock/user/queryPermissionsByUser',
  genVerifyCode:'/manager/genVerifyCode'
}

function login (parameter) {
  return axios({
    url: URI.login,
    params: parameter
  })
}

function getInfo () {
  return axios({
    url: URI.info
  })
}

function logout () {
  return axios({
    url: URI.logout
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

function queryPermissionsByUser (parameter) {
  return axios({
    url: URI.queryPermissionsByUser,
    params: parameter
  })
}

function genVerifyCode (parameter) {
  return axios({
    url: URI.genVerifyCode,
    params: parameter
  })
}

export default {
  login,
  logout,
  getInfo,
  getUserInfo,
  updateInfo,
  queryPermissionsByUser,
  genVerifyCode
}