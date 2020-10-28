import request from '@/utils/request'
import API from '@/api/url'

export function disposeTypeGlobalType() {
  return request({
    url: API.GlobalTypesUrl,
    method: 'get',
    params: {
      type_name: '处理类型'
    }
  })
}

export function disposeTypes() {
  return request({
    url: API.DisposeTypeUrl,
    method: 'get',
    params: {
      all: 1,
      type_no: 14
    }
  })
}

export function editDisposeType(method, id, data) {
  const obj = {
    url: id ? API.DisposeTypeUrl + id + '/' : API.DisposeTypeUrl,
    method,
    data
  }
  return request(obj)
}

export function dealSuggestion(deal_type) {
  return request({
    url: API.DealSuggestionUrl,
    method: 'get',
    params: {
      deal_type
    }
  })
}

export function editDealSuggestion(method, id, data) {
  const obj = {
    url: id ? API.DealSuggestionUrl + id + '/' : API.DealSuggestionUrl,
    method,
    data
  }
  return request(obj)
}
