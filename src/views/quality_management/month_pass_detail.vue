<template>
  <div class="app-container month_pass_detail">
    <!-- 月快检合格率统计 -->
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
      <el-form-item>
        <el-button type="primary" @click="chartDialog">图表</el-button>
      </el-form-item>

    </el-form>
    <div class="table_data">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        size="mini"
        :cell-style="cellStyle"
        :header-row-style="headerRowStyle"
        style="width: 100%"
      >
        <!-- <el-table-column fixed width="30" label="No" align="center" type="selection" /> -->
        <el-table-column fixed label="月份" width="54" prop="date" align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="monthPassClick(scope.row.date)">{{ dateFormat(scope.row.date) }}</el-link>
          </template>
        </el-table-column>
        <el-table-column fixed label="产量(车)" min-width="32" prop="train_count" align="center" />
        <el-table-column fixed label="一次合格率%" min-width="54" prop="yc_percent_of_pass" align="center" />
        <el-table-column fixed label="流变合格率%" min-width="46" prop="lb_percent_of_pass" align="center" />
        <el-table-column fixed label="综合合格率%" min-width="46" prop="zh_percent_of_pass" align="center" />
        <el-table-column v-for="(value,index) in headers.points" :key="index" :label="value" align="center">
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
                {{ ((scope.row.points.filter(d=>d.name === value))[0].lower_limit_percent) }}
              </span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :close-on-press-escape="false"
      width="98%"
      title="合格率统计"
      :visible.sync="dialogShow"
    >
      <div v-loading="dialogTableLoading">
        <el-row>
          <el-button :disabled="dialogTableLoading" type="primary" class="tubiao" @click="chartTojiDialog">图表</el-button>
          <el-col :span="8">
            <span>总合格率</span>
            <el-table
              :data="dayTableData"
              size="small"
              border
              :cell-style="cellStyle"
              class="header body"
              style="width: 100%"
            >
              <!-- <el-table-column label="总合格率"> -->
              <el-table-column type="index" label="No" align="center" />
              <el-table-column label="日期" prop="date" align="center" />
              <el-table-column label="一次合格率%" prop="yc_percent_of_pass" align="center" />
              <el-table-column label="流变合格率%" prop="lb_percent_of_pass" align="center" />
              <el-table-column label="综合合格率%" prop="zh_percent_of_pass" align="center" />
            <!-- </el-table-column> -->
            </el-table>
          </el-col>
          <el-col :span="8">
            <span>机台别合格率</span>
            <el-table
              :data="dayTableData"
              border
              size="small"
              class="header2 body"
              style="width: 100%"
            >
              <!-- <el-table-column label="机台别合格率"> -->
              <!-- <el-table-column fixed width="50" type="index" label="No" />
            <el-table-column fixed width="90" label="日期" prop="date" /> -->
              <el-table-column v-for="(value,index) in headers.equips" :key="index" :label="value" align="center">
                <el-table-column label="一次合格率%" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="(scope.row.equips.filter(d=>d.production_equip_no === value)).length>0"
                      :style="getStyle((scope.row.equips.filter(d=>d.production_equip_no === value))[0].yc_percent_of_pass)"
                    >
                      {{ (scope.row.equips.filter(d=>d.production_equip_no === value))[0].yc_percent_of_pass }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="流变合格率%" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="(scope.row.equips.filter(d=>d.production_equip_no === value)).length>0"
                      :style="getStyle((scope.row.equips.filter(d=>d.production_equip_no === value))[0].lb_percent_of_pass)"
                    >
                      {{ (scope.row.equips.filter(d=>d.production_equip_no === value))[0].lb_percent_of_pass }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="综合合格率%" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="(scope.row.equips.filter(d=>d.production_equip_no === value)).length>0"
                      :style="getStyle((scope.row.equips.filter(d=>d.production_equip_no === value))[0].zh_percent_of_pass)"
                    >
                      {{ (scope.row.equips.filter(d=>d.production_equip_no === value))[0].zh_percent_of_pass }}
                    </span>
                  </template>
                </el-table-column>
              </el-table-column>
            <!-- </el-table-column> -->
            </el-table>
          </el-col>
          <el-col :span="8">
            <span>班组别合格率</span>
            <el-table
              :data="dayTableData"
              border
              size="small"
              class="header2 body"
              style="width: 100%"
            >
              <!-- <el-table-column label="班组别合格率"> -->
              <!-- <el-table-column fixed width="50" type="index" label="No" />
            <el-table-column fixed width="90" label="日期" prop="date" /> -->
              <el-table-column v-for="(value,index) in headers.classes" :key="index" :label="value" align="center">
                <el-table-column label="一次合格率%" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="(scope.row.classes.filter(d=>d.production_class === value)).length>0"
                      :style="getStyle((scope.row.classes.filter(d=>d.production_class === value))[0].yc_percent_of_pass)"
                    >
                      {{ (scope.row.classes.filter(d=>d.production_class === value))[0].yc_percent_of_pass }}
                    </span>
                  <!-- <span v-if="scope.row.test_detail[value]">{{ scope.row.test_detail[value].up_trains }}</span> -->
                  </template>
                </el-table-column>
                <el-table-column label="流变合格率%" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="(scope.row.classes.filter(d=>d.production_class === value)).length>0"
                      :style="getStyle((scope.row.classes.filter(d=>d.production_class === value))[0].yc_percent_of_pass)"
                    >
                      {{ (scope.row.classes.filter(d=>d.production_class === value))[0].lb_percent_of_pass }}
                    </span>
                  <!-- <span v-if="scope.row.test_detail[value]">{{ scope.row.test_detail[value].up_trains }}</span> -->
                  </template>
                </el-table-column>
                <el-table-column label="综合合格率%" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="(scope.row.classes.filter(d=>d.production_class === value)).length>0"
                      :style="getStyle((scope.row.classes.filter(d=>d.production_class === value))[0].yc_percent_of_pass)"
                    >
                      {{ (scope.row.classes.filter(d=>d.production_class === value))[0].zh_percent_of_pass }}
                    </span>
                  <!-- <span v-if="scope.row.test_detail[value]">{{ scope.row.test_detail[value].up_trains }}</span> -->
                  </template>
                </el-table-column>
              </el-table-column>
            <!-- </el-table-column> -->
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 图表 -->
    <div v-if="comprehensiveBarShow">
      <monthpassdetailChart ref="monthpassdetailChart" :chartsdata="chartsdatas" :headers="headers" :comprehensive-bar-show="comprehensiveBarShow" />
    </div>

    <el-dialog :visible.sync="chartTojiDialogVisible" title="月快检合格率" width="90%">
      <monthpassdetailChart2 :data-list="dayTableData" :headers="headers" />
    </el-dialog>
  </div>
</template>

<script>
import { getBatchMonthStatistics, getBatchDayStatistics, getStatisticHeaders } from '@/api/passStatistics'
import monthpassdetailChart from '@/components/MonthPassdeTailChart'
import monthpassdetailChart2 from '@/components/MonthPassdeTailChart2'
import dayjs from 'dayjs'
export default {
  components: { monthpassdetailChart, monthpassdetailChart2 },
  data() {
    return {
      beginTime: dayjs().startOf('year').format('YYYY-MM'),
      endTime: dayjs().endOf('month').format('YYYY-MM'),
      headers: {},
      getParams: { all: 1 },
      getDayParams: { all: 1 },
      dialogShow: false,
      tableData: [],
      dayTableData: [],
      dialogTableLoading: false,
      chartTojiDialogVisible: false,
      comprehensiveBarShow: false,
      tableLoading: true,
      chartsdatas: [],
      barShow: false
      // 图表
    }
  },
  watch: {
    comprehensiveBarShow(val) {
      this.barShow = val
    }
  },
  created() {
    this.getHeaders()
    this.getTableData()
  },
  methods: {
    chartDialog() {
      this.comprehensiveBarShow = !this.comprehensiveBarShow
      this.chartsdatas = this.tableData
    },
    chartTojiDialog() {
      this.chartTojiDialogVisible = true
    },
    getTableData() {
      this.getParams.start_time = this.beginTime
      this.getParams.end_time = this.endTime
      this.tableLoading = true
      this.tableData = []
      getBatchMonthStatistics(this.getParams).then(response => {
        this.tableData = response
        this.tableLoading = false
        // this.total = response.count
      }).catch(e => {
        this.tableLoading = false
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
      this.comprehensiveBarShow = false
      this.getTableData()
    },
    getHeaders() {
      getStatisticHeaders().then(response => {
        this.headers = response
      })
    },
    monthPassClick(date) {
      this.dayTableData = []
      this.getDayParams.date = dayjs(date).startOf('month').format('YYYY-MM')
      this.dialogTableLoading = true
      getBatchDayStatistics(this.getDayParams).then(response => {
        this.dayTableData = response
        this.dialogTableLoading = false
        // this.total = response.count
      }).catch(e => {
        this.dialogTableLoading = false
      })
      this.dialogShow = true
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      var cc = column.property
      if (row[cc] && cc !== 'train_count') {
        if (Number((row[cc]).replace('%', '')) < 96) {
          return 'color: #EA1B29'
        }
      }
    },
    headerRowStyle() {
      return 'height:100px'
    },
    getStyle(str) {
      if (str) {
        return Number(str.replace('%', '')) < 96 ? 'color: #EA1B29' : 'color: #1a1a1b'
      } else {
        return 'color: #EA1B29'
      }
    }
  }
}
</script>

<style lang="scss">
.month_pass_detail{
.header tr,
  .header th {
    padding: 0;
    height: 84px;
    background: #F5F7FA;
}
.header2 tr,
  .header2 th {
    padding: 0;
    height: 40px;
}
.el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 40px;
    background: #ffffff;
    // font-size: 1px;
    // transform: scale(1);
}
.tubiao{
  position: absolute;
  left: 110px;
  top:-70px;
}
  .table_data{
    .el-table .cell {
      font-size: 12px;
      padding: 0 !important;
      // transform: scale(0.5);
    }
    .el-table .cell span {
      padding: 0 !important;
    }
  }
}
</style>
