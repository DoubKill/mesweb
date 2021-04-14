import request from '@/utils/request'
import API from '@/api/url'

export function getTestTypes(params) {
  return request({
    url: API.TestTypes,
    method: 'get',
    params
  })
}

export function postTestTypes(data) {
  return request({
    url: API.TestTypes,
    method: 'post',
    data
  })
}

export function putTestTypes(data, id) {
  return request({
    url: API.TestTypes + id + '/',
    method: 'put',
    data
  })
}

export function deleteTestTypes(id) {
  return request({
    url: API.TestTypes + id + '/',
    method: 'delete'
  })
}

export function getDataPoints(params) {
  return request({
    url: API.DataPoints,
    method: 'get',
    params
  })
}
export function postDataPoints(data) {
  return request({
    url: API.DataPoints,
    method: 'post',
    data
  })
}
export function putDataPoints(data, id) {
  return request({
    url: API.DataPoints + id + '/',
    method: 'put',
    data
  })
}
export function deleteDataPoints(id) {
  return request({
    url: API.DataPoints + id + '/',
    method: 'delete'
  })
}

export function getTestIndicators(params) {
  return request({
    url: API.TestIndicators,
    method: 'get',
    params
  })
}
