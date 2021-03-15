import request from '@/utils/request'
import API from '@/api/url'

export function barcodeQuality(method, id, data = {}) {
  const obj = {
    url: id ? API.BarcodeQuality + id + '/' : API.BarcodeQuality,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function barcodeQualityExport(params) {
  return request({
    url: API.BarcodeQualityExport,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// export function barcodeQualityChange(method, data) {
//   return request({
//     url: API.BarcodeQuality,
//     method: method,
//     data
//   })
// }
