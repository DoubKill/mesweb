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
    </el-form>
    <el-table
      :data="tableData"
      border
      :cell-style="cellStyle"
      style="width: 100%"
    >
      <el-table-column fixed type="index" label="No" />
      <el-table-column fixed label="月份" prop="date">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="monthPassClick(scope.row.date)">{{ dateFormat(scope.row.date) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column fixed label="产量/车" prop="actual_trains" />
      <el-table-column fixed label="一次合格率%" width="75" prop="yc_percent_of_pass" />
      <el-table-column fixed label="流变合格率%" width="75" prop="lb_percent_of_pass" />
      <el-table-column fixed label="综合合格率%" width="75" prop="zh_percent_of_pass" />
      <el-table-column v-for="(value,index) in headers.points" :key="index" :label="value" align="center">
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
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="90%"
      title="合格率统计"
      :visible.sync="dialogShow"
    >
      <el-row>
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
            <el-table-column width="50" type="index" label="No" />
            <el-table-column width="90" label="日期" prop="date" />
            <el-table-column label="一次合格率%" prop="yc_percent_of_pass" />
            <el-table-column label="流变合格率%" prop="lb_percent_of_pass" />
            <el-table-column label="综合合格率%" prop="zh_percent_of_pass" />
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
            <el-table-column fixed width="50" type="index" label="No" />
            <el-table-column fixed width="90" label="日期" prop="date" />
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
            <el-table-column fixed width="50" type="index" label="No" />
            <el-table-column fixed width="90" label="日期" prop="date" />
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
    </el-dialog>
  </div>
</template>

<script>
import { getBatchMonthStatistics, getBatchDayStatistics, getStatisticHeaders } from '@/api/passStatistics'
import dayjs from 'dayjs'

export default {
  components: { },
  data() {
    return {
      beginTime: dayjs().startOf('year').format('YYYY-MM'),
      endTime: dayjs().endOf('month').format('YYYY-MM'),
      headers: {},
      getParams: { all: 1 },
      getDayParams: { all: 1 },
      dialogShow: false,
      tableData: [],
      dayTableData: []
    }
  },
  created() {
    this.getHeaders()
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.getParams.start_time = this.beginTime
      this.getParams.end_time = this.endTime
      getBatchMonthStatistics(this.getParams).then(response => {
        this.tableData = response.results
        // this.total = response.count
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
    getHeaders() {
      getStatisticHeaders().then(response => {
        this.headers = response
      })
    },
    monthPassClick(date) {
      this.getDayParams.date = dayjs(date).startOf('month').format('YYYY-MM')
      getBatchDayStatistics(this.getDayParams).then(response => {
        this.dayTableData = response.results
        // this.total = response.count
      })
      this.dialogShow = true
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      var cc = column.property
      if (row[cc]) {
        if (Number((row[cc]).replace('%', '')) < 98) {
          return 'color: #EA1B29'
        }
      }
    },
    getStyle(str) {
      if (str) {
        return Number(str.replace('%', '')) < 98 ? 'color: #EA1B29' : 'color: #1a1a1b'
      } else {
        return 'color: #EA1B29'
      }
    }
  }
}
</script>

<style lang="scss">
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
}
</style>
