<template>
  <div class="statisticalReportAttendance">
    <!-- 员工出勤记录表 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.date"
          type="month"
          :clearable="false"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="search.name" clearable placeholder="请输入" @change="debounceList" />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['monthly_output_statistics_and_performance','export']"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
        <el-upload
          v-permission="[]"
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      :data="tableData"
      border
    >
      <el-table-column width="120px">
        <template
          slot="header"
          slot-scope="{row}"
        >
          <span v-if="false">{{ row }}</span>
          <div v-if="!exportTableShow" class="header-style">
            <div style="width:100%;text-align:right;margin:8px 0 20px 0">时间</div>
            <span>机台</span>
            <div class="header-style-line three-line" />
          </div>
          <div v-else>机台</div>
        </template>
        <template
          slot-scope="{row}"
        >
          <span>{{ row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="count"
        align="center"
        label="岗位"
        width="90"
      />
      <el-table-column
        v-for="(d,index) in tableHead"
        :key="Date.now()+index"
        align="center"
        :label="d.label"
        width="120"
      >
        <el-table-column
          v-for="(item,i) in tableHead1[index]"
          :key="i"
          align="center"
          :label="item"
          width="60"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { monthlyOutputStatistics } from '@/api/jqy'
import { exportExcel } from '@/utils/index'
import { setDate } from '@/utils'
export default {
  name: 'StatisticalReportAttendance',
  data() {
    return {
      search: {
        date: setDate(null, null, 'month')
      },
      machineList: [],
      tableHead1: [],
      loading: false,
      tableHead: [],
      tableData: [],
      exportTableShow: false
    }
  },
  created() {
    this.tableHead = getDiffDate(this.search.date + '-01', getCurrentMonthLastDay(setDate()))
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await monthlyOutputStatistics('get', null, { params: this.search })
        this.tableHead1 = data.group_list || []
        this.tableData = data.wl.concat(data.jl).concat(data.hj)
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.tableHead = getDiffDate(this.search.date + '-01', getCurrentMonthLastDay(this.search.date))
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.state === '无硫小计' || row.state === '加硫小计') {
        return 'wl-row'
      }
      if (row.state === '无硫/加硫合计') {
        return 'summary-cell-style'
      }
    },
    debounceList() {
      this.$debounce(this, 'getList')
    },
    Upload(param) {
      // const formData = new FormData()
      // formData.append('file', param.file)
      // equipFaultSignalImport('post', null, { data: formData }).then(response => {
      //   this.$message({
      //     type: 'success',
      //     message: response
      //   })
      //   this.formInline.page = 1
      //   this.getList()
      // })
    },
    async exportTable() {
      await this.$set(this, 'exportTableShow', true)
      await exportExcel('月产量统计明细及绩效报表')
      setTimeout(() => {
        this.exportTableShow = false
      }, 300)
    }
  }
}
function getDiffDate(start, end) {
  var startTime = getDate(start)
  var endTime = getDate(end)
  var dateArr = []
  while ((endTime.getTime() - startTime.getTime()) >= 0) {
    var d = startTime.getDate()
    dateArr.push({ label: d + '日', prop: d })
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
function getCurrentMonthLastDay(d) {
  const date = new Date(d)
  let currentMonth = date.getMonth()
  const nextMonth = ++currentMonth
  const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
  const oneDay = 1000 * 60 * 60 * 24
  const lastTime = new Date(nextMonthFirstDay - oneDay)
  let month = parseInt(lastTime.getMonth() + 1)
  let day = lastTime.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return date.getFullYear() + '-' + month + '-' + day
}
</script>

<style lang="scss">
.statisticalReportAttendance{
    .el-table th{
        padding:0;
    }
    .header-style{
        position: relative;
    }
    .header-style-line{
        height: 1px;
        background:  #e4e6e9;
    }
    .three-line{
        transform-origin:left center;
        transform:rotate(31.5deg);
        width:140px;
        position: absolute;
        top:-8px;
        left:-6px;
    }
    .el-table .wl-row{
        background: #F6ECFF;
    }
}
</style>
