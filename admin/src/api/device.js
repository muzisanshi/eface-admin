  import { axios } from '@/utils/request'

const URI = {
  getById: '/device/getById',
  page: '/device/getPage',
  saveOrUpdate: '/device/saveOrUpdate',
  del: '/device/delete',
  cameraDel: '/camera/delete',
  importExcel: '/device/importExcel',
  openGateBrake: '/device/openGateBrake',
  recoverConnect: '/device/recoverConnect',
  rejectConnect: '/device/rejectConnect',
  resetDevice: '/device/resetDevice',
  syncUser: '/device/syncUser',
  exportExcel: '/device/exportExcel'
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

function cameraDel (parameter) {
  return axios({
    url: URI.cameraDel,
    params: parameter
  })
}

function importExcel (parameter) {
  return axios({
    url: URI.importExcel,
    params: parameter
  })
}

function exportExcel (parameter) {
  return axios({
    url: URI.importExcel,
    params: parameter
  })
}

function openGateBrake (parameter) {
  return axios({
    url: URI.openGateBrake,
    params: parameter
  })
}

function recoverConnect (parameter) {
  return axios({
    url: URI.recoverConnect,
    params: parameter
  })
}

function rejectConnect (parameter) {
  return axios({
    url: URI.rejectConnect,
    params: parameter
  })
}

function syncUser (parameter) {
  return axios({
    url: URI.syncUser,
    params: parameter
  })
}

function resetDevice (parameter) {
  return axios({
    url: URI.resetDevice,
    params: parameter
  })
}

export default {
  getById,
  getPage,
  del,
  saveOrUpdate,
  importExcel,
  exportExcel,
  cameraDel,
  openGateBrake,
  recoverConnect,
  rejectConnect,
  resetDevice,
  syncUser
}