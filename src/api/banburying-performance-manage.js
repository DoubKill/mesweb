import request from '@/utils/request'
import API from '@/api/url'

export function getEquip(params) {
  return request({
    url: API.EquipUrl,
    method: 'get',
    params
  })
}

export function getPalletFeedBacks(params) {
  return request({
    url: API.PalletFeedBacksUrl,
    method: 'get',
    params
  })
}

export function getTrainsFeedbacks(params) {
  return request({
    url: API.TrainsFeedbacksUrl,
    method: 'get',
    params
  })
}

export function getEchartsList(params) {
  return request({
    url: API.EchartsListUrl,
    method: 'get',
    params
  })
}

export function getProductActual(params) {
  return request({
    url: API.ProductActualUrl,
    method: 'get',
    params
  })
}

export function getPalletFeedbacks(params) {
  return request({
    url: API.PalletFeedbacksUrl,
    method: 'get',
    params
  })
}

export function postProductDayPlanNotice(id) {
  return request({
    url: API.ProductDayPlanNoticeUrl,
    method: 'post',
    id
  })
}
