<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="beginTime"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择日期"
          @change="dateChange"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="endTime"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择日期"
          @change="dateChange"
        />
      </el-form-item>
      <el-form-item label="合格率类型">
        <el-select v-model="value1" multiple placeholder="请选择" @change="changeSearch">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      v-if="value1.length == 0 || value1.indexOf('综合合格率') > -1"
      :data="tableData"
      size="small"
      border
      :max-height="(value1.length === 0 || value1.length === 3) ? 200 : value1.length === 1 ? 600 : 280"
      style="width: 100%"
    >
      <el-table-column label="综合合格率">
        <el-table-column fixed type="index" label="No" />
        <el-table-column fixed label="胶料编码">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="monthPassClick(scope.row.product_no)">{{ scope.row.product_no }}</el-link>
          </template>
        </el-table-column>
        <el-table-column v-for="(value,index) in headers" :key="index" :label="dateFormat(value)" align="center">
          <template slot-scope="scope">
            <span
              v-if="(scope.row.dates.filter(d=>d.date === value)).length>0"
              :style="getStyle((scope.row.dates.filter(d=>d.date === value))[0].zh_percent_of_pass)"
            >
              {{ (scope.row.dates.filter(d=>d.date === value))[0].zh_percent_of_pass }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-table
      v-if="value1.length == 0 || value1.indexOf('一次合格率') > -1"
      :data="tableData"
      border
      size="small"
      :max-height="(value1.length === 0 || value1.length === 3) ? 200 : value1.length === 1 ? 600 : 280"
      style="width: 100%"
    >
      <el-table-column label="一次合格率">
        <el-table-column fixed type="index" label="No" />
        <el-table-column fixed label="胶料编码">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="monthPassClick(scope.row.product_no)">{{ scope.row.product_no }}</el-link>
          </template>
        </el-table-column>
        <el-table-column v-for="(value,index) in headers" :key="index" :label="dateFormat(value)" align="center">
          <template slot-scope="scope">
            <span
              v-if="(scope.row.dates.filter(d=>d.date === value)).length>0"
              :style="getStyle((scope.row.dates.filter(d=>d.date === value))[0].yc_percent_of_pass)"
            >
              {{ (scope.row.dates.filter(d=>d.date === value))[0].yc_percent_of_pass }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-table
      v-if="value1.length == 0 || value1.indexOf('流变合格率') > -1"
      :data="tableData"
      border
      size="small"
      :max-height="(value1.length === 0 || value1.length === 3) ? 200 : value1.length === 1 ? 600 : 280"
      style="width: 100%"
    >
      <el-table-column label="流变合格率">
        <el-table-column fixed type="index" label="No" />
        <el-table-column fixed label="胶料编码">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="monthPassClick(scope.row.product_no)">{{ scope.row.product_no }}</el-link>
          </template>
        </el-table-column>
        <el-table-column v-for="(value,index) in headers" :key="index" :label="dateFormat(value)" align="center">
          <template slot-scope="scope">
            <span
              v-if="(scope.row.dates.filter(d=>d.date === value)).length>0"
              :style="getStyle((scope.row.dates.filter(d=>d.date === value))[0].lb_percent_of_pass)"
            >
              {{ (scope.row.dates.filter(d=>d.date === value))[0].lb_percent_of_pass }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      title="胶料月合格率详情"
      :visible.sync="dialogShow"
    >
      <el-table
        :data="detailData"
        border
        :cell-style="cellStyle"
        style="width: 100%"
      >
        <el-table-column fixed type="index" label="No" />
        <el-table-column fixed label="月份">
          <template slot-scope="scope">
            {{ dateFormat(scope.row.date) }}
          </template>
        </el-table-column>
        <el-table-column fixed width="140" label="规格名称">
          {{ getParams.product_no }}
        </el-table-column>
        <el-table-column fixed label="产量(车)" prop="train_count" />
        <el-table-column fixed label="一次合格率%" prop="yc_percent_of_pass" />
        <el-table-column fixed label="流变合格率%" prop="lb_percent_of_pass" />
        <el-table-column fixed label="综合合格率%" prop="zh_percent_of_pass" />
        <el-table-column v-for="(value,index) in detailHeaders.points" :key="index" :label="value" align="center">
          <el-table-column label="+" align="center">
            <template slot-scope="scope">
              <span
                v-if="(scope.row.points.filter(d=>d.name === value)).length>0"
              >
                {{ (scope.row.points.filter(d=>d.name === value))[0].upper_limit_count }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="%" align="center">
            <template slot-scope="scope">
              <span
                v-if="(scope.row.points.filter(d=>d.name === value)).length>0"
                :style="getStyle((scope.row.points.filter(d=>d.name === value))[0].upper_limit_percent)"
              >
                {{ (scope.row.points.filter(d=>d.name === value))[0].upper_limit_percent }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="-" align="center">
            <template slot-scope="scope">
              <span
                v-if="(scope.row.points.filter(d=>d.name === value)).length>0"
              >
                {{ (scope.row.points.filter(d=>d.name === value))[0].lower_limit_count }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="%" align="center">
            <template slot-scope="scope">
              <span
                v-if="(scope.row.points.filter(d=>d.name === value)).length>0"
                :style="getStyle((scope.row.points.filter(d=>d.name === value))[0].lower_limit_percent)"
              >
                {{ (scope.row.points.filter(d=>d.name === value))[0].lower_limit_percent }}
              </span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getBatchProductNoMonthStatistics, getStatisticHeaders } from '@/api/passStatistics'
import dayjs from 'dayjs'

export default {
  components: { },
  data() {
    return {
      beginTime: dayjs().startOf('year').format('YYYY-MM'),
      endTime: dayjs().endOf('month').format('YYYY-MM'),
      getParams: { all: 1 },
      headers: [],
      detailHeaders: {},
      dialogShow: false,
      tableData: [],
      detailData: [],
      options: ['综合合格率', '一次合格率', '流变合格率'],
      value1: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.getParams = { all: 1 }
      this.getParams.start_time = this.beginTime
      this.getParams.end_time = this.endTime
      getBatchProductNoMonthStatistics(this.getParams).then(response => {
        this.tableData = response
        // this.total = response.count
        this.getHeaders()
      })
    },
    dateFormat(date) {
      return dayjs(date).format('YYYY-MM')
    },
    dateChange() {
      if (this.beginTime) {
        this.beginTime = dayjs(this.beginTime).startOf('month').format('YYYY-MM')
      }
      if (this.endTime) {
        this.endTime = dayjs(this.endTime).endOf('month').format('YYYY-MM')
      }
      this.getTableData()
    },
    getDetailHeaders() {
      getStatisticHeaders().then(response => {
        this.detailHeaders = response
      })
    },
    getHeaders() {
      this.headers = []
      this.tableData.forEach((product_no) => {
        product_no.dates.forEach((date) => {
          if (this.headers.indexOf(date.date) === -1) {
            this.headers.push(date.date)
          }
        }
        )
      })
    },
    monthPassClick(product_no) {
      this.dialogShow = true
      this.getDetailHeaders()
      this.getParams.product_no = product_no
      getBatchProductNoMonthStatistics(this.getParams).then(response => {
        this.detailData = response[0].dates
        // this.total = response.count
      })
    },
    getHeight() {
      return (this.value1.length === 0 || this.value1.length === 3) ? 20 : this.value1.length === 1 ? 60 : 30
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      var cc = column.property
      if (row[cc] && cc !== 'train_count') {
        if (Number((row[cc]).replace('%', '')) < 96) {
          return 'color: #EA1B29'
        }
      }
    },
    getStyle(str) {
      if (str) {
        return Number(str.replace('%', '')) < 96 ? 'color: #EA1B29' : 'color: #1a1a1b'
      } else {
        return 'color: #EA1B29'
      }
    },
    changeSearch() {
    }
  }
}
</script>

<style>

</style>
