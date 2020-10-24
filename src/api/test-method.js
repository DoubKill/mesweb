import request from '@/utils/request'
import API from '@/api/url'

export function testMethodList(method, id, data = {}) {
  const obj = {
    url: id ? API.TestSubTypes + id + '/' : API.TestSubTypes,
    method
  }
  Object.assign(obj, data)
  return request(obj)
}

