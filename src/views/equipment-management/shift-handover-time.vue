<template>
  <div>
    <!-- 交接班时间汇总 -->
    <el-form :inline="true">
      <el-form-item label="工厂日期">
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
      <el-form-item label="班次:">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <!-- <el-form-item label="班组">
        <el-select
          v-model="search.group"
          clearable
          placeholder="请选择"
          @change="getList"
          @visible-change="getClassGroup"
        >
          <el-option
            v-for="group in groups"
            :key="group.id"
            :label="group.global_name"
            :value="group.global_name"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          @click="exportTable()"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :span-method="arraySpanMethod"
      :data="tableData"
      border
    >
      <el-table-column
        prop="factory_date"
        align="center"
        label="日期"
        width="90"
      />
      <el-table-column
        prop="classes"
        align="center"
        label="班次"
        width="60"
      />
      <el-table-column
        prop="group"
        align="center"
        label="班组"
        width="60"
      />
      <template v-for="(d,index) in equipList">
        <el-table-column
          :key="index"
          align="center"
          :label="d"
          min-width="20"
        >
          <el-table-column
            :prop="d"
            align="center"
            label="交接班耗时(分)"
            width="70"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.factory_date==='交接班时间标准'">{{ scope.row[d+'_time_consuming']*100!==0?scope.row[d+'_time_consuming']:null }}</span>
              <el-link v-if="scope.row.factory_date!=='平均值'&&scope.row.factory_date!=='交接班时间标准'" type="primary" @click="dialog(scope)">{{ scope.row[d+'_time_consuming'] }}</el-link>
              <span v-if="scope.row.factory_date==='平均值'">{{ scope.row[d+'_time_consuming']*100!==0?scope.row[d+'_time_consuming']:null }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :prop="d"
            align="center"
            label="异常耗时(分)"
            width="70"
          >
            <template slot-scope="scope">
              <el-link v-if="scope.row.factory_date!=='平均值'" type="primary" @click="dialog(scope)">{{ scope.row[d+'_time_abnormal'] }}</el-link>
              <span v-else>{{ scope.row[d+'_time_abnormal']*100!==0?scope.row[d+'_time_abnormal']:null }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            :prop="d"
            label="交接班时间标准"
            width="70"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.factory_date!=='平均值'" type="primary">{{ scope.row[d+'_standard_time'] }}</span>
              <span v-else>{{ scope.row[d+'_standard_time']*100!==0?scope.row[d+'_standard_time']:null }}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            :prop="d"
            align="center"
            label="交接班时间完成率"
            width="70"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.factory_date!=='平均值'" type="primary">{{ scope.row[d+'_rate']?scope.row[d+'_rate'] +'%':null }}</span>
              <span v-else>{{ scope.row[d+'_rate']*100!==0?scope.row[d+'_rate']+'%':null }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </template>
      <el-table-column
        prop="count"
        align="center"
        label="班次平均"
        min-width="20"
      >
        <el-table-column
          align="center"
          label="交接班耗时(分)"
          width="70"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.consuming*100!==0?scope.row.consuming:null }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="异常耗时(分)"
          width="60"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.abnormal*100!==0?scope.row.abnormal:null }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-dialog
      title="交接班时间明细"
      width="20%"
      :visible.sync="dialogVisible"
    >
      <el-table
        v-loading="loading1"
        :data="tableData1"
        border
      >
        <el-table-column
          prop="begin"
          label="开始时间"
          min-width="20"
        />
        <el-table-column
          prop="end"
          label="结束时间"
          min-width="20"
        />
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import { shiftTimeSummary, shiftTimeSummaryDetail } from '@/api/jqy'
import classSelect from '@/components/ClassSelect'
import { globalCodesUrl } from '@/api/base_w'
import { exportExcel, setDate } from '@/utils/index'
export default {
  name: 'ShiftHandoverTime',
  components: { classSelect },
  data() {
    return {
      groups: [],
      dateValue: [setDate(null, null, 'month') + '-01', setDate()],
      search: {},
      date: null,
      equipList: ['Z01', 'Z02', 'Z03', 'Z04', 'Z05', 'Z06', 'Z07', 'Z08', 'Z09', 'Z10', 'Z11', 'Z12', 'Z13', 'Z14', 'Z15'],
      dialogVisible: false,
      loading: false,
      loading1: false,
      tableData: [],
      tableData1: []
    }
  },
  created() {
    this.search.st = this.dateValue[0]
    this.search.et = this.dateValue[1]
    this.getList()
  },
  methods: {
    classChanged(val) {
      this.search.classes = val
      this.getList()
    },
    getClassGroup(val) {
      if (val) {
        globalCodesUrl('get', {
          params: {
            class_name: '班组'
          }
        }).then((response) => {
          this.groups = response.results
        }).catch(function() {
        })
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await shiftTimeSummary('get', null, { params: this.search })
        this.tableData = data.results
        if (this.tableData.length > 0) {
          this.tableData.forEach
          this.tableData.push({
            factory_date: '平均值',
            consuming: (sum(this.tableData, 'consuming') / (sumNull(this.tableData, 'consuming'))).toFixed(2),
            abnormal: (sum(this.tableData, 'abnormal') / (sumNull(this.tableData, 'abnormal'))).toFixed(2)
          })
          const index = this.tableData.length
          this.equipList.forEach(d => {
            this.tableData[index - 1][d + '_time_abnormal'] = (sum(this.tableData, [d] + '_time_abnormal') / (sumNull(this.tableData, [d] + '_time_abnormal'))).toFixed(2)
            this.tableData[index - 1][d + '_time_consuming'] = (sum(this.tableData, [d] + '_time_consuming') / (sumNull(this.tableData, [d] + '_time_consuming'))).toFixed(2)
            this.tableData[index - 1][d + '_rate'] = (sum(this.tableData, [d] + '_rate') / (sumNull(this.tableData, [d] + '_rate'))).toFixed(2)
          })
          this.tableData.unshift({
            factory_date: '交接班时间标准'
          })
          this.equipList.forEach(d => {
            this.tableData[0][d + '_time_consuming'] = data.equip_sts_time[d]
          })
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeDate(arr) {
      this.search.st = arr ? arr[0] : ''
      this.search.et = arr ? arr[1] : ''
      this.getList()
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex / 2 === 0) {
        if (columnIndex < 48) {
          if (columnIndex % 3 === 0) {
            return {
              rowspan: 1,
              colspan: 3
            }
          } else {
            return {
              rowspan: 1,
              colspan: 0
            }
          }
        }
      }
    },
    async dialog(scope) {
      const obj = {
        factory_date: scope.row.factory_date,
        classes: scope.row.classes,
        equip_no: scope.column.property
      }
      this.dialogVisible = true
      try {
        this.loading1 = true
        const data = await shiftTimeSummaryDetail('get', null, { params: obj })
        this.tableData1 = [data.results]
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
      }
    },
    exportTable() {
      exportExcel('交接班时间统计')
    }
  }

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
function sumNull(arr, params) {
  var s = 0
  arr.forEach(d => {
    if (d[params]) {
      s++
    }
  })
  s = s > 0 ? s : 1
  return s
}

</script>

<style  lang="scss">
</style>
