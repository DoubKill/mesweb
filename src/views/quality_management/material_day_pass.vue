<template>
  <div class="app-container month_pass_detail">
    <!-- 胶料日合格率统计 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="searchTime"
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
    <div v-loading="loading">
      <el-table
        v-if="value1.length == 0 || value1.indexOf('综合合格率') > -1"
        :data="tableData"
        size="mini"
        border
        :max-height="(value1.length === 0 || value1.length === 3) ? 200 : value1.length === 1 ? 600 : 280"
        style="width: 100%"
      >
        <el-table-column label="综合合格率">
          <el-table-column fixed type="index" label="No" align="center" />
          <el-table-column fixed label="胶料编码" min-width="130" align="center">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="dayPassClick(scope.row.product_no)">{{ scope.row.product_no }}</el-link>
            </template>
          </el-table-column>
          <el-table-column v-for="(value,index) in headers" :key="index" min-width="78" :label="value" align="center">
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
          <el-table-column fixed type="index" label="No" align="center" />
          <el-table-column fixed label="胶料编码" min-width="130" align="center">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="dayPassClick(scope.row.product_no)">{{ scope.row.product_no }}</el-link>
            </template>
          </el-table-column>
          <el-table-column v-for="(value,index) in headers" :key="index" min-width="78" :label="value" align="center">
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
          <el-table-column fixed type="index" label="No" align="center" />
          <el-table-column fixed label="胶料编码" min-width="130" align="center">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="dayPassClick(scope.row.product_no)">{{ scope.row.product_no }}</el-link>
            </template>
          </el-table-column>
          <el-table-column v-for="(value,index) in headers" :key="index" min-width="78" :label="value" align="center">
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
    </div>
    <el-dialog
      :close-on-press-escape="false"
      width="95%"
      title="胶料日合格率详情"
      :visible.sync="dialogShow"
    >
      <div v-loading="dialogLoading" class="table_data">
        <el-table
          :data="detailData"
          border
          :cell-style="cellStyle"
          style="width: 100%"
        >
          <el-table-column fixed type="index" label="No" width="14" align="center" />
          <el-table-column fixed width="64" label="日期" prop="date" align="center" />
          <el-table-column fixed width="96" label="规格名称" align="center">
            {{ getParams.product_no }}
          </el-table-column>
          <el-table-column fixed label="产量(车)" min-width="32" prop="train_count" align="center" />
          <el-table-column fixed label="一次合格率%" min-width="46" prop="yc_percent_of_pass" align="center" />
          <el-table-column fixed label="流变合格率%" min-width="46" prop="lb_percent_of_pass" align="center" />
          <el-table-column fixed label="综合合格率%" min-width="46" prop="zh_percent_of_pass" align="center" />
          <el-table-column v-for="(value,index) in detailHeaders.points" :key="index" :label="value" align="center">
            <el-table-column label="+" align="center" min-width="20">
              <template slot-scope="scope">
                <span
                  v-if="(scope.row.points.filter(d=>d.name === value)).length>0"
                >
                  {{ (scope.row.points.filter(d=>d.name === value))[0].upper_limit_count }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="%" align="center" min-width="46">
              <template slot-scope="scope">
                <span
                  v-if="(scope.row.points.filter(d=>d.name === value)).length>0"
                  :style="getStyle((scope.row.points.filter(d=>d.name === value))[0].upper_limit_percent)"
                >
                  {{ (scope.row.points.filter(d=>d.name === value))[0].upper_limit_percent }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="-" align="center" min-width="20">
              <template slot-scope="scope">
                <span
                  v-if="(scope.row.points.filter(d=>d.name === value)).length>0"
                >
                  {{ (scope.row.points.filter(d=>d.name === value))[0].lower_limit_count }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="%" align="center" min-width="46">
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
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBatchProductNoDayStatistics, getStatisticHeaders } from '@/api/passStatistics'
import dayjs from 'dayjs'

export default {
  components: { },
  data() {
    return {
      searchTime: dayjs().format('YYYY-MM'),
      getParams: { all: 1 },
      headers: [],
      detailHeaders: {},
      dialogShow: false,
      tableData: [],
      detailData: [],
      options: ['综合合格率', '一次合格率', '流变合格率'],
      value1: [],
      loading: true,
      dialogLoading: false
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.getParams = { all: 1 }
      this.getParams.date = this.searchTime
      this.loading = true
      getBatchProductNoDayStatistics(this.getParams).then(response => {
        this.tableData = response
        // this.total = response.count
        this.loading = false
        this.getHeaders()
      }).catch(e => {
        this.loading = false
      })
    },
    dateFormat(date) {
      return dayjs(date).format('YYYY-MM')
    },
    dateChange() {
      if (this.searchTime) {
        this.searchTime = dayjs(this.searchTime).format('YYYY-MM')
      }
      this.getTableData()
    },
    getDetailHeaders() {
      getStatisticHeaders().then(response => {
        this.detailHeaders = response
      })
    },
    getHeaders() {
      this.tableData.forEach((product_no) => {
        product_no.dates.forEach((date) => {
          if (this.headers.indexOf(date.date) === -1) {
            this.headers.push(date.date)
          }
        }
        )
      })
    },
    dayPassClick(product_no) {
      this.dialogShow = true
      this.dialogLoading = true
      this.getDetailHeaders()
      this.getParams.product_no = product_no
      getBatchProductNoDayStatistics(this.getParams).then(response => {
        this.detailData = response[0].dates
        // this.total = response.count
        this.dialogLoading = false
      }).catch(e => {
        this.dialogLoading = false
      })
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
