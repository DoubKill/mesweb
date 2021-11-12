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
