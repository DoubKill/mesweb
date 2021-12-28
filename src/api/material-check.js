import request from '@/utils/request'
import API from '@/api/url'

export function examineMaterial(params) {
  return request({
    url: API.ExamineMaterial,
    method: 'get',
    params
  })
}
export function examineMaterialPost(data) {
  return request({
    url: API.ExamineMaterial,
    method: 'post',
    data
  })
}
export function materialUnqualifiedTypes(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialUnqualifiedTypes + id + '/' : API.MaterialUnqualifiedTypes,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function materialUnqualifiedProcess(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialUnqualifiedProcess + id + '/' : API.MaterialUnqualifiedProcess,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function disqualification(method, id, data = {}) {
  const obj = {
    url: id ? API.Disqualification + id + '/' : API.Disqualification,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function materialExamineResultCurve(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialExamineResultCurve + id + '/' : API.MaterialExamineResultCurve,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
