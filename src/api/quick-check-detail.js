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

export function testResultHistory(test_order_id) {
  return request({
    url: API.testResultHistoryUrl,
    method: 'get',
    params: {
      test_order_id
    }
  })
}

export function palletFeedTest(query) {
  return request({
    url: API.PalletFeedTestUrl,
    method: 'get',
    params: query
  })
}

export function changelValidTime(id, valid_time) {
  return request({
    url: API.MaterialValidTimeUrl,
    method: 'post',
    data: {
      id,
      valid_time
    }
  })
}

export function qualityPalletFeedTest(id, params) {
  return request({
    url: API.QualityPalletFeedTest + id + '/',
    method: 'get',
    params
  })
}
