<template>
  <div>
    <!-- 期间别处理时间分析报表 -->
    <el-form :inline="true">
      <el-form-item>
        <el-radio-group v-model="radio" @change="resetTime">
          <el-radio :label="1">日报</el-radio>
          <el-radio :label="2">周报</el-radio>
          <el-radio :label="3">月报</el-radio>
          <el-radio :label="4">年报</el-radio>
        </el-radio-group>
      </el-form-item>
      <br>
      <el-form-item label="作业类型">
        <el-select
          v-model="search.work_type"
          placeholder="请选择"
          clearable
          @change="getList"
        >
          <el-option
            v-for="item in ['巡检','保养','维修','润滑','标定']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日/周/月/年">
        <el-date-picker
          v-if="type===1"
          key="1"
          v-model="search.day_time"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeList"
        />
        <el-date-picker
          v-if="type===2"
          key="2"
          v-model="search.day_time"
          type="week"
          :picker-options="{firstDayOfWeek:1}"
          format="yyyy第WW周"
          value-format="yyyy-MM-dd"
          placeholder="选择周"
          @change="changeList"
        />
        <el-date-picker
          v-if="type===3"
          key="3"
          v-model="search.day_time"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM-dd"
          placeholder="选择月"
          @change="changeList"
        />
        <el-date-picker
          v-if="type===4"
          key="4"
          v-model="search.day_time"
          type="year"
          format="yyyy"
          value-format="yyyy-MM-dd"
          placeholder="选择年"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="order_id"
        label="时间"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="作业类别"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="工单编号"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="作业类别"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="派单时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="接单时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="维修时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="验收时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="开机时间（分钟）"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import { setDate } from '@/utils'
export default {
  name: 'EquipmentReportFormOrderProcessing',
  data() {
    return {
      btnExportLoad: false,
      search: { day_time: setDate() },
      loading: false,
      tableData: [],
      radio: 1,
      type: 1
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await equipWarehouseRecord('get', null, { params: this.search })
        // this.tableData = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      // if (this.type === 2) {
      //   this.search.day_time = getNextDate(this.search.day_time, -1)
      // }
      this.getList()
    },
    resetTime() {
      // if (this.radio === 2) {
      //   this.search.day_time = getMonday(new Date())
      // }
      this.search.day_time = setDate()
      this.type = this.radio
      this.getList()
    },
    exportTable() {
      this.btnExportLoad = true
      // const obj = Object.assign({ export: 1 }, this.search)
      // const _api = equipWarehouseRecord
      // _api('get', null, { params: obj, responseType: 'blob' })
      //   .then(res => {
      //     const link = document.createElement('a')
      //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      //     link.style.display = 'none'
      //     link.href = URL.createObjectURL(blob)
      //     link.download = '备件出入库履历.xlsx' // 下载的文件名
      //     document.body.appendChild(link)
      //     link.click()
      //     document.body.removeChild(link)
      //     this.btnExportLoad = false
      //   }).catch(e => {
      //     this.btnExportLoad = false
      //   })
    }
  }
}
// function getNextDate(date, day) {
//   var dd = new Date(date)
//   dd.setDate(dd.getDate() + day)
//   var y = dd.getFullYear()
//   var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1
//   var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
//   return y + '-' + m + '-' + d
// }
// function getNextMon(date, day) {
//   var dd = new Date(date)
//   dd.setDate(dd.getDate() + day)
//   var y = dd.getFullYear()
//   var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1
//   return y + '-' + m
// }
// function getNextYear(date, day) {
//   var dd = new Date(date)
//   dd.setDate(dd.getDate() + day)
//   var y = dd.getFullYear()
//   return y
// }
// function getMonday(date) {
//   var day = date.getDay()
//   var deltaDay
//   if (day === 0) {
//     deltaDay = 6
//   } else {
//     deltaDay = day - 1
//   }
//   var monday = new Date(date.getTime() - deltaDay * 24 * 60 * 60 * 1000)
//   monday.setHours(0)
//   monday.setMinutes(0)
//   monday.setSeconds(0)
//   return getNextDate(monday, 0) // 返回本周的周一的0时0分0秒
// }
</script>

<style>

</style>
