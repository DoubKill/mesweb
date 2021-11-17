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
