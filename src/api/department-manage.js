import request from '@/utils/request'
import API from '@/api/url'

  export function departmentManage(method, id, data = {}) {
    const obj = {
      url: id ? API.DepartmentManage + id + '/' : API.DepartmentManage,
      method: method
    }
    Object.assign(obj, data)
    return request(obj)
  }