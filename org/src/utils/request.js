import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import md5 from 'js-md5'

const MOCK_BASE_URL = '/api'

// 创建 axios 实例
const service = axios.create({
  baseURL: MOCK_BASE_URL, // api base_url
  timeout: 1000 // 请求超时时间
})

const err = (error) => {
  if (error + '' === 'Error: Network Error') {
    notification.error({
      message: '网络错误',
      description: '连接服务器失败！'
    })
  } else if (error.response) {
    switch (error.response.status) {
      case 403:
        notification.error({
          message: '403',
          description: '禁止访问！'
        })
        break
      case 404:
        notification.error({
          message: '404',
          description: '请求的资源不存在！'
        })
        break
      case 401:
        notification.error({
          message: '401',
          description: '没有访问权限！'
        })
        const token = sessionStorage.getItem('ACCESS_TOKEN')
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      case 500:
        notification.error({
          message: '500',
          description: '服务器发生错误，请检查服务器！'
        })
        setTimeout(() => {
          window.location.reload()
        }, 5000)
        break
      default:
        notification.error({
          message: error.response.status,
          description: '发生错误'
        })
        setTimeout(() => {
          window.location.reload()
        }, 5000)
        break
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const clientId = 'org-admin'
  const timestamp = new Date().getTime() + ''
  const signature = clientId + timestamp + 'da74588912504563e464ffe8956de786'
  const token = sessionStorage.getItem('ACCESS_TOKEN')
  if (token) {
    config.headers['JWT-MANAGER-ORG-ACCOUNT-AUTHORIZATION'] = token
  }
  config.baseURL = process.env.VUE_APP_ORG_SERVICE_BASE_URL
  config.method = 'post'
  config.timeout = 100000
  if (config.enctype) {
    config.headers['Content-Type'] = config.enctype
  } else {
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
  }
  config.headers['X-clientId'] = clientId
  config.headers['X-timestamp'] = timestamp
  config.headers['X-signature'] = md5(signature)
  const data = config.params
  if (data && data.pageNo) {
    data.page = {
      pageNumber: data.pageNo,
      pageSize: data.pageSize
    }
    delete data.pageNo
  }
  //console.log('request', { baseURL: config.baseURL, url: config.url, method: config.method, data: data })
  config.data = data
  config.params = null
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  const data = response.data
  if (data.respCode !== '00') {
    if (response.config['onFail']) {
      response.config['onFail'].call(data)
    } else {
      if (data.errCode === 'ACCOUNT_NEED_LOGIN' || data.errCode === 'ACCOUNT_LOGIN_EXCEPTION') {
        const token = sessionStorage.getItem('ACCESS_TOKEN')
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
      } else {
        if (data.size) {
          return data
        } else {
          notification.error({
            message: '错误',
            description: data.errDesc
          })
        }
      }
    }
    return Promise.reject(data)
  } else {

    const ret = data.data
    if (ret) {
      if (ret.pageNumber) {
        ret.pageNo = ret.pageNumber
      }
      if (ret.totalPages) {
        ret.totalPage = ret.totalPages
      }
      if (ret.totalElements) {
        ret.totalCount = ret.totalElements
      }
      if (ret.records) {
        ret.data = ret.records
      }
    }

    return ret
  }
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
