<template>
  <div class="dailyOutputCompleted">
    <!-- 月产量完成 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.date"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
          :clearable="false"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['daily_production_completion_report','export']"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column width="140px">
        <template
          slot="header"
          slot-scope="{row}"
        >
          <span v-if="false">{{ row }}</span>
          <div v-if="!exportTableShow" class="header-style">
            <div style="width:100%;text-align:right">日期</div>
            <span>项目</span>
            <div class="header-style-line three-line" />
          </div>
          <div v-else>项目</div>
        </template>
        <template
          slot-scope="{row}"
        >
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <template v-for="(d,index) in tableHead">
        <el-table-column
          :key="index"
          align="center"
          :label="d"
          :prop="d"
          width="70"
        />
      </template>
      <el-table-column
        prop="weight"
        label="日累计完成1日为起点"
        width="90"
      />
    </el-table>
  </div>
</template>

<script>
import { dailyProductionCompletionReport } from '@/api/jqy'
import { exportExcel } from '@/utils/index'
import { setDate } from '@/utils'
export default {
  name: 'DailyOutputCompleted',
  data() {
    return {
      search: {
        date: setDate(null, null, 'month')
      },
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
        const data = await dailyProductionCompletionReport('get', null, { params: this.search })
        this.tableData = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.tableHead = getDiffDate(this.search.date + '-01', getCurrentMonthLastDay(this.search.date))
      this.getList()
    },
    async exportTable() {
      await this.$set(this, 'exportTableShow', true)
      await exportExcel('月产量完成报表')
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
    dateArr.push(d + '日')
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
.dailyOutputCompleted{
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
        transform:rotate(17.8deg);
        width:160px;
        position: absolute;
        top:0px;
        left:-6px;
    }
    }
</style>
