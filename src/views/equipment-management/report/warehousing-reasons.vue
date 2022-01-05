<template>
  <div>
    <!-- 不入库原因统计 -->
    <el-form :inline="true">
      <h3>不入库原因统计</h3>
      <el-form-item label="起止日期">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          :clearable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['durate_putin_reason','export']"
          type="primary"
          @click="exportTable(1)"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="table"
      v-loading="loading"
      :data="tableData"
      :row-class-name="tableRowClassName"
      border
    >
      <el-table-column
        prop="不入库原因"
        label="不入库原因"
        min-width="20"
      />
      <template v-for="(d,index) in tableHead">
        <el-table-column
          :key="index"
          :label="d.label"
          :prop="d.prop"
          min-width="20"
        >
          <template slot-scope="scope">
            <el-link v-if="scope.row.不入库原因==='合计'" type="primary" @click="dialog(scope)">{{ scope.row[d.prop]===0?null:scope.row[d.prop] }}</el-link>
            <span v-else>{{ scope.row[d.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        prop="count"
        label="合计"
        min-width="20"
      />
    </el-table>
    <el-dialog
      title="机台别不入库原因日统计"
      width="90%"
      :visible.sync="dialogVisible"
      :append-to-body="true"
    >
      <el-form :inline="true">
        <el-form-item label="工厂日期">
          <el-date-picker
            v-model="date"
            disabled
            type="date"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-permission="['durate_putin_reason','export']"
            type="primary"
            @click="exportTable(2)"
          >导出Excel</el-button>
        </el-form-item>
      </el-form>
      <el-table
        id="table1"
        v-loading="loading1"
        :row-class-name="tableRowClassName"
        :data="tableData1"
        border
      >
        <el-table-column
          prop="不入库原因"
          label="不入库原因"
          min-width="20"
        />
        <template v-for="(d,index) in equipList">
          <el-table-column
            :key="index"
            :label="d"
            :prop="d"
            min-width="20"
          >
            <template slot-scope="scope">
              <el-link v-if="scope.row.不入库原因==='合计'" type="primary" @click="dialog1(scope)">{{ scope.row[d]===0?null:scope.row[d] }}</el-link>
              <span v-else>{{ scope.row[d] }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          prop="count"
          label="合计"
          min-width="20"
        />
      </el-table>
    </el-dialog>

    <el-dialog
      title="不入库原因明细"
      width="90%"
      :visible.sync="dialogVisible1"
      :append-to-body="true"
    >
      <el-form :inline="true">
        <el-form-item>
          <el-button
            v-permission="['durate_putin_reason','export']"
            type="primary"
            @click="exportTable(3)"
          >导出Excel</el-button>
        </el-form-item>
      </el-form>
      <el-table
        id="table2"
        v-loading="loading2"
        :data="tableData2"
        border
      >
        <el-table-column
          prop="reason_name"
          label="不入库原因"
          min-width="20"
        />
        <el-table-column
          prop="factory_date"
          label="工厂日期"
          min-width="20"
        />
        <el-table-column
          prop="machine_no"
          label="机台"
          min-width="20"
        />
        <el-table-column
          prop="production_no"
          label="配方名"
          min-width="20"
        />
        <el-table-column
          prop="lot_no"
          label="收皮条码"
          min-width="20"
        />
        <el-table-column
          prop="pallet_no"
          label="托盘号"
          min-width="20"
        />
        <el-table-column
          prop="input_datetime"
          label="登陆时间"
          min-width="20"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { duratePutinReson } from '@/api/jqy'
import { exportExcel, setDate } from '@/utils/index'
export default {
  name: 'EquipmentReportFormObsolescenceRate',
  data() {
    return {
      excel: null,
      excel1: null,
      dateValue: [getNextDate(setDate(), -7), setDate()],
      search: {},
      date: null,
      tableHead: [],
      equipList: ['Z01', 'Z02', 'Z03', 'Z04', 'Z05', 'Z06', 'Z07', 'Z08', 'Z09', 'Z10', 'Z11', 'Z12', 'Z13', 'Z14', 'Z15'],
      dialogVisible: false,
      dialogVisible1: false,
      loading: false,
      loading1: false,
      loading2: false,
      tableData: [],
      tableData1: [],
      tableData2: []
    }
  },
  created() {
    this.search.s_time = this.dateValue[0]
    this.search.e_time = this.dateValue[1]
    this.tableHead = getDiffDate(this.dateValue[0], this.dateValue[1])
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await duratePutinReson('get', null, { params: this.search })
        this.tableData = data.results
        if (this.tableData.length > 0) {
          const index = this.tableData.length
          this.tableData.push({
            不入库原因: '合计'
          })
          this.tableHead.forEach(d => {
            this.tableData[index][d.prop] = sum(this.tableData, d.prop)
          })
          this.tableData[index].count = sum(this.tableData, 'count')
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.不入库原因 === '合计') {
        return 'summary-cell-style'
      }
    },
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      if (getDaysBetween(this.search.s_time, this.search.e_time) > 31) {
        this.$message('查询日期间隔不得超过31天')
        return
      }
      this.tableHead = getDiffDate(this.search.s_time, this.search.e_time)
      this.getList()
    },
    async dialog(row) {
      var str = row.column.property.substring(0, row.column.property.length - 1)
      var str1 = str.replace(/年|月/g, '-')
      this.date = str1
      this.dialogVisible = true
      try {
        this.loading1 = true
        const data = await duratePutinReson('get', null, { params: { factory_date: this.date }})
        this.tableData1 = data.results
        if (this.tableData1.length > 0) {
          const index = this.tableData1.length
          this.tableData1.push({
            不入库原因: '合计'
          })
          this.equipList.forEach(d => {
            this.tableData1[index][d] = sum(this.tableData1, d)
          })
          this.tableData1[index].count = sum(this.tableData1, 'count')
        }
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
      }
    },
    async dialog1(row) {
      var equip = row.column.property
      this.dialogVisible1 = true
      try {
        this.loading2 = true
        const data = await duratePutinReson('get', null, { params: { factory_date: this.date, equip }})
        this.tableData2 = data.results
        this.loading2 = false
      } catch (e) {
        this.loading2 = false
      }
    },
    async exportTable(val) {
      if (val === 1) {
        document.getElementById('table').id = 'out-table'
        await exportExcel('期间别不入库原因统计报表')
        setTimeout(() => {
          document.getElementById('out-table').id = 'table'
        }, 1000)
      }
      if (val === 2) {
        document.getElementById('table1').id = 'out-table'
        await exportExcel('机台别不入库原因日统计报表')
        setTimeout(() => {
          document.getElementById('out-table').id = 'table1'
        }, 1000)
      }
      if (val === 3) {
        document.getElementById('table2').id = 'out-table'
        await exportExcel('不入库原因明细')
        setTimeout(() => {
          document.getElementById('out-table').id = 'table2'
        }, 1000)
      }
    }
  }

}
function getDiffDate(start, end) {
  var startTime = getDate(start)
  var endTime = getDate(end)
  var dateArr = []
  while ((endTime.getTime() - startTime.getTime()) >= 0) {
    var year = startTime.getFullYear()
    var m = startTime.getMonth() + 1
    var d = startTime.getDate()
    var month = startTime.getMonth().toString().length === 1 ? '0' + (parseInt(startTime.getMonth().toString(), 10) + 1) : (startTime.getMonth() + 1)
    var day = startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate()
    dateArr.push({ label: m + '/' + d, prop: year + '年' + month + '月' + day + '日' })
    startTime.setDate(startTime.getDate() + 1)
  }
  return dateArr
}
function getDate(datestr) {
  var temp = datestr.split('-')
  if (temp[1] === '01') {
    temp[0] = parseInt(temp[0], 10) - 1
    temp[1] = '12'
  } else {
    temp[1] = parseInt(temp[1], 10) - 1
  }
  // new Date()的月份入参实际都是当前值-1
  var date = new Date(temp[0], temp[1], temp[2])
  return date
}
function getNextDate(date, day) {
  var dd = new Date(date)
  dd.setDate(dd.getDate() + day)
  var y = dd.getFullYear()
  var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1
  var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
  return y + '-' + m + '-' + d
}
function sum(arr, params) {
  var s = 0
  arr.forEach(function(val, idx, arr) {
    const a = val[params] ? Number(val[params]) : 0
    s += a
  }, 0)
  s = Math.round(s * 100) / 100
  return s
}
function getDaysBetween(dateString1, dateString2) {
  var startDate = Date.parse(dateString1)
  var endDate = Date.parse(dateString2)
  if (startDate > endDate) {
    return 0
  }
  if (startDate === endDate) {
    return 1
  }
  var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
  return days
}

</script>

<style  lang="scss">
</style>
