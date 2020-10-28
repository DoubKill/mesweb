import request from '@/utils/request'
import API from '@/api/url'

export function editMaterialDeal(method, id, data) {
  const obj = {
    url: id ? API.MaterialDealResultUrl + id + '/' : API.MaterialDealResultUrl,
    method,
    data
  }
  return request(obj)
}

export function materialDealResult(params) {
  return request({
    url: API.MaterialDealResultUrl,
    method: 'get',
    params
  })
}

export function resultStatus() {
  return request({
    url: API.ResultStatusUrl,
    method: 'get'
  })
}

export function dealSuggestion(type_name) {
  return request({
    url: API.DealSuggestionUrl,
    method: 'get',
    params: {
      type_name
    }
  })
}
