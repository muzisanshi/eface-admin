import { axios } from '@/utils/request'

const URI = {
  getEstates: '/cityCheck/getEstates',
  getLatestAbonormalTemperature: '/cityCheck/getLatestAbonormalTemperature',
  getRecRecordPage: '/cityCheck/getRecRecordPage',
  heatDistributeStatistics: '/cityCheck/heatDistributeStatistics',
  heatTrendStatistics: '/cityCheck/heatTrendStatistics',
  industryEpidemicStatistics: '/cityCheck/industryEpidemicStatistics'
}

function getEstates (parameter) {
  return axios({
    url: URI.getEstates,
    params: parameter
  })
}

function getLatestAbonormalTemperature (parameter) {
  return axios({
    url: URI.getLatestAbonormalTemperature,
    params: parameter
  })
}

function getRecRecordPage (parameter) {
  return axios({
    url: URI.getRecRecordPage,
    params: parameter
  })
}

function heatDistributeStatistics (parameter) {
  return axios({
    url: URI.heatDistributeStatistics,
    params: parameter
  })
}

function heatTrendStatistics (parameter) {
  return axios({
    url: URI.heatTrendStatistics,
    params: parameter
  })
}

function industryEpidemicStatistics (parameter) {
  return axios({
    url: URI.industryEpidemicStatistics,
    params: parameter
  })
}
export default {
  getEstates,
  getLatestAbonormalTemperature,
  getRecRecordPage,
  heatDistributeStatistics,
  heatTrendStatistics,
  industryEpidemicStatistics
}