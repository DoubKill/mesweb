import request from '@/utils/request'
import API from '@/api/url'

export function getGroup(params) {
  return request({
    url: API.GroupUrl,
    method: 'get',
    params
  })
}

export function postGroup(data) {
  return request({
    url: API.GroupUrl,
    method: 'post',
    data
  })
}

export function putGroup(data, id) {
  return request({
    url: API.GroupUrl + id + '/',
    method: 'put',
    data
  })
}

export function deleteGroup(id) {
  return request({
    url: API.GroupUrl + id + '/',
    method: 'delete'
  })
}

export function getPermission() {
  return request({
    url: API.PermissionUrl,
    method: 'get'
  })
}

