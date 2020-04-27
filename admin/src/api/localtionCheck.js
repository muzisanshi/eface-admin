import { axios } from '@/utils/request'

const URI = {
  getHeatUserPage: '/localtionCheck/getHeatUserPage',
  getRecRecordPage: '/localtionCheck/getRecRecordPage',
  heatTrendStatistics: '/localtionCheck/heatTrendStatistics',
  statistics: '/localtionCheck/statistics'
}

function getHeatUserPage (parameter) {
  return axios({
    url: URI.getHeatUserPage,
    params: parameter
  })
}

function getRecRecordPage (parameter) {
  return axios({
    url: URI.getRecRecordPage,
    params: parameter
  })
}

function heatTrendStatistics (parameter) {
  return axios({
    url: URI.heatTrendStatistics,
    params: parameter
  })
}

function statistics (parameter) {
  return axios({
    url: URI.statistics,
    params: parameter
  })
}

export default {
  getHeatUserPage,
  getRecRecordPage,
  heatTrendStatistics,
  statistics
}
