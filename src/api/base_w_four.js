import request from '@/utils/request'
import API from '@/api/url'

export function materialReportEquip(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialReportEquip + id + '/' : API.MaterialReportEquip,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialReportValue(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialReportValue + id + '/' : API.MaterialReportValue,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function productReportEquip(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductReportEquip + id + '/' : API.ProductReportEquip,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipTestData(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipTestData + id + '/' : API.EquipTestData,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function checkEquip(method, id, data = {}) {
  const obj = {
    url: id ? API.CheckEquip + id + '/' : API.CheckEquip,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function productReportValue(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductReportValue + id + '/' : API.ProductReportValue,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function wmsInventory(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsInventory + id + '/' : API.WmsInventory,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function wmsMaterialGroups(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsMaterialGroups + id + '/' : API.WmsMaterialGroups,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function wmsTunnels(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsTunnels + id + '/' : API.WmsTunnels,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function thInventory(method, id, data = {}) {
  const obj = {
    url: id ? API.ThInventory + id + '/' : API.ThInventory,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function thMaterialGroups(method, id, data = {}) {
  const obj = {
    url: id ? API.ThMaterialGroups + id + '/' : API.ThMaterialGroups,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function thTunnels(method, id, data = {}) {
  const obj = {
    url: id ? API.ThTunnels + id + '/' : API.ThTunnels,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function depot(method, id, data = {}) {
  const obj = {
    url: id ? API.Depot + id + '/' : API.Depot,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function depotSite(method, id, data = {}) {
  const obj = {
    url: id ? API.DepotSite + id + '/' : API.DepotSite,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function palletData(method, id, data = {}) {
  const obj = {
    url: id ? API.PalletData + id + '/' : API.PalletData,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function depotPallet(method, id, data = {}) {
  const obj = {
    url: id ? API.DepotPallet + id + '/' : API.DepotPallet,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function depotPalletInfo(method, id, data = {}) {
  const obj = {
    url: id ? API.DepotPalletInfo + id + '/' : API.DepotPalletInfo,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function erpMaterials(method, id, data = {}) {
  const obj = {
    url: id ? API.ErpMaterials + id + '/' : API.ErpMaterials,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function sulfurDepot(method, id, data = {}) {
  const obj = {
    url: id ? API.SulfurDepot + id + '/' : API.SulfurDepot,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function sulfurDepotSite(method, id, data = {}) {
  const obj = {
    url: id ? API.SulfurDepotSite + id + '/' : API.SulfurDepotSite,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function depotSulfur(method, id, data = {}) {
  const obj = {
    url: id ? API.DepotSulfur + id + '/' : API.DepotSulfur,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function depotSulfurInfo(method, id, data = {}) {
  const obj = {
    url: id ? API.DepotSulfurInfo + id + '/' : API.DepotSulfurInfo,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function sulfurData(method, id, data = {}) {
  const obj = {
    url: id ? API.SulfurData + id + '/' : API.SulfurData,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function sulfurResume(method, id, data = {}) {
  const obj = {
    url: id ? API.SulfurResume + id + '/' : API.SulfurResume,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function palletTestResult(method, id, data = {}) {
  const obj = {
    url: id ? API.PalletTestResult + id + '/' : API.PalletTestResult,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function depotResume(method, id, data = {}) {
  const obj = {
    url: id ? API.DepotResume + id + '/' : API.DepotResume,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function bzMixinInventorySummary(method, id, data = {}) {
  const obj = {
    url: id ? API.BzMixinInventorySummary + id + '/' : API.BzMixinInventorySummary,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function bzFinalInventorySummary(method, id, data = {}) {
  const obj = {
    url: id ? API.BzFinalInventorySummary + id + '/' : API.BzFinalInventorySummary,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function bzFinalInventorySearch(method, id, data = {}) {
  const obj = {
    url: id ? API.BzFinalInventorySearch + id + '/' : API.BzFinalInventorySearch,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function bzMixinInventorySearch(method, id, data = {}) {
  const obj = {
    url: id ? API.BzMixinInventorySearch + id + '/' : API.BzMixinInventorySearch,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function weightingPackageExpire(method, id, data = {}) {
  const obj = {
    url: id ? API.WeightingPackageExpire + id + '/' : API.WeightingPackageExpire,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function productTestResume(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductTestResume + id + '/' : API.ProductTestResume,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function productTestPlan(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductTestPlan + id + '/' : API.ProductTestPlan,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function rubberMaxStretchTestResult(method, id, data = {}) {
  const obj = {
    url: id ? API.RubberMaxStretchTestResult + id + '/' : API.RubberMaxStretchTestResult,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function outBoundTasks(method, id, data = {}) {
  const obj = {
    url: id ? API.OutBoundTasks + id + '/' : API.OutBoundTasks,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function inoutBoundSummary(method, id, data = {}) {
  const obj = {
    url: id ? API.InoutBoundSummary + id + '/' : API.InoutBoundSummary,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
