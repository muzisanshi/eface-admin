  import { axios } from '@/utils/request'

const URI = {
  getById: '/ad/getById',
  page: '/ad/getPage',
  getAdItemByIds: '/ad/getAdItemByIds',
  saveOrUpdate: '/ad/saveOrUpdate',
  del: '/ad/delete'
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

function getAdItemByIds (parameter) {
  return axios({
    url: URI.getAdItemByIds,
    params: parameter
  })
}

export default {
  getById,
  getPage,
  del,
  saveOrUpdate,
  getAdItemByIds
}