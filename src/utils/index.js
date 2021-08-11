/**
 * Created by PanJiaChen on 16/11/18.
 * 公用方法
 */
import store from '@/store'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 * import { parseTime } from '@/utils/index.js'   引人方法
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {string} _data
 * @param {boolean} bool
 * @returns {string}
 */
export function setDate(_data, bool, type) {
  const date = _data ? new Date(_data) : new Date()
  const formatObj = {
    y: date.getFullYear(),
    m: zeroFilling(date.getMonth() + 1),
    d: zeroFilling(date.getDate()),
    h: zeroFilling(date.getHours()),
    i: zeroFilling(date.getMinutes()),
    s: zeroFilling(date.getSeconds()),
    a: zeroFilling(date.getDay())
  }
  if (bool) {
    return formatObj.y + '-' + formatObj.m + '-' + formatObj.d + ' ' +
      formatObj.h + ':' + formatObj.i + ':' + formatObj.s
  } else if (type && type === 'continuation') {
    return formatObj.y + formatObj.m + formatObj.d +
      formatObj.h + formatObj.i + formatObj.s
  } else if (type && type === 'month') {
    return formatObj.y + '-' + formatObj.m
  } else {
    return formatObj.y + '-' + formatObj.m + '-' + formatObj.d
  }
}

function zeroFilling(n) {
  n = Number(n)
  return n < 10 ? '0' + n : n
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissionObj = store.getters && store.getters.permission
    const permissionArr = permissionObj[value[0]]
    if (!permissionArr || permissionArr.length === 0) {
      return
    }
    const hasPermission = permissionArr.some(D => {
      return D === value[1]
    })

    return hasPermission
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import XLSXStyle from 'xlsx-style'
/**
 *
 * @param {*文件名称} value
 */
export function exportExcel(value = 'excel', val) {
  /* 从表生成工作簿对象 */
  var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'), { raw: true })

  if (val && val === 'disposal-list-components') {
    const tableTitleFont = {
      font: {
        italic: false,
        underline: false
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center'
      },
      border: {
        bottom: { style: 'thin' },
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
    const _wpx = []
    // const _tableTitleFont = JSON.parse(JSON.stringify(tableTitleFont))
    const _tableTitleFont1 = JSON.parse(JSON.stringify(tableTitleFont))
    // const _length = Object.keys(wb.Sheets['Sheet1']).length
    const arr = Object.keys(wb.Sheets['Sheet1'])
    const obj = wb.Sheets['Sheet1']
    const arr1 = []
    let arr2 = []
    arr.forEach(D => {
      if (['!cols', '!fullref', '!merges', '!ref', '!rows'].includes(D)) {
        return
      }
      arr1.push(D.substr(1))
      arr2.push(D.substr(0, 1))

      _wpx.push({ wpx: 80 }, { wpx: 130 }, { wpx: 100 }, { wpx: 150 }, { wpx: 170 },
        { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 })
    })

    arr2 = [...new Set(arr2)]
    const number = Math.max(...arr1) + 1
    const num = number - 13
    const num1 = number - 9
    const num2 = number - 5
    const num3 = number - 1
    for (var D = 1; D <= number; D++) {
      arr2.forEach(d => {
        if (obj[d + D]) {
          if (obj[d + D].v && (obj[d + D].v.indexOf('处理意见') > -1 ||
        obj[d + D].v.indexOf('不合格品') > -1 || obj[d + D].v.indexOf('备注') > -1 ||
        obj[d + D].v.indexOf('质检编码') > -1 || obj[d + D].v.indexOf('经办人') > -1 ||
        (d === 'A' && [num, num1, num2, num3].includes(D)))) {
            _tableTitleFont1.alignment = {
              horizontal: 'left',
              vertical: 'left'
            }
            obj[d + D].s = _tableTitleFont1
          } else {
            obj[d + D].s = tableTitleFont
          }
        } else {
          obj[d + D] = {
            s: { border: {
              bottom: { style: 'thin' },
              top: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            }}
          }
        }
      })
    }

    wb.Sheets['Sheet1']['A1'].s = {									// 为某个单元格设置单独样式
      font: {
        name: '宋体',
        sz: 20,
        italic: false,
        underline: false
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center'
      },
      border: {
        bottom: { style: 'thin' },
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
    wb.Sheets['Sheet1']['!cols'] = _wpx
  }

  var wbout = XLSXStyle.write(wb, {
    bookType: 'xlsx', type: 'buffer'
  })
  try {
    // XLSX.writeFile(wb, value + '.xlsx')
    FileSaver.saveAs(
      // Blob 对象表示一个不可变、原始数据的类文件对象。
      // Blob 表示的不一定是JavaScript原生格式的数据。
      // File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
      // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
      new Blob([wbout], { type: 'application/octet-stream' }),
      // 设置导出文件名称
      value + '.xlsx'
    )
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout)
  }
  return wbout
}

// 报错时候出现重复
export function errorRepeat(_this, e) {
  // 先关闭之前提示
  _this.$message.closeAll()
  // 重复提示
  if (Object.prototype.toString.call(e) === '[object Object]') {
    let errorStr = ''
    for (const key in e) {
      console.log(e[key])
      e[key].forEach(D => {
        errorStr += D
      })
    }
    if (errorStr.includes('已存在')) {
      _this.$message.error('已存在!')
    }
  }
}

/**
 * 去除输入框抖动  防抖
 * _this    this
 * val      要加载的列表名
 */
var timer
// var count = 0
export function debounce(_this, val, _time = 2000) {
  clearTimeout(timer)
  // if (!count) {
  //   _this[val]()
  //   count++
  // } else {
  timer = setTimeout(() => {
    // 执行要加载的接口函数
    _this[val]()
    // count = 0
  }, _time)
  // }
}

/**
 * 获取当前的星期一
 * dateString   查询的日期
 */
export function getWeekDay(dateString) {
  const dateStringReg = /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/

  if (dateString.match(dateStringReg)) {
    const presentDate = new Date(dateString)
    const today = presentDate.getDay() !== 0 ? presentDate.getDay() : 7

    return Array.from(new Array(7), function(val, index) {
      return formatDate(new Date(presentDate.getTime() - (today - index - 1) * 24 * 60 * 60 * 1000))
    })
  } else {
    throw new Error('dateString should be like "yyyy-mm-dd" or "yyyy/mm/dd"')
  }

  function formatDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }
}
