  import { axios } from '@/utils/request'

const URI = {
  getAll: '/nationalAreaCode/getAll'
}

function getAll (parameter) {
  return axios({
    url: URI.getAll,
    params: parameter
  })
}

export default {
  getAll
}