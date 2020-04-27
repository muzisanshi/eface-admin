import {axios} from '@/utils/request'

const URI = {
  getConstantsEnumData: '/../orgService/getConstantsEnumData'
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
