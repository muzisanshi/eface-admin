import { axios } from '@/utils/request'

const URI = {
  page: '/recRecord/getPage',
  getRecImage: '/recRecord/getRecImage'
}

function getPage (parameter) {
  return axios({
    url: URI.page,
    params: parameter
  })
}

function getRecImage (parameter) {
  return axios({
    url: URI.getRecImage,
    params: parameter
  })
}

export default {
  getPage,
  getRecImage
}