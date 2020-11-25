import request from '@/utils/request'
import API from '@/api/url'

// 发货计划
export function getDispatchPlan(params) {
  return request({
    url: API.DispatchPlan,
    method: 'get',
    params
  })
}
export function postDispatchPlan(data) {
  return request({
    url: API.DispatchPlan,
    method: 'post',
    data
  })
}
export function putDispatchPlan(data, id) {
  return request({
    url: API.DispatchPlan + id + '/',
    method: 'put',
    data
  })
}
export function deleteDispatchPlan(id) {
  return request({
    url: API.DispatchPlan + id + '/',
    method: 'delete'
  })
}

// 目的地
export function getDispatchLocation(params) {
  return request({
    url: API.DispatchLocation,
    method: 'get',
    params
  })
}
export function postDispatchLocation(data) {
  return request({
    url: API.DispatchLocation,
    method: 'post',
    data
  })
}
export function putDispatchLocation(data, id) {
  return request({
    url: API.DispatchLocation + id + '/',
    method: 'put',
    data
  })
}
export function deleteDispatchLocation(id) {
  return request({
    url: API.DispatchLocation + id + '/',
    method: 'delete'
  })
}

// 发货履历详情
export function getDispatchLog(params) {
  return request({
    url: API.DispatchLog,
    method: 'get',
    params
  })
}
