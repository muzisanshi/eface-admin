import { axios } from '@/utils/request'

const URI = {
  save: '/user/save'
}

function save (parameter) {
  return axios({
    url: URI.save,
    params: parameter
  })
}

export default {
  save
}
