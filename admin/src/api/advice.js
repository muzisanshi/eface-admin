import { axios } from '@/utils/request'

const URI = {
  page: '/advice/getPage',
  updateAdviceHandleState: '/advice/updateAdviceHandleState'
}

function getPage (parameter) {
  return axios({
    url: URI.page,
    params: parameter
  })
}

function updateAdviceHandleState (parameter) {
  return axios({
    url: URI.updateAdviceHandleState,
    params: parameter
  })
}

export default {
  getPage,
  updateAdviceHandleState
}
