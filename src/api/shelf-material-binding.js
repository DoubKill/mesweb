import request from '@/utils/request'
import API from '@/api/url'

export function getMaterialLocationBinding(params) {
  return request({
    url: API.MaterialLocationBinding,
    method: 'get',
    params
  })
}

export function postMaterialLocationBinding(data) {
  return request({
    url: API.MaterialLocationBinding,
    method: 'post',
    data
  })
}

export function putMaterialLocationBinding(data, id) {
  return request({
    url: API.MaterialLocationBinding + id + '/',
    method: 'put',
    data
  })
}

export function deleteMaterialLocationBinding(id) {
  return request({
    url: API.MaterialLocationBinding + id + '/',
    method: 'delete'
  })
}
