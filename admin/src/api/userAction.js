import { axios } from '@/utils/request'

const URI = {
  rePush: '/userAction/rePush',
  page: '/userAction/getPage',
  del: '/userAction/delete'
}

function getPage (parameter) {
  return axios({
    url: URI.page,
    params: parameter
  })
}

function rePush (parameter) {
  return axios({
    url: URI.rePush,
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
  rePush,
  getPage,
  del
}
