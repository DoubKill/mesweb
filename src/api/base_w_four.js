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
