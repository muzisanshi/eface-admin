import { axios } from '@/utils/request'

const URI = {
  getConstantsEnumData: '/../adminService/getConstantsEnumData'
}

function getEnumData(parameter) {
  return axios({
    url: URI.getConstantsEnumData,
    params: parameter
  })
}

export default {
  getEnumData
}
