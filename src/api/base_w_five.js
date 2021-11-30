import request from '@/utils/request'
import API from '@/api/url'
export function equipWarehouseRecord(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipWarehouseRecord + id + '/' : API.EquipWarehouseRecord,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function equipWarehouseStatistical(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipWarehouseStatistical + id + '/' : API.EquipWarehouseStatistical,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function wmsExpireList(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsExpireList + id + '/' : API.WmsExpireList,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function thExpireList(method, id, data = {}) {
  const obj = {
    url: id ? API.ThExpireList + id + '/' : API.ThExpireList,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function weightingPackageSingle(method, id, data = {}) {
  const obj = {
    url: id ? API.WeightingPackageSingle + id + '/' : API.WeightingPackageSingle,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function getManualInfo(method, id, data = {}) {
  const obj = {
    url: id ? API.GetManualInfo + id + '/' : API.GetManualInfo,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function weightingPackageManua(method, id, data = {}) {
  const obj = {
    url: id ? API.WeightingPackageManua + id + '/' : API.WeightingPackageManua,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function getMaterialTolerance(method, id, data = {}) {
  const obj = {
    url: id ? API.GetMaterialTolerance + id + '/' : API.GetMaterialTolerance,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
