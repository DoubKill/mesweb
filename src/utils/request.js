import axios from 'axios'
import router from '@/router'
import {
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
import Cookies from 'js-cookie'

let currentUrl = ''
// create an axios instance
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/' : '/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000000000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const _user = store.getters.name
    const _newUser = Cookies.get('name')
    if (config.responseType) {
      const routeName = router.history.current.meta.title
      // 走进来的是导出 掉接口记录当前操作
      const a = axios.create({
        baseURL: process.env.NODE_ENV === 'production' ? '/' : '/api',
        timeout: 10000000000
      })
      a.interceptors.request.use(config => {
        if (store.getters.token && getToken()) {
          config.headers['Authorization'] = 'JWT ' + getToken()
        }
        return config
      })
      a({ url: '/api/v1/system/user-operation-log/', method: 'post', data: { 'operator': _newUser, 'menu_name': routeName, 'operations': `导出：${routeName}列表` }})
    }

    if (_user && _newUser && _user !== _newUser) {
      Message({
        message: '当前账号已退出，请刷新页面',
        type: 'error',
        duration: 3 * 1000
      })
      return
    }
    if (store.getters.token && getToken()) {
      config.headers['Authorization'] = 'JWT ' + getToken()
    }
    currentUrl = config.responseType || false
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.status < 300) {
      const res = response.data
      return Promise.resolve(res)
    } else {
      Message({
        message: '请求失败' + response.status,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response.status && error.response.status === 401) {
      Message({
        message: '登录过期',
        type: 'error',
        duration: 3 * 1000
      })
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject()
    }
    if (error.response.status && error.response.status === 403) {
      Message({
        message: '权限不足',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject()
    }
    if (Object.prototype.toString.call(error.response.data) === '[object Object]') {
      const obj = error.response.data
      let str = ''
      if (obj && Object.prototype.hasOwnProperty.call(obj, 'batching_details')) {
        obj.batching_details.forEach(details => {
          for (const key in details) {
            str += details[key]
          }
        })
      } else {
        for (const key in obj) {
          if (!(obj[key] instanceof Array)) {
            str += obj[key]
          } else {
            obj[key].forEach(element => {
              if (Object.prototype.toString.call(element) === '[object Object]') {
                for (const key in element) {
                  str += element[key]
                }
              } else {
                str += element
              }
            })
          }
        }
      }
      // if (obj.detail && obj.detail === '无效页面。') {
      //   return Promise.resolve({ results: [] })
      // }
      Message({
        message: str,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error.response.data)
    } else if (Object.prototype.toString.call(error.response.data) === '[object Array]') {
      let str = ''
      error.response.data.forEach(errorData => {
        let obj = null
        if (errorData) {
          try {
            obj = JSON.parse(errorData)
          } catch (e) {
            obj = errorData
          }
        }

        if (errorData && Object.prototype.hasOwnProperty.call(obj, 'non_field_errors')) {
          str += (`${obj.non_field_errors.join(',')}\n`)
        } else if (Object.prototype.hasOwnProperty.call(obj, 'batching_details')) {
          obj.batching_details.forEach(details => {
            if (details && Object.prototype.hasOwnProperty.call(details, 'non_field_errors')) {
              str += (`${details.non_field_errors.join(',')}\n`) + ';'
            } else {
              str += details
            }
          })
        } else {
          str += errorData
        }
        //  else if (Object.prototype.toString.call(error.response.data) === '[object Object]') {
        //   for (const key in obj) {
        //     if (!(obj[key] instanceof Array)) {
        //       str += obj[key]
        //     } else {
        //       obj[key].forEach(element => {
        //         str += element
        //       })
        //     }
        //   }
        // }
      })
      Message({
        message: str,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error.response.data)
    } else if (typeof error.message === 'string') {
      if (currentUrl) {
        const resData = error.response.data
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
          Message({
            message: JSON.parse(fileReader.result)[0],
            type: 'error',
            duration: 3 * 1000
          })
        }
        fileReader.readAsText(resData)
        return Promise.reject(error)
      }
      Message({
        message: error.message,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    } else {
      Message({
        message: '操作错误',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    }
  }
)

export default service
