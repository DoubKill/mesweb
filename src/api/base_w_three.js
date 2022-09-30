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
export function runtimeRecord(method, id, data = {}) {
  const obj = {
    url: id ? API.RuntimeRecord + id + '/' : API.RuntimeRecord,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function productDetails(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductDetails + id + '/' : API.ProductDetails,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialExamineType(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialExamineType + id + '/' : API.MaterialExamineType,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function exportTemplate(params) {
  return request({
    url: API.ExportTemplate,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
export function importData(data) {
  return request({
    url: API.ImportData,
    method: 'post',
    data
  })
}

export function materialUnit(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialUnit + id + '/' : API.MaterialUnit,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialEquipmentType(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialEquipmentType + id + '/' : API.MaterialEquipmentType,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialEquipment(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialEquipment + id + '/' : API.MaterialEquipment,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function wmsMaterialSearch(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsMaterialSearch + id + '/' : API.WmsMaterialSearch,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function materialExamineResult(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialExamineResult + id + '/' : API.MaterialExamineResult,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function xlMaterial(method, id, data = {}) {
  const obj = {
    url: id ? API.XlMaterial + id + '/' : API.XlMaterial,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function xlBin(method, id, data = {}) {
  const obj = {
    url: id ? API.XlBin + id + '/' : API.XlBin,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function saveBin(method, id, data = {}) {
  const obj = {
    url: id ? API.SaveBin + id + '/' : API.SaveBin,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function xlRecipe(method, id, data = {}) {
  const obj = {
    url: id ? API.XlRecipe + id + '/' : API.XlRecipe,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function updateFlagCount(method, id, data = {}) {
  const obj = {
    url: id ? API.UpdateFlagCount + id + '/' : API.UpdateFlagCount,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function xlRecipeMaterial(method, id, data = {}) {
  const obj = {
    url: id ? API.XlRecipeMaterial + id + '/' : API.XlRecipeMaterial,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function xlReportBasic(method, id, data = {}) {
  const obj = {
    url: id ? API.XlReportBasic + id + '/' : API.XlReportBasic,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function xlReportWeight(method, id, data = {}) {
  const obj = {
    url: id ? API.XlReportWeight + id + '/' : API.XlReportWeight,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function xlPlan(method, id, data = {}) {
  const obj = {
    url: id ? API.XlPlan + id + '/' : API.XlPlan,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function rotateClasses(method, id, data = {}) {
  const obj = {
    url: id ? API.RotateClasses + id + '/' : API.RotateClasses,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function upDownMove(method, id, data = {}) {
  const obj = {
    url: id ? API.UpDownMove + id + '/' : API.UpDownMove,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function currentFactoryDate(method, id, data = {}) {
  const obj = {
    url: id ? API.CurrentFactoryDate + id + '/' : API.CurrentFactoryDate,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function autoMan(method, id, data = {}) {
  const obj = {
    url: id ? API.AutoMan + id + '/' : API.AutoMan,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function wmsStock(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsStock + id + '/' : API.WmsStock,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function wmsWeightStock(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsWeightStock + id + '/' : API.WmsWeightStock,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function wmsEntrance(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsEntrance + id + '/' : API.WmsEntrance,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function wmsInstock(method, id, data = {}) {
  const obj = {
    url: id ? API.WmsInstock + id + '/' : API.WmsInstock,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function thStock(method, id, data = {}) {
  const obj = {
    url: id ? API.ThStock + id + '/' : API.ThStock,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function thWeightStock(method, id, data = {}) {
  const obj = {
    url: id ? API.ThWeightStock + id + '/' : API.ThWeightStock,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function thEntrance(method, id, data = {}) {
  const obj = {
    url: id ? API.ThEntrance + id + '/' : API.ThEntrance,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function thInstock(method, id, data = {}) {
  const obj = {
    url: id ? API.ThInstock + id + '/' : API.ThInstock,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

