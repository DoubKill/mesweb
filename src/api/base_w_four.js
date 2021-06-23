import request from '@/utils/request'
import API from '@/api/url'

export function materialReportEquip(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialReportEquip + id + '/' : API.MaterialReportEquip,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialReportValue(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialReportValue + id + '/' : API.MaterialReportValue,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function productReportEquip(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductReportEquip + id + '/' : API.ProductReportEquip,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function productReportValue(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductReportValue + id + '/' : API.ProductReportValue,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
