import request from '@/utils/request'
import API from '@/api/url'

export function getBatchMonthStatistics(params) {
  return request({
    url: API.BatchMonthStatistics,
    method: 'get',
    params
  })
}

export function getBatchDayStatistics(params) {
  return request({
    url: API.BatchDayStatistics,
    method: 'get',
    params
  })
}

export function getStatisticHeaders(params) {
  return request({
    url: API.StatisticHeaders,
    method: 'get',
    params
  })
}

export function getBatchProductNoMonthStatistics(params) {
  return request({
    url: API.BatchProductNoMonthStatistics,
    method: 'get',
    params
  })
}

export function getBatchProductNoDayStatistics(params) {
  return request({
    url: API.BatchProductNoDayStatistics,
    method: 'get',
    params
  })
}
