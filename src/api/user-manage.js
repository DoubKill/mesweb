import request from '@/utils/request'
import API from '@/api/url'

export function getPersonnels(params) {
  return request({
    url: API.PersonnelsUrl,
    method: 'get',
    params
  })
}

export function postPersonnels(data) {
  return request({
    url: API.PersonnelsUrl,
    method: 'post',
    data
  })
}

export function putPersonnels(data, id) {
  return request({
    url: API.PersonnelsUrl + id + '/',
    method: 'put',
    data
  })
}

export function deletePersonnels(id) {
  return request({
    url: API.PersonnelsUrl + id + '/',
    method: 'delete'
  })
}

export function getPermission() {
  return request({
    url: API.PermissionUrl,
    method: 'get'
  })
}

export function getGroup() {
  return request({
    url: API.GroupUrl,
    method: 'get'
  })
}
