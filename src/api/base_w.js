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

export function productDayPlanNotice(method, id, data = {}) {
  const obj = {
    url: id ? API.ProductDayPlanNotice + id + '/' : API.ProductDayPlanNotice,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

