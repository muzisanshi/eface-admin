import {axios} from '@/utils/request'

const URI = {
  getById: '/taskSchedule/getById',
  page: '/taskSchedule/getPage',
  pauseAll: '/taskSchedule/pauseAll',
  resumeAll: '/taskSchedule/resumeAll',
  saveOrUpdate: '/taskSchedule/saveOrUpdate',
  del: '/taskSchedule/delete',
  executeJob: '/taskSchedule/executeJob'
}

function getPage (parameter) {
  return axios({
    url: URI.page,
    params: parameter
  })
}

function getById (parameter) {
  return axios({
    url: URI.getById,
    params: parameter
  })
}

function saveOrUpdate (parameter) {
  return axios({
    url: URI.saveOrUpdate,
    params: parameter
  })
}

function del (parameter) {
  return axios({
    url: URI.del,
    params: parameter
  })
}

function pauseAll (parameter) {
  return axios({
    url: URI.pauseAll,
    params: parameter
  })
}

function resumeAll (parameter) {
  return axios({
    url: URI.resumeAll,
    params: parameter
  })
}

function executeJob (parameter) {
  return axios({
    url: URI.executeJob,
    params: parameter
  })
}

export default {
  getById,
  pauseAll,
  resumeAll,
  getPage,
  del,
  saveOrUpdate,
  executeJob
}