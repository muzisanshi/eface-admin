  import { axios } from '@/utils/request'

const URI = {
  heatDistributeStatistics: '/provinceCheck/heatDistributeStatistics',
  heatTrendStatistics: '/provinceCheck/heatTrendStatistics',
  mapStatistics: '/provinceCheck/mapStatistics',
  statistics: '/provinceCheck/statistics'
}

function heatTrendStatistics (parameter) {
  return axios({
    url: URI.heatTrendStatistics,
    params: parameter
  })
}

function heatDistributeStatistics (parameter) {
  return axios({
    url: URI.heatDistributeStatistics,
    params: parameter
  })
}

function statistics (parameter) {
  return axios({
    url: URI.statistics,
    params: parameter
  })
}

function mapStatistics (parameter) {
  return axios({
    url: URI.mapStatistics,
    params: parameter
  })
}

export default {
  heatDistributeStatistics,
  heatTrendStatistics,
  statistics,
  mapStatistics
}