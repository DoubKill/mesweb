import request from '@/utils/request'
import API from '@/api/url'

export function getSparepartsSpare(params) {
  return request({
    url: API.SparepartsSpare,
    method: 'get',
    params
  })
}

export function postSparepartsSpare(data) {
  return request({
    url: API.SparepartsSpare,
    method: 'post',
    data
  })
}

export function putSparepartsSpare(data, id) {
  return request({
    url: API.SparepartsSpare + id + '/',
    method: 'put',
    data
  })
}

export function deleteSparepartsSpare(id) {
  return request({
    url: API.SparepartsSpare + id + '/',
    method: 'delete'
  })
}

export function getSpareImportExport(params) {
  return request({
    url: API.SpareImportExport,
    method: 'get',
    params
  })
}

export function postSpareImportExport(data) {
  return request({
    url: API.SpareImportExport,
    method: 'post',
    data
  })
}
