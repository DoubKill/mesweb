import request from '@/utils/request'
import API from '@/api/url'

export function roles(method, id, data = {}) {
  const obj = {
    url: id ? API.GroupUrl + id + '/' : API.GroupUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

