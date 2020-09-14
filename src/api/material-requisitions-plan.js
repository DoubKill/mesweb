import request from '@/utils/request'
import API from '@/api/url'

export function materialDemandeds(params) {
  return request({
    url: API.MaterialDemanded,
    method: 'get',
    params
  })
}

export function globalCodes(params) {
  return request({
    url: API.GlobalCodesUrl,
    method: 'get',
    params
  })
}
