import request from '@/utils/request'
import API from '@/api/url'

export function barcodeQuality(method, id, data = {}) {
  const obj = {
    url: id ? API.BarcodeQuality + id + '/' : API.BarcodeQuality,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialTrace(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialTrace + id + '/' : API.MaterialTrace,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function ProductTrace(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductTrace + id + '/' : API.ProductTrace,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function barcodeQualityExport(params) {
  return request({
    url: API.BarcodeQualityExport,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function testIndicatorsRaw(method, id, data = {}) {
  const obj = {
    url: id ? API.TestIndicatorsRaw + id + '/' : API.TestIndicatorsRaw,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function testTypesRaw(method, id, data = {}) {
  const obj = {
    url: id ? API.TestTypesRaw + id + '/' : API.TestTypesRaw,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function dataPointsRaw(method, id, data = {}) {
  const obj = {
    url: id ? API.DataPointsRaw + id + '/' : API.DataPointsRaw,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function testMethodsRaw(method, id, data = {}) {
  const obj = {
    url: id ? API.TestMethodsRaw + id + '/' : API.TestMethodsRaw,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function levelResultRaw(method, id, data = {}) {
  const obj = {
    url: id ? API.LevelResultRaw + id + '/' : API.LevelResultRaw,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function matTestMethodsRaw(method, id, data = {}) {
  const obj = {
    url: id ? API.MatTestMethodsRaw + id + '/' : API.MatTestMethodsRaw,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function matDataPointIndicatorsRaw(method, id, data = {}) {
  const obj = {
    url: id ? API.MatDataPointIndicatorsRaw + id + '/' : API.MatDataPointIndicatorsRaw,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialInventory(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialInventory + id + '/' : API.MaterialInventory,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function materialTestOrdersRaw(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialTestOrdersRaw + id + '/' : API.MaterialTestOrdersRaw,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function unqualifiedMaterialDealResult(method, id, data = {}) {
  const obj = {
    url: id ? API.UnqualifiedMaterialDealResult + id + '/' : API.UnqualifiedMaterialDealResult,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function matTestIndicatorMethodsRaw(method, id, data = {}) {
  const obj = {
    url: id ? API.MatTestIndicatorMethodsRaw + id + '/' : API.MatTestIndicatorMethodsRaw,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function testIndicatorDataPointsRaw(method, id, data = {}) {
  const obj = {
    url: id ? API.TestIndicatorDataPointsRaw + id + '/' : API.TestIndicatorDataPointsRaw,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function dayErrorStatistics(method, id, data = {}) {
  const obj = {
    url: id ? API.DayErrorStatistics + id + '/' : API.DayErrorStatistics,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function weekErrorStatistics(method, id, data = {}) {
  const obj = {
    url: id ? API.WeekErrorStatistics + id + '/' : API.WeekErrorStatistics,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function monthErrorStatistics(method, id, data = {}) {
  const obj = {
    url: id ? API.MonthErrorStatistics + id + '/' : API.MonthErrorStatistics,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function monthErrorSort(method, id, data = {}) {
  const obj = {
    url: id ? API.MonthErrorSort + id + '/' : API.MonthErrorSort,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function barcodePreview(method, id, data = {}) {
  const obj = {
    url: id ? API.BarcodePreview + id + '/' : API.BarcodePreview,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function productStationStatics(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductStationStatics + id + '/' : API.ProductStationStatics,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function indexOverview(method, id, data = {}) {
  const obj = {
    url: id ? API.IndexOverview + id + '/' : API.IndexOverview,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function indexProductionAyalyze(method, id, data = {}) {
  const obj = {
    url: id ? API.IndexProductionAyalyze + id + '/' : API.IndexProductionAyalyze,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function indexEquipProductionAyalyze(method, id, data = {}) {
  const obj = {
    url: id ? API.IndexEquipProductionAyalyze + id + '/' : API.IndexEquipProductionAyalyze,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function indexEquipMaintenanceAyalyze(method, id, data = {}) {
  const obj = {
    url: id ? API.IndexEquipMaintenanceAyalyze + id + '/' : API.IndexEquipMaintenanceAyalyze,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

