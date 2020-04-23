import { axios } from '@/utils/request'

const URI = {
  getById: '/algorithm/getById'
}

function getById (parameter) {
  return axios({
    url: URI.getById,
    params: parameter
  })
}

export default {
  getById
}
