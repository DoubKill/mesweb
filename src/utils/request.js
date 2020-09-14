import axios from 'axios'
import router from '@/router'
import {
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: '/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000000000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'JWT ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    return Promise.resolve(res)
  },
  error => {
    if (error.response.status && error.response.status === 403) {
      Message({
        message: '登录过期',
        type: 'error',
        duration: 3 * 1000
      })
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject()
    }
    if (Object.prototype.toString.call(error.response.data) === '[object Object]') {
      const obj = error.response.data
      let str = ''
      for (const key in obj) {
        if (!(obj[key] instanceof Array)) {
          str += obj[key]
        } else {
          obj[key].forEach(element => {
            str += element
          })
        }
      }
      Message({
        message: str,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error.response.data)
    } else if (Object.prototype.toString.call(error.response.data) === '[object Array]') {
      // eslint-disable-next-line no-unused-vars
      let str = ''
      if (Object.prototype.toString.call(error.response.data[0]) === '[object Object]') {
        // 数组里面是对象
        error.response.data.forEach(D => {
          for (const key in D) {
            if (!(D[key] instanceof Array)) {
              str += D[key]
            } else {
              D[key].forEach(element => {
                str += element
              })
            }
          }
        })
        // const obj = error.response.data
        // eslint-disable-next-line no-unused-vars
      } else {
        str = error.response.data.join(',')
      }
      // Message({
      //   message: str,
      //   type: 'error',
      //   duration: 3 * 1000
      // })
      // 返回[{aa:'為填寫'}]，页面需处理到对应的输入变红提示
      return Promise.reject(error.response.data)
    } else if (typeof error.message === 'string') {
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
