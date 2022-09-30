import request from '@/utils/request'
import API from '@/api/url'

// 胶料配料标准管理接口函数
export function rubber_material_url(method, id = null, data = {}) {
  var v_url = ''
  if (id) {
    v_url = API.RubberMaterialUrl + id + '/'
  } else {
    v_url = API.RubberMaterialUrl
  }
  const obj = {
    url: v_url,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 配方数据发送至上辅机接口函数
export function send_auxiliary_url(method, data = {}) {
  const obj = {
    url: API.SendAuxiliaryUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// SITE(配方)接口函数
export function SITE_global_url(method, data = {}) {
  const obj = {
    url: API.SITEGlobalUrl + '?all=1&class_name=SITE',
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 胶料段次接口函数
export function stage_global_url(method, data = {}) {
  const obj = {
    url: API.StageGlobalUrl + '?all=1&class_name=胶料段次',
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 工厂、产地接口函数
export function site_url(method, data = {}) {
  const obj = {
    url: API.SiteGlobalUrl + '?all=1&class_name=产地',
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 胶料编码接口函数
export function product_info_url(method, data = {}) {
  const obj = {
    url: API.ProductInfosUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 点击生成或配料之前进行版本验证接口函数
export function validate_versions_url(method, data = {}) {
  const obj = {
    url: API.ValidateVersionsUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 炼胶机类型接口函数
export function equip_category_url(method, data = {}) {
  const obj = {
    url: API.EquipCategoryUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 原材料接口函数
export function materials_url(method, data = {}) {
  const obj = {
    url: API.MaterialsUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function xlRecipeNotice(method, data = {}) {
  const obj = {
    url: API.XlRecipeNotice,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 原材料类型接口函数
export function materials_type_url(method, data = {}) {
  const obj = {
    url: API.MaterialTypelUrl + '?all=1&class_name=原材料类别',
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function replaceRecipeOne(method, id, data = {}) {
  const obj = {
    url: id ? API.ReplaceRecipeOne + id + '/' : API.ReplaceRecipeOne,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function wfProductBatching(method, id, data = {}) {
  const obj = {
    url: id ? API.WfProductBatching + id + '/' : API.WfProductBatching,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
