import request from '@/utils/request'
import API from '@/api/url'

export function getTestIndicators(params) {
  return request({
    url: API.TestIndicators,
    method: 'get',
    params
  })
}

export function postTestIndicators(data) {
  return request({
    url: API.TestIndicators,
    method: 'post',
    data
  })
}

export function putTestIndicators(data, id) {
  return request({
    url: API.TestIndicators + id + '/',
    method: 'put',
    data
  })
}
