  import { axios } from '@/utils/request'

const URI = {
  page: '/recRecord/getPage'
}

function getPage (parameter) {
  return axios({
    url: URI.page,
    params: parameter
  })
}

export default {
  getPage
}