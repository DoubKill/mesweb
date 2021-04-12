import request from '@/utils/request'
import API from '@/api/url'

export function warehouseNames() {
  return request({
    url: API.WarehouseNamesUrl,
    method: 'get'
  })
}

export function warehouseInfo(params) {
  return request({
    url: API.WarehouseInfoUrl,
    method: 'get',
    params
  })
}

export function editWarehouseInfo(method, id, data) {
  return request({
    url: id ? API.WarehouseInfoUrl + id + '/' : API.WarehouseInfoUrl,
    method,
    data
  })
}

export function updateSIUseFlag(id) {
  return request({
    url: API.WarehouseInfoUrl + id + '/reversal_use_flag/',
    method: 'put'
  })
}

export function stationInfo(params) {
  return request({
    url: API.StationInfoUrl,
    method: 'get',
    params
  })
}
export function stationInfoRawMaterial(params) {
  return request({
    url: API.MaterialPlanManagementStations,
    method: 'get',
    params
  })
}

export function editStationInfo(method, id, data) {
  return request({
    url: id ? API.StationInfoUrl + id + '/' : API.StationInfoUrl,
    method,
    data
  })
}
export function updateSUseFlag(id) {
  return request({
    url: API.StationInfoUrl + id + '/reversal_use_flag/',
    method: 'put'
  })
}

export function stationTypes() {
  return request({
    url: API.StationTypesUrl,
    methods: 'get'
  })
}

export function warehouseMaterialTypes(params) {
  return request({
    url: API.WarehouseMaterialTypeUrl,
    method: 'get',
    params
  })
}

export function editWarehouseMaterialType(method, id, data) {
  return request({
    url: id ? API.WarehouseMaterialTypeUrl + id + '/' : API.WarehouseMaterialTypeUrl,
    method,
    data
  })
}

export function updateMUseFlag(id) {
  return request({
    url: API.WarehouseMaterialTypeUrl + id + '/reversal_use_flag/',
    method: 'put'
  })
}

export function materialTypes() {
  return request({
    url: API.MaterialTypesUrl,
    methods: 'get'
  })
}
