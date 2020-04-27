import { axios } from '@/utils/request'

const URI = {
  getById: '/deviceFactory/getById',
  page: '/deviceFactory/getPage',
  getAll: '/deviceFactory/getAll',
  importExcel: '/deviceFactory/importExcel',
  exportExcel: '/deviceFactory/exportExcel',
  saveOrUpdate: '/deviceFactory/saveOrUpdate',
  del: '/deviceFactory/delete'
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

function getAll (parameter) {
  return axios({
    url: URI.getAll,
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
  getAll,
  importExcel,
  exportExcel
}
