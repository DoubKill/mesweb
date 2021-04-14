import request from '@/utils/request'
import API from '@/api/url'

export function getProductionPlanRealityAnalysis(params) {
  return request({
    url: API.ProductionPlanRealityAnalysis,
    method: 'get',
    params
  })
}

export function putUpdateCause(data) {
  return request({
    url: API.UpdateCause,
    method: 'put',
    data
  })
}
