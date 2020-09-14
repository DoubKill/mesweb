import request from '@/utils/request'
import API from '@/api/url'

// 设备种类接口函数
export function category_manage_url(method, id = null, data = {}) {
  var v_url = ''
  if (id) {
    v_url = API.EquipCategoryUrl + id + '/'
  } else {
    v_url = API.EquipCategoryUrl
  }
  const obj = {
    url: v_url,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 设备类型接口函数
export function equip_type_url(method, data = {}) {
  const obj = {
    url: API.EquipTypeGlobalUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 工序接口函数
export function process_global_url(method, data = {}) {
  const obj = {
    url: API.EquipProcessGlobalUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 设备接口函数
export function equip_manage_url(method, id = null, data = {}) {
  var v_url = ''
  if (id) {
    v_url = API.EquipUrl + id + '/'
  } else {
    v_url = API.EquipUrl
  }
  const obj = {
    url: v_url,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 设备层级(产地)接口函数
export function equip_level_url(method, data = {}) {
  const obj = {
    url: API.EquipLevelGlobalUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 设备种类接口函数
export function equip_category_url(method, data = {}) {
  const obj = {
    url: API.EquipCategoryUrl + '?all=1',
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
