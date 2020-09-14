import request from '@/utils/request'
import API from '@/api/url'

export function rubberMaterial(params) {
  return request({
    url: API.RubberMaterialUrl,
    method: 'get',
    params
  })
}
