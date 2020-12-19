import request from '@/utils/request'
import API from '@/api/url'

export function locationNameList(method, id, data = {}) {
  const obj = {
    url: id ? API.LocationNameList + id + '/' : API.LocationNameList,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function spareInventory(method, id, data = {}) {
  const obj = {
    url: id ? API.SpareInventory + id + '/' : API.SpareInventory,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function putStorage(method, id, data = {}) {
  const obj = {
    url: (id ? API.SpareInventory + id + '/' : API.SpareInventory) + 'put_storage/',
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function spareInventoryLog(method, id, data = {}) {
  const obj = {
    url: id ? API.SpareInventoryLog + id + '/' : API.SpareInventoryLog,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function outStorage(method, id, data = {}) {
  // 出库
  const obj = {
    url: (id ? API.SpareInventory + id + '/' : API.SpareInventory) + 'out_storage/',
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function sparepartsSpareType(method, id, data = {}) {
  const obj = {
    url: id ? API.SparepartsSpareType + id + '/' : API.SparepartsSpareType,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function sparepartsSpare(method, id, data = {}) {
  const obj = {
    url: id ? API.SparepartsSpare + id + '/' : API.SparepartsSpare,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
