import request from '@/utils/request'
import API from '@/api/url'

export function getCountSpareInventory(params) {
  return request({
    url: API.CountSpareInventory,
    method: 'get',
    params
  })
}

export function getSpareInventoryImportExport(params) {
  return request({
    url: API.SpareInventoryImportExport,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function postSpareInventoryImportExport(data) {
  return request({
    url: API.SpareInventoryImportExport,
    method: 'post',
    data
  })
}
