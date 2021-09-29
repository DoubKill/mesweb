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
