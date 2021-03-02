import request from '@/utils/request'
import API from '@/api/url'

export function weighBatchingList(params) {
  return request({
    url: API.WeighBatchingUrl,
    method: 'get',
    params
  })
}

export function weighBatchingInfo(id, params) {
  return request({
    url: API.WeighBatchingUrl + id + '/',
    method: 'get',
    params
  })
}

export function createWeighBatching(id, data) {
  return request({
    url: API.WeighBatchingUrl,
    method: 'post',
    data
  })
}

export function changeWeighBatching(id, data) {
  return request({
    url: API.WeighBatchingUrl + id + '/',
    method: 'put',
    data
  })
}

export function changeUsedType(id, used_type) {
  return request({
    url: API.WeighBatchingUrl + id + '/',
    method: 'patch',
    data: {
      used_type
    }
  })
}

export function productBatchingDetail(product_batching) {
  return request({
    url: API.ProductBatchingDetailUrl,
    method: 'get',
    params: {
      product_batching
    }
  })
}

export function updateWeighCntType(id, data) {
  return request({
    url: API.WeighCntTypeUrl + id + '/',
    method: 'put',
    data
  })
}

export function getWeighCntType(id) {
  return request({
    url: API.WeighCntTypeUrl + id + '/',
    method: 'get'
  })
}

export function batchingClassesPlan(params) {
  return request({
    url: API.BatchingClassesPlanUrl,
    method: 'get',
    params
  })
}

export function changePlanPackage(id, plan_package) {
  return request({
    url: API.BatchingClassesPlanUrl + id + '/',
    method: 'patch',
    data: {
      plan_package
    }
  })
}

export function issueBatchingClassesPlan(data) {
  return request({
    url: API.BatchingClassesEquipPlan,
    method: 'post',
    data
  })
}

export function batchingClassesEquipPlan(params) {
  return request({
    url: API.BatchingClassesEquipPlan,
    method: 'get',
    params
  })
}
