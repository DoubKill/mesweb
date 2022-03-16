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
export function ImportXlx(method, id, data = {}) {
  const obj = {
    url: id ? API.ImportXlx + id + '/' : API.ImportXlx,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function monthlyOutputStatisticsReport(method, id, data = {}) {
  const obj = {
    url: id ? API.MonthlyOutputStatisticsReport + id + '/' : API.MonthlyOutputStatisticsReport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function performanceSummary(method, id, data = {}) {
  const obj = {
    url: id ? API.PerformanceSummary + id + '/' : API.PerformanceSummary,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function performanceSubsidy(method, id, data = {}) {
  const obj = {
    url: id ? API.PerformanceSubsidy + id + '/' : API.PerformanceSubsidy,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function independentPostTemplate(method, id, data = {}) {
  const obj = {
    url: id ? API.IndependentPostTemplate + id + '/' : API.IndependentPostTemplate,
    method: method,
    responseType: 'blob'
  }
  Object.assign(obj, data)
  return request(obj)
}
export function independentPostTemplatePOST(method, id, data = {}) {
  const obj = {
    url: id ? API.IndependentPostTemplate + id + '/' : API.IndependentPostTemplate,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function wmsOutTaskDetails(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsOutTaskDetails + id + '/' : API.WmsOutTaskDetails,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function wmsOutTasks(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsOutTasks + id + '/' : API.WmsOutTasks,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function wmsCancelTask(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsCancelTask + id + '/' : API.WmsCancelTask,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function wmsOutboundOrder(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsOutboundOrder + id + '/' : API.WmsOutboundOrder,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function thOutTaskDetails(method, id, data = {}) {
  const obj = {
    url: id ? API.ThOutTaskDetails + id + '/' : API.ThOutTaskDetails,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function thOutTasks(method, id, data = {}) {
  const obj = {
    url: id ? API.ThOutTasks + id + '/' : API.ThOutTasks,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function thCancelTask(method, id, data = {}) {
  const obj = {
    url: id ? API.ThCancelTask + id + '/' : API.ThCancelTask,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function thOutboundOrder(method, id, data = {}) {
  const obj = {
    url: id ? API.ThOutboundOrder + id + '/' : API.ThOutboundOrder,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
