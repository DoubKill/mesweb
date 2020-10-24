import request from '@/utils/request'
import API from '@/api/url'

export function testTypes() {
  return request({
    url: API.TestTypeDataUrl,
    method: 'get'
  })
}

export function materialTestOrders(query) {
  return request({
    url: API.MaterialTestOrdersUrl,
    method: 'get',
    params: query
  })
}
