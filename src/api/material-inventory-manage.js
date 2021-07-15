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
