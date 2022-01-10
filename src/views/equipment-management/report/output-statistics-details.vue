<template>
  <div>
    <!-- 月产量统计明细及绩效 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.day_time"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="机台">
        <selectEquip
          :equip_no_props.sync="search.equip_no"
          :is-created="true"
          @changeSearch="equipChange"
        />
      </el-form-item>
      <el-form-item label="单位">
        <el-select v-model="search.type" placeholder="请选择" @change="getList">
          <el-option
            v-for="item in ['车','吨']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="getList"
        >查询</el-button>
        <el-button
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
      <el-table-column width="120px">
        <template
          slot="header"
          slot-scope="{row}"
        >
          <span v-if="false">{{ row }}</span>
          <div v-if="!exportTableShow" class="header-style">
            <div style="width:100%;text-align:right;margin:8px 0 20px 0">时间</div>
            <span>段数/项目</span>
            <div class="header-style-line three-line" />
          </div>
          <div v-else>段数/项目</div>
        </template>
        <template
          slot-scope="{row}"
        >
          <span>{{ row.sn }}</span>
        </template>
      </el-table-column>
      <template v-for="(d,index) in tableHead">
        <el-table-column
          :key="index"
          align="center"
          :label="d.label"
          min-width="20"
        >
          <el-table-column
            align="center"
            label="A"
            width="40"
          >
            <template slot-scope="{row}">
              {{ row[d.prop+'A'] }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="C"
            width="40"
          >
            <template slot-scope="{row}">
              {{ row[d.prop+'C'] }}
            </template>
          </el-table-column>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import selectEquip from '@/components/select_w/equip'
import { productClassesPlanReal } from '@/api/base_w_four'
import { exportExcel } from '@/utils/index'
import { setDate } from '@/utils'
export default {
  name: 'OutputStatisticsDetails',
  components: { selectEquip },
  data() {
    return {
      search: {
        day_time: setDate(null, null, 'month'),
        type: '车'
      },
      loading: false,
      tableHead: [],
      tableData: [],
      exportTableShow: false
    }
  },
  created() {
    this.tableHead = getDiffDate(this.search.day_time + '-01', getCurrentMonthLastDay(setDate()))
    // this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await productClassesPlanReal('get', null, { params: this.search })
        this.tableData = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.tableHead = getDiffDate(this.search.day_time + '-01', getCurrentMonthLastDay(this.search.day_time))
      this.getList()
    },
    equipChange(val) {
      this.search.equip_no = val
    //   this.getList()
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
    var year = startTime.getFullYear()
    var d = startTime.getDate()
    var month = startTime.getMonth().toString().length === 1 ? '0' + (parseInt(startTime.getMonth().toString(), 10) + 1) : (startTime.getMonth() + 1)
    var day = startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate()
    dateArr.push({ label: d + '日', prop: year + '年' + month + '月' + day + '日' })
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

<style scope>
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
</style>
