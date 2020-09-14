import request from '@/utils/request'
import API from '@/api/url'

export function login(data) {
  return request({
    url: API.LoginUrl,
    method: 'post',
    data
  })
}

export function personnelsUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.PersonnelsUrl + id + '/' : API.PersonnelsUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
export function planScheduleUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.PlanScheduleUrl + id + '/' : API.PlanScheduleUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}
