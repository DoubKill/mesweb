import request from '@/utils/request'
import API from '@/api/url'

export function testMethodList(params) {
  return request({
    url: API.TestSubTypes,
    method: 'get',
    params
  })
}

export function editTestMethod(method, id, data = {}) {
  const obj = {
    url: id ? API.TestSubTypes + id + '/' : API.TestSubTypes,
    method,
    data
  }
  return request(obj)
}

