import request from '@/utils/request'
import API from '@/api/url'

export function getSpareLocation(params) {
  return request({
    url: API.SpareLocation,
    method: 'get',
    params
  })
}

export function postSpareLocation(data) {
  return request({
    url: API.SpareLocation,
    method: 'post',
    data
  })
}

export function putSpareLocation(data, id) {
  return request({
    url: API.SpareLocation + id + '/',
    method: 'put',
    data
  })
}

export function deleteSpareLocation(id) {
  return request({
    url: API.SpareLocation + id + '/',
    method: 'delete'
  })
}
