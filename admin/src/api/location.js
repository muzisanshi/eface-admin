  import { axios } from '@/utils/request'

const URI = {
  getById: '/location/getById',
  page: '/location/getPage',
  saveOrUpdate: '/location/saveOrUpdate',
  del: '/location/delete'
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
  getById,
  getPage,
  del,
  saveOrUpdate
}