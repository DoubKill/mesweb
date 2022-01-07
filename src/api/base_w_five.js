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
export function xlRecipesInfo(method, id, data = {}) {
  const obj = {
    url: id ? API.XlRecipesInfo + id + '/' : API.XlRecipesInfo,
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
export function wmsSafetySettings(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsSafetySettings + id + '/' : API.WmsSafetySettings,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function thSafetySettings(method, id, data = {}) {
  const obj = {
    url: id ? API.ThSafetySettings + id + '/' : API.ThSafetySettings,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function matTankStatus(method, id, data = {}) {
  const obj = {
    url: id ? API.MatTankStatus + id + '/' : API.MatTankStatus,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function schedulingWashRules(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingWashRules + id + '/' : API.SchedulingWashRules,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function schedulingPlaceKeyword(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingPlaceKeyword + id + '/' : API.SchedulingPlaceKeyword,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function operaKeyword(method, id, data = {}) {
  const obj = {
    url: id ? API.OperaKeyword + id + '/' : API.OperaKeyword,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function schedulingEquipCapacity(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingEquipCapacity + id + '/' : API.SchedulingEquipCapacity,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function schedulingProductDemandedDeclare(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingProductDemandedDeclare + id + '/' : API.SchedulingProductDemandedDeclare,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function schedulingProductSafetyParams(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingProductSafetyParams + id + '/' : API.SchedulingProductSafetyParams,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function schedulingResult(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingResult + id + '/' : API.SchedulingResult,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function scheduleNos(method, id, data = {}) {
  const obj = {
    url: id ? API.ScheduleNos + id + '/' : API.ScheduleNos,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
