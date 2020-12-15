import request from '@/utils/request'
import API from '@/api/url'

export function getCountSpareInventory(params) {
  return request({
    url: API.CountSpareInventory,
    method: 'get',
    params
  })
}
