import request from '@/utils/request'
import API from '@/api/url'

// 生成计划管理---原材料需求量 接口函数
export function material_quantity_url(method, data = {}) {
  const obj = {
    url: API.MaterialQuantityDemandedUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 班次 接口函数
export function class_arrange_url(method, data = {}) {
  const obj = {
    url: API.ClassArrangelUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 生产管理---密炼机台别计划对比 接口函数
export function banbury_plan_url(method, data = {}) {
  const obj = {
    url: API.BanburyPlanUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 库存管理---原料库存 接口函数
export function material_repertory_url(method, data = {}) {
  const obj = {
    url: API.MaterialRepertoryUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 原材料类型接口函数
export function materials_type_url(method, data = {}) {
  const obj = {
    url: API.MaterialTypelUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// //库存管理---胶料库存 接口函数
export function rubber_repertory_url(method, data = {}) {
  const obj = {
    url: API.RubberRepertoryUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 胶料段次接口函数
export function stage_global_url(method, data = {}) {
  const obj = {
    url: API.StageGlobalUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function getEquip(params) {
  return request({
    url: API.EquipUrl,
    method: 'get',
    params
  })
}

export function getProcesses() {
  return request({
    url: API.GlobalCodesUrl,
    method: 'get',
    params: {
      all: 1,
      class_name: '工序'
    }
  })
}
