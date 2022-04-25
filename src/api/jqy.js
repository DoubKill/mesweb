import request from '@/utils/request'
import API from '@/api/url'

// 投料重量设定模糊查询
export function rawWeight(method, id, data = {}) {
  const obj = {
    url: id ? API.RawWeight + id + '/' : API.RawWeight,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 保存操作
export function saveRawWeight(method, id, data = {}) {
  const obj = {
    url: id ? API.RawWeight + id + '/' : API.RawWeight,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 投料履历查询
export function rawQuery(method, id, data = {}) {
  const obj = {
    url: id ? API.RawQuery + id + '/' : API.RawQuery,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 粉料罐查询
export function pinkSet(method, id, data = {}) {
  const obj = {
    url: id ? API.PinkSet + id + '/' : API.PinkSet,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 粉料罐修改
export function pinkSetPut(method, id, data = {}) {
  const obj = {
    url: id ? API.PinkSet + id + '/' : API.PinkSet,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 油料罐查询
export function oliSet(method, id, data = {}) {
  const obj = {
    url: id ? API.OliSet + id + '/' : API.OliSet,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 油料罐修改
export function oliSetPut(method, id, data = {}) {
  const obj = {
    url: id ? API.OliSet + id + '/' : API.OliSet,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 不合格车次列表查询
export function disposalList(method, id, data = {}) {
  const obj = {
    url: id ? API.DisposalList + id + '/' : API.DisposalList,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 不合格项查询
export function dataPoint(method, id, data = {}) {
  const obj = {
    url: id ? API.DataPoint + id + '/' : API.DataPoint,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 胶片库列表
export function compoundManage(method, id, data = {}) {
  const obj = {
    url: id ? API.CompoundManage + id + '/' : API.CompoundManage,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 出库
export function outbound(method, id, data = {}) {
  const obj = {
    url: id ? API.Outbound + id + '/' : API.Outbound,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 机台别不合格率
export function machinePass(method, id, data = {}) {
  const obj = {
    url: id ? API.MachinePass + id + '/' : API.MachinePass,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 胶料别不合格率
export function rubberPass(method, id, data = {}) {
  const obj = {
    url: id ? API.RubberPass + id + '/' : API.RubberPass,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 班次别不合格率
export function classesPass(method, id, data = {}) {
  const obj = {
    url: id ? API.ClassesPass + id + '/' : API.ClassesPass,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 用户出库口库区
export function userStation(method, id, data = {}) {
  const obj = {
    url: id ? API.UserStation + id + '/' : API.UserStation,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 用户出库口库区
export function runtimeDetail(method, id, data = {}) {
  const obj = {
    url: id ? API.RuntimeDetail + id + '/' : API.RuntimeDetail,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 供应商管理台账
export function equipSupplierList(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipSupplier + id + '/' : API.EquipSupplier,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipSupplierImport(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipSupplierImport + id + '/' : API.EquipSupplierImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipSupplierListDown(params) {
  return request({
    url: API.EquipSupplier,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function equipSupplierGetName(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipSupplierGetName + id + '/' : API.EquipSupplierGetName,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 供应商类别列表
export function getSupplierType(method, id, data = {}) {
  const obj = {
    url: id ? API.GlobalCodesUrl + id + '/' : API.GlobalCodesUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 设备固定资产台账
export function equipPropertyList(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipProperty + id + '/' : API.EquipProperty,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipPropertyImport(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipPropertyImport + id + '/' : API.EquipPropertyImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipPropertyListDown(params) {
  return request({
    url: API.EquipProperty,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 设备部件分类
export function equipComponentType(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipComponentType + id + '/' : API.EquipComponentType,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipComponentTypeImport(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipComponentTypeImport + id + '/' : API.EquipComponentTypeImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipComponentTypeDown(params) {
  return request({
    url: API.EquipComponentType,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 设备位置区域定义
export function equipAreaDefine(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipAreaDefine + id + '/' : API.EquipAreaDefine,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipAreaDefineImport(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipAreaDefineImport + id + '/' : API.EquipAreaDefineImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipAreaDefineDown(params) {
  return request({
    url: API.EquipAreaDefine,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function equipAreaDefineGetName(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipAreaDefineGetName + id + '/' : API.EquipAreaDefineGetName,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 设备部位定义
export function equipPartNew(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipPartNew + id + '/' : API.EquipPartNew,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipPartNewImport(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipPartNewImport + id + '/' : API.EquipPartNewImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipPartNewDown(params) {
  return request({
    url: API.EquipPartNew,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 设备类型
export function equipsCategory(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipsCategory + id + '/' : API.EquipsCategory,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 设备部件定义
export function equipComponent(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipComponent + id + '/' : API.EquipComponent,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipComponentImport(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipComponentImport + id + '/' : API.EquipComponentImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipComponentDown(params) {
  return request({
    url: API.EquipComponent,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 部件与erp绑定关系
export function erpSpareComponentRelation(method, id, data = {}) {
  const obj = {
    url: id ? API.ErpSpareComponentRelation + id + '/' : API.ErpSpareComponentRelation,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// erp备件物料信息
export function equipSpareErp(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipSpareErp + id + '/' : API.EquipSpareErp,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipSpareErpImport(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipSpareErpImport + id + '/' : API.EquipSpareErpImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipSpareErpDown(params) {
  return request({
    url: API.EquipSpareErp,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 设备故障信号定义
export function equipFaultSignal(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipFaultSignal + id + '/' : API.EquipFaultSignal,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipFaultSignalImport(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipFaultSignalImport + id + '/' : API.EquipFaultSignalImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipFaultSignalDown(params) {
  return request({
    url: API.EquipFaultSignal,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function equipFaultSignalGetName(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipFaultSignalGetName + id + '/' : API.EquipFaultSignalGetName,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 设备维护作业标准定义
export function equipMaintenanceStandard(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipMaintenanceStandard + id + '/' : API.EquipMaintenanceStandard,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipMaintenanceStandardImport(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipMaintenanceStandardImport + id + '/' : API.EquipMaintenanceStandardImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipMaintenanceStandardDown(params) {
  return request({
    url: API.EquipMaintenanceStandard,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function equipMaintenanceStandardGetName(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipMaintenanceStandardGetName + id + '/' : API.EquipMaintenanceStandardGetName,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 设备维修作业标准定义
export function equipRepairStandard(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipRepairStandard + id + '/' : API.EquipRepairStandard,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipRepairStandardImport(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipRepairStandardImport + id + '/' : API.EquipRepairStandardImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipRepairStandardDown(params) {
  return request({
    url: API.EquipRepairStandard,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function equipRepairStandardGetName(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipRepairStandardGetName + id + '/' : API.EquipRepairStandardGetName,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipOrderAssignRuleGetName(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipOrderAssignRuleGetName + id + '/' : API.EquipOrderAssignRuleGetName,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function getDefaultCode(method, id, data = {}) {
  const obj = {
    url: id ? API.GetDefaultCode + id + '/' : API.GetDefaultCode,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 报修申请
export function equipApplyRepair(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipApplyRepair + id + '/' : API.EquipApplyRepair,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 维修工单
export function equipApplyOrder(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipApplyOrder + id + '/' : API.EquipApplyOrder,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function getStaff(method, id, data = {}) {
  const obj = {
    url: id ? API.GetStaff + id + '/' : API.GetStaff,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipApplyOrderdDown(params) {
  return request({
    url: API.EquipApplyOrder,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function multiUpdate(method, id, data = {}) {
  const obj = {
    url: id ? API.MultiUpdate + id + '/' : API.MultiUpdate,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialReq(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialReq + id + '/' : API.MaterialReq,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 上传图片
export function uploadImages(method, id, data = {}) {
  const obj = {
    url: id ? API.UploadImages + id + '/' : API.UploadImages,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipWarehouseInventory(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipWarehouseInventory + id + '/' : API.EquipWarehouseInventory,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 获取出库单据条码
export function getOrderId(method, id, data = {}) {
  const obj = {
    url: id ? API.GetOrderId + id + '/' : API.GetOrderId,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function getCode(method, id, data = {}) {
  const obj = {
    url: id ? API.GetCode + id + '/' : API.GetCode,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 获取出库单据条码
export function equipWarehouseOrder(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipWarehouseOrder + id + '/' : API.EquipWarehouseOrder,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipWarehouseOrderDetail(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipWarehouseOrderDetail + id + '/' : API.EquipWarehouseOrderDetail,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 新建库区
export function equipWarehouseArea(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipWarehouseArea + id + '/' : API.EquipWarehouseArea,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipWarehouseLocation(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipWarehouseLocation + id + '/' : API.EquipWarehouseLocation,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipWarehouseRecord(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipWarehouseRecord + id + '/' : API.EquipWarehouseRecord,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipCodePrint(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipCodePrint + id + '/' : API.EquipCodePrint,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipPlan(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipPlan + id + '/' : API.EquipPlan,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipPlanGetName(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipPlanGetName + id + '/' : API.EquipPlanGetName,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipGenerateOrder(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipGenerateOrder + id + '/' : API.EquipGenerateOrder,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipClosePlan(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipClosePlan + id + '/' : API.EquipClosePlan,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipPlanDown(params) {
  return request({
    url: API.EquipPlan,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function equipInspectionOrder(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipInspectionOrder + id + '/' : API.EquipInspectionOrder,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipInspectionOrderDown(params) {
  return request({
    url: API.EquipInspectionOrder,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function multiUpdateInspection(method, id, data = {}) {
  const obj = {
    url: id ? API.MultiUpdateInspection + id + '/' : API.MultiUpdateInspection,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function wmsStorageSummary(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsStorageSummary + id + '/' : API.WmsStorageSummary,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function wmsStorage(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsStorage + id + '/' : API.WmsStorage,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function wmsRelease(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsRelease + id + '/' : API.WmsRelease,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function thStorageSummary(method, id, data = {}) {
  const obj = {
    url: id ? API.ThStorageSummary + id + '/' : API.ThStorageSummary,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function thStorage(method, id, data = {}) {
  const obj = {
    url: id ? API.ThStorage + id + '/' : API.ThStorage,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function thRelease(method, id, data = {}) {
  const obj = {
    url: id ? API.ThRelease + id + '/' : API.ThRelease,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function returnRubber(method, id, data = {}) {
  const obj = {
    url: id ? API.ReturnRubber + id + '/' : API.ReturnRubber,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function personnels(method, id, data = {}) {
  const obj = {
    url: id ? API.Personnels + id + '/' : API.Personnels,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function replaceMaterial(method, id, data = {}) {
  const obj = {
    url: id ? API.ReplaceMaterial + id + '/' : API.ReplaceMaterial,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialMultiUpdate(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialMultiUpdate + id + '/' : API.MaterialMultiUpdate,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function toleranceKeyword(method, id, data = {}) {
  const obj = {
    url: id ? API.ToleranceKeyword + id + '/' : API.ToleranceKeyword,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function toleranceRule(method, id, data = {}) {
  const obj = {
    url: id ? API.ToleranceRule + id + '/' : API.ToleranceRule,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipMtbfmttpStatement(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipMtbfmttpStatement + id + '/' : API.EquipMtbfmttpStatement,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipWorkorderStatement(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipWorkorderStatement + id + '/' : API.EquipWorkorderStatement,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipStatement(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipStatement + id + '/' : API.EquipStatement,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipUserStatement(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipUserStatement + id + '/' : API.EquipUserStatement,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialDetailsAux(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialDetailsAux + id + '/' : API.MaterialDetailsAux,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipPeriodStatement(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipPeriodStatement + id + '/' : API.EquipPeriodStatement,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipFinishingRate(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipFinishingRate + id + '/' : API.EquipFinishingRate,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipOldRate(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipOldRate + id + '/' : API.EquipOldRate,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function getSpare(method, id, data = {}) {
  const obj = {
    url: id ? API.GetSpare + id + '/' : API.GetSpare,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function getSpareOrder(method, id, data = {}) {
  const obj = {
    url: id ? API.GetSpareOrder + id + '/' : API.GetSpareOrder,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function schedulingParamsSetting(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingParamsSetting + id + '/' : API.SchedulingParamsSetting,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function schedulingRecipeMachineSetting(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingRecipeMachineSetting + id + '/' : API.SchedulingRecipeMachineSetting,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function schedulingRecipeMachineImport(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingRecipeMachineImport + id + '/' : API.SchedulingRecipeMachineImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function recipeMachineWeight(method, id, data = {}) {
  const obj = {
    url: id ? API.RecipeMachineWeight + id + '/' : API.RecipeMachineWeight,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function duratePutinReson(method, id, data = {}) {
  const obj = {
    url: id ? API.DuratePutinReson + id + '/' : API.DuratePutinReson,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function schedulingProductDeclareSummary(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingProductDeclareSummary + id + '/' : API.SchedulingProductDeclareSummary,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function upSequence(method, id, data = {}) {
  const obj = {
    url: id ? API.UpSequence + id + '/' : API.UpSequence,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function downSequence(method, id, data = {}) {
  const obj = {
    url: id ? API.DownSequence + id + '/' : API.DownSequence,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function schedulingEquipShutdownPlan(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingEquipShutdownPlan + id + '/' : API.SchedulingEquipShutdownPlan,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function trainsFeedbacksApiviewDown(params) {
  return request({
    url: API.TrainsFeedbacksApiview,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function schedulingProcedures(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingProcedures + id + '/' : API.SchedulingProcedures,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function delUser(method, id, data = {}) {
  const obj = {
    url: id ? API.DelUser + id + '/' : API.DelUser,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function machineTargetValue(method, id, data = {}) {
  const obj = {
    url: id ? API.MachineTargetValue + id + '/' : API.MachineTargetValue,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function monthlyOutputStatistics(method, id, data = {}) {
  const obj = {
    url: id ? API.MonthlyOutputStatistics + id + '/' : API.MonthlyOutputStatistics,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function dailyProductionCompletionReport(method, id, data = {}) {
  const obj = {
    url: id ? API.DailyProductionCompletionReport + id + '/' : API.DailyProductionCompletionReport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equip190e(method, id, data = {}) {
  const obj = {
    url: id ? API.Equip190e + id + '/' : API.Equip190e,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equip190eImport(method, id, data = {}) {
  const obj = {
    url: id ? API.Equip190eImport + id + '/' : API.Equip190eImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function schedulingStockSummary(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingStockSummary + id + '/' : API.SchedulingStockSummary,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialTestPlan(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialTestPlan + id + '/' : API.MaterialTestPlan,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialTestPlanDetail(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialTestPlanDetail + id + '/' : API.MaterialTestPlanDetail,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function wmsNucleinManagement(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsNucleinManagement + id + '/' : API.WmsNucleinManagement,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialReportEquip(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialReportEquip + id + '/' : API.MaterialReportEquip,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function performanceJobLadder(method, id, data = {}) {
  const obj = {
    url: id ? API.PerformanceJobLadder + id + '/' : API.PerformanceJobLadder,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function productInfoDj(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductInfoDj + id + '/' : API.ProductInfoDj,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function performanceUnitPrice(method, id, data = {}) {
  const obj = {
    url: id ? API.PerformanceUnitPrice + id + '/' : API.PerformanceUnitPrice,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function employeeattendancerecords(method, id, data = {}) {
  const obj = {
    url: id ? API.Employeeattendancerecords + id + '/' : API.Employeeattendancerecords,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function employeeattendancerecordsexport(params) {
  return request({
    url: API.Employeeattendancerecordsexport,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function summaryOfMillOutput(method, id, data = {}) {
  const obj = {
    url: id ? API.SummaryOfMillOutput + id + '/' : API.SummaryOfMillOutput,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function wmsExceptHandle(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsExceptHandle + id + '/' : API.WmsExceptHandle,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function schedulingProductImport(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingProductImport + id + '/' : API.SchedulingProductImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function setThePrice(method, id, data = {}) {
  const obj = {
    url: id ? API.SetThePrice + id + '/' : API.SetThePrice,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function summaryOfWeighingOutput(method, id, data = {}) {
  const obj = {
    url: id ? API.SummaryOfWeighingOutput + id + '/' : API.SummaryOfWeighingOutput,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function userImport(method, id, data = {}) {
  const obj = {
    url: id ? API.UserImport + id + '/' : API.UserImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function hfStock(method, id, data = {}) {
  const obj = {
    url: id ? API.HfStock + id + '/' : API.HfStock,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function hfStockDetail(method, id, data = {}) {
  const obj = {
    url: id ? API.HfStockDetail + id + '/' : API.HfStockDetail,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialExpendSummary(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialExpendSummary + id + '/' : API.MaterialExpendSummary,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function attendanceClockDetail(method, id, data = {}) {
  const obj = {
    url: id ? API.AttendanceClockDetail + id + '/' : API.AttendanceClockDetail,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function attendanceTimeStatistics(method, id, data = {}) {
  const obj = {
    url: id ? API.AttendanceTimeStatistics + id + '/' : API.AttendanceTimeStatistics,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function attendanceGroupSetup(method, id, data = {}) {
  const obj = {
    url: id ? API.AttendanceGroupSetup + id + '/' : API.AttendanceGroupSetup,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function hfRealStatus(method, id, data = {}) {
  const obj = {
    url: id ? API.HfRealStatus + id + '/' : API.HfRealStatus,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function wmsMaterials(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsMaterials + id + '/' : API.WmsMaterials,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function thMaterials(method, id, data = {}) {
  const obj = {
    url: id ? API.ThMaterials + id + '/' : API.ThMaterials,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function schedulingStockConfirm(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingStockConfirm + id + '/' : API.SchedulingStockConfirm,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function schedulingMaterialDemanded(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingMaterialDemanded + id + '/' : API.SchedulingMaterialDemanded,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function schedulingRecipeStages(method, id, data = {}) {
  const obj = {
    url: id ? API.SchedulingRecipeStages + id + '/' : API.SchedulingRecipeStages,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function attendanceResultAudit(method, id, data = {}) {
  const obj = {
    url: id ? API.AttendanceResultAudit + id + '/' : API.AttendanceResultAudit,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
