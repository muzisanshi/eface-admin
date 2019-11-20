  import { axios } from '@/utils/request'

const URI = {
  getById: '/device/getById',
  page: '/device/getPage',
  saveOrUpdate: '/device/saveOrUpdate',
  del: '/device/delete',
  importExcel: '/device/importExcel',
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

export default {
  getById,
  getPage,
  del,
  saveOrUpdate,
  importExcel,
  exportExcel
}