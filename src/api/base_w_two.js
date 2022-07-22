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
export function spareStorage(method, id, data = {}) {
  // 盘点
  const obj = {
    url: (id ? API.SpareInventory + id + '/' : API.SpareInventory) + 'check_storage/',
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function putStorage(method, id, data = {}) {
  // 入库
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
export function revocationLog(method, id, data = {}) {
  const obj = {
    url: (id ? API.SpareInventoryLog + id + '/' : API.SpareInventoryLog) + 'revocation_log/',
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function inventoryNow(method, id, data = {}) {
  const obj = {
    url: id ? API.InventoryNow + id + '/' : API.InventoryNow,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function inventoryToday(method, id, data = {}) {
  const obj = {
    url: id ? API.InventoryToday + id + '/' : API.InventoryToday,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function mixGumOutInventoryLog(method, id, data = {}) {
  const obj = {
    url: id ? API.MixGumOutInventoryLog + id + '/' : API.MixGumOutInventoryLog,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function weightingTackStatus(method, id, data = {}) {
  const obj = {
    url: id ? API.WeightingTackStatus + id + '/' : API.WeightingTackStatus,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function batchChargeLogList(method, id, data = {}) {
  const obj = {
    url: id ? API.BatchChargeLogList + id + '/' : API.BatchChargeLogList,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipTank(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipTank + id + '/' : API.EquipTank,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function weightBatchingLogList(method, id, data = {}) {
  const obj = {
    url: id ? API.WeightBatchingLogList + id + '/' : API.WeightBatchingLogList,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialInventoryList(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialInventoryList + id + '/' : API.MaterialInventoryList,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialSupplierCollect(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialSupplierCollect + id + '/' : API.MaterialSupplierCollect,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function zcMaterials(method, id, data = {}) {
  const obj = {
    url: id ? API.ZcMaterials + id + '/' : API.ZcMaterials,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function zcMaterialsThoughMes(method, id, data = {}) {
  const obj = {
    url: id ? API.ZcMaterialsThoughMes + id + '/' : API.ZcMaterialsThoughMes,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function weightingPackageLog(method, id, data = {}, aaa) {
  const obj = {
    url: id ? API.WeightingPackageLog + id + '/' : API.WeightingPackageLog,
    method: method,
    cancelToken: aaa
  }
  Object.assign(obj, data)
  return request(obj)
}
export function manualPost(method, id, data = {}) {
  const obj = {
    url: id ? API.ManualPost + id + '/' : API.ManualPost,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipEownType(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipEownType + id + '/' : API.EquipEownType,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipDownReason(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipDownReason + id + '/' : API.EquipDownReason,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipCurrentStatusList(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipCurrentStatusList + id + '/' : API.EquipCurrentStatusList,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipCurrentStatus(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipCurrentStatus + id + '/' : API.EquipCurrentStatus,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipPart(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipPart + id + '/' : API.EquipPart,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function propertyTypeNode(method, id, data = {}) {
  const obj = {
    url: id ? API.PropertyTypeNode + id + '/' : API.PropertyTypeNode,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function exportProperty(method, id, data = {}) {
  const obj = {
    url: id ? API.ExportProperty + id + '/' : API.ExportProperty,
    method: method,
    responseType: 'blob'
  }
  Object.assign(obj, data)
  return request(obj)
}

export function importProperty(method, id, data = {}) {
  const obj = {
    url: id ? API.ImportProperty + id + '/' : API.ImportProperty,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipmentProperty(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipmentProperty + id + '/' : API.EquipmentProperty,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipMaintenanceOrder(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipMaintenanceOrder + id + '/' : API.EquipMaintenanceOrder,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function platformConfig(method, id, data = {}) {
  const obj = {
    url: id ? API.PlatformConfig + id + '/' : API.PlatformConfig,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function EquipMaintenanceOrderLog(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipMaintenanceOrderLog + id + '/' : API.EquipMaintenanceOrderLog,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function userOperationLog(method, id, data = {}) {
  const obj = {
    url: id ? API.UserOperationLog + id + '/' : API.UserOperationLog,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

