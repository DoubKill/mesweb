import request from '@/utils/request'
import API from '@/api/url'

export function getSpareType(params) {
  return request({
    url: API.SparepartsSpareType,
    method: 'get',
    params
  })
}

export function postSpareType(data) {
  return request({
    url: API.SparepartsSpareType,
    method: 'post',
    data
  })
}

export function putSpareType(data, id) {
  return request({
    url: API.SparepartsSpareType + id + '/',
    method: 'put',
    data
  })
}

export function deleteSpareType(id) {
  return request({
    url: API.SparepartsSpareType + id + '/',
    method: 'delete'
  })
}
