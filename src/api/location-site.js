import request from '@/utils/request'
import API from '@/api/url'

export function getLocation(params) {
  return request({
    url: API.Location,
    method: 'get',
    params
  })
}
export function basicsLocationNameList(params) {
  return request({
    url: API.BasicsLocationNameList,
    method: 'get',
    params
  })
}

export function postLocation(data) {
  return request({
    url: API.Location,
    method: 'post',
    data
  })
}

export function putLocation(data, id) {
  return request({
    url: API.Location + id + '/',
    method: 'put',
    data
  })
}

export function deleteLocation(id) {
  return request({
    url: API.Location + id + '/',
    method: 'delete'
  })
}
