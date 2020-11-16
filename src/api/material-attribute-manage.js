import request from '@/utils/request'
import API from '@/api/url'

export function getMaterialsAttribute(params) {
  return request({
    url: API.MaterialsUrl,
    method: 'get',
    params
  })
}

export function postMaterialsAttribute(data) {
  return request({
    url: API.materialsAttribute,
    method: 'post',
    data
  })
}

export function getBarCode(params) {
  return request({
    url: API.materialsSupplier,
    method: 'get',
    params
  })
}

export function postBarCode(data) {
  return request({
    url: API.materialsSupplier,
    method: 'post',
    data
  })
}

export function deleteBarCode(id) {
  return request({
    url: API.materialsSupplier + id + '/',
    method: 'delete'
  })
}
