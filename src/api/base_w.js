import request from '@/utils/request'
import API from '@/api/url'

export function globalCodesUrl(method, data = {}) {
  const obj = {
    url: API.GlobalCodesUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function workSchedulesUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.WorkSchedulesUrl + id + '/' : API.WorkSchedulesUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 有s
export function planSchedulesUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.PlanSchedulesUrl + id + '/' : API.PlanSchedulesUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// 无s
export function planScheduleUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.PlanScheduleUrl + id + '/' : API.PlanScheduleUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function materialsUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialsUrl + id + '/' : API.MaterialsUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function productInfosUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductInfosUrl + id + '/' : API.ProductInfosUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function copyProductInfosUrl(method, data = {}) {
  const obj = {
    url: API.CopyProductInfosUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function equipUrl(method, data = {}) {
  const obj = {
    url: API.EquipUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function productDayPlansUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductDayPlansUrl + id + '/' : API.ProductDayPlansUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function productDayPlansCopyUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductDayPlansCopyUrl + id + '/' : API.ProductDayPlansCopyUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function rubberMaterialUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.RubberMaterialUrl + id + '/' : API.RubberMaterialUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function productDayPlanManyCreateUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductDayPlanManyCreateUrl + id + '/' : API.ProductDayPlanManyCreateUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
// export function ProductDayPlanNotice(method, id, data = {}) {
//   const obj = {
//     url: id ? API.ProductDayPlanNotice + id + '/' : API.ProductDayPlanNotice,
//     method: method
//   }
//   Object.assign(obj, data)
//   return request(obj)
// }
// 密炼生产履历
export function internalMixerUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.InternalMixerUrl + id + '/' : API.InternalMixerUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function classesListUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.ClassesListUrl + id + '/' : API.ClassesListUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function palletFeedBacksUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.PalletFeedBacksUrl + id + '/' : API.PalletFeedBacksUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function trainsFeedbacksUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.TrainsFeedbacksUrl + id + '/' : API.TrainsFeedbacksUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function echartsListUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.EchartsListUrl + id + '/' : API.EchartsListUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function productClassesPlanUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductClassesPlanUrl + id + '/' : API.ProductClassesPlanUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function productClassesPlanPanycreateUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductClassesPlanPanycreateUrl + id + '/' : API.ProductClassesPlanPanycreateUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function planImport(method, id, data = {}) {
  const obj = {
    url: id ? API.PlanImport + id + '/' : API.PlanImport,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function productDayPlanNotice(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductDayPlanNotice + id + '/' : API.ProductDayPlanNotice,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function homePageUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.HomePageUrl + id + '/' : API.HomePageUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialTestTypes(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialTestTypes + id + '/' : API.MaterialTestTypes,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function testIndicators(method, id, data = {}) {
  const obj = {
    url: id ? API.TestIndicators + id + '/' : API.TestIndicators,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function testTypeData(method, id, data = {}) {
  const obj = {
    url: id ? API.TestTypeData + id + '/' : API.TestTypeData,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function testSubTypes(method, id, data = {}) {
  const obj = {
    url: id ? API.TestSubTypes + id + '/' : API.TestSubTypes,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialTestOrders(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialTestOrders + id + '/' : API.MaterialTestOrders,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function matIndicatorTab(method, id, data = {}) {
  const obj = {
    url: id ? API.MatIndicatorTab + id + '/' : API.MatIndicatorTab,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialDataPoints(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialDataPoints + id + '/' : API.MaterialDataPoints,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function dataPoints(method, id, data = {}) {
  const obj = {
    url: id ? API.DataPoints + id + '/' : API.DataPoints,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function testTypes(method, id, data = {}) {
  const obj = {
    url: id ? API.TestTypes + id + '/' : API.TestTypes,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function batchingMaterials(method, id, data = {}) {
  const obj = {
    url: id ? API.BatchingMaterials + id + '/' : API.BatchingMaterials,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function matTestMethods(method, id, data = {}) {
  const obj = {
    url: id ? API.MatTestMethods + id + '/' : API.MatTestMethods,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function matDataPointIndicators(method, id, data = {}) {
  const obj = {
    url: id ? API.MatDataPointIndicators + id + '/' : API.MatDataPointIndicators,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function matTestIndicatorMethods(method, id, data = {}) {
  const obj = {
    url: id ? API.MatTestIndicatorMethods + id + '/' : API.MatTestIndicatorMethods,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function levelResult(method, id, data = {}) {
  const obj = {
    url: id ? API.LevelResult + id + '/' : API.LevelResult,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function classesBanburySummary(method, id, data = {}) {
  const obj = {
    url: id ? API.ClassesBanburySummary + id + '/' : API.ClassesBanburySummary,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function collectTrainsFeed(method, id, data = {}) {
  const obj = {
    url: id ? API.CollectTrainsFeed + id + '/' : API.CollectTrainsFeed,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function equipBanburySummary(method, id, data = {}) {
  const obj = {
    url: id ? API.EquipBanburySummary + id + '/' : API.EquipBanburySummary,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function cutTimeCollect(method, id, data = {}) {
  const obj = {
    url: id ? API.CutTimeCollect + id + '/' : API.CutTimeCollect,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function sumSollectTrains(method, id, data = {}) {
  const obj = {
    url: id ? API.SumSollectTrains + id + '/' : API.SumSollectTrains,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function putPlanManagement(method, id, data = {}) {
  const obj = {
    url: id ? API.PutPlanManagement + id + '/' : API.PutPlanManagement,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function finalPlanManagement(method, id, data = {}) {
  const obj = {
    url: id ? API.FinalPlanManagement + id + '/' : API.FinalPlanManagement,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function materialPlanManagement(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialPlanManagement + id + '/' : API.MaterialPlanManagement,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function drussPlanManagement(method, id, data = {}) {
  const obj = {
    url: id ? API.DrussPlanManagement + id + '/' : API.DrussPlanManagement,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function materialCount(method, id, data = {}) {
  const obj = {
    url: id ? API.MaterialCount + id + '/' : API.MaterialCount,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function inventoryLog(method, id, data = {}) {
  const obj = {
    url: id ? API.InventoryLog + id + '/' : API.InventoryLog,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function palletTrainsFeedbacks(method, id, data = {}) {
  const obj = {
    url: id ? API.PalletTrainsFeedbacks + id + '/' : API.PalletTrainsFeedbacks,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function lbPlanManagement(method, id, data = {}) {
  const obj = {
    url: id ? API.LbPlanManagement + id + '/' : API.LbPlanManagement,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function labelPrint(method, id, data = {}) {
  const obj = {
    url: id ? API.LabelPrint + id + '/' : API.LabelPrint,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function unqualifiedTrains(method, id, data = {}) {
  const obj = {
    url: id ? API.UnqualifiedTrains + id + '/' : API.UnqualifiedTrains,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function unqualifiedDealOrders(method, id, data = {}) {
  const obj = {
    url: id ? API.UnqualifiedDealOrders + id + '/' : API.UnqualifiedDealOrders,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function intervalOutputStatistics(method, id, data = {}) {
  const obj = {
    url: id ? API.IntervalOutputStatistics + id + '/' : API.IntervalOutputStatistics,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function trainsFeedbacksApiview(method, id, data = {}) {
  const obj = {
    url: id ? API.TrainsFeedbacksApiview + id + '/' : API.TrainsFeedbacksApiview,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function weighInformationUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.WeighInformationUrl + id + '/' : API.WeighInformationUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function mixerInformationUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.MixerInformationUrl + id + '/' : API.MixerInformationUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function curveInformationUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.CurveInformationUrl + id + '/' : API.CurveInformationUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function alarmLogList(method, id, data = {}) {
  const obj = {
    url: id ? API.AlarmLogList + id + '/' : API.AlarmLogList,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function importMaterialMestMrders(data) {
  return request({
    url: API.ImportMaterialMestMrders,
    method: 'post',
    data
  })
}

export function importMaterialTestOrders(params) {
  return request({
    url: API.ImportMaterialMestMrders,
    method: 'get',
    params,
    responseType: 'blob'
  })
}

