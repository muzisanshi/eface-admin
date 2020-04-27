  import { axios } from '@/utils/request'

const URI = {
  page: '/userAccount/getPage'
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