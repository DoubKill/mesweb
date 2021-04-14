import request from '@/utils/request'
import API from '@/api/url'

export function getGroup(params) {
  return request({
    url: API.GroupUrl,
    method: 'get',
    params
  })
}

export function getUsersByGroup(params) {
  return request({
    url: API.UsersByGroupUrl,
    method: 'get',
    params
  })
}

export function putGroupAddUser(data, id) {
  return request({
    url: API.GroupAddUserUrl + id + '/',
    method: 'put',
    data
  })
}
