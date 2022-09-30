import request from '@/utils/request'
import API from '@/api/url'

export function getMaterialInventoryManage(params) {
  return request({
    url: API.MaterialInventoryManage,
    method: 'get',
    params
  })
}
export function bzMixinInventory(params) {
  return request({
    url: API.BzMixinInventory,
    method: 'get',
    params
  })
}
export function bzFinalInventory(params) {
  return request({
    url: API.BzFinalInventory,
    method: 'get',
    params
  })
}
export function wmsStorage(params) {
  return request({
    url: API.WmsStorage,
    method: 'get',
    params
  })
}
export function thStorage(params) {
  return request({
    url: API.ThStorage,
    method: 'get',
    params
  })
}
export function wmsExpireDetails(params) {
  return request({
    url: API.WmsExpireDetails,
    method: 'get',
    params
  })
}
export function thExpireDetails(params) {
  return request({
    url: API.ThExpireDetails,
    method: 'get',
    params
  })
}
export function wmsExpireDetailsDown(params) {
  return request({
    url: API.WmsExpireDetails,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
export function thExpireDetailsDown(params) {
  return request({
    url: API.ThExpireDetails,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function bzMixinInventoryDown(params) {
  return request({
    url: API.BzMixinInventory,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
export function bzFinalInventoryDown(params) {
  return request({
    url: API.BzFinalInventory,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
export function wmsStorageDown(params) {
  return request({
    url: API.WmsStorage,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
export function thStorageDown(params) {
  return request({
    url: API.ThStorage,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
export function productExpiresDetailsDown(params) {
  return request({
    url: API.ProductExpiresDetails,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
export function productExpiresDetails(params) {
  return request({
    url: API.ProductExpiresDetails,
    method: 'get',
    params
  })
}
