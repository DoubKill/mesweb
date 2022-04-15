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
      <el-form-item label="班组">
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
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['durate_putin_reason','export']"
          type="primary"
          @click="exportTable()"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="date"
        label="日期"
        width="60"
      />
      <el-table-column
        prop="classes"
        label="班次"
        width="60"
      />
      <el-table-column
        prop="group"
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
            label="交接班耗时(分)"
            width="60"
          >
            <template slot-scope="scope">
              <el-link v-if="scope.row.date==='平均值'" type="primary" @click="dialog(scope)">{{ scope.row[d.prop]===0?null:scope.row[d.prop] }}</el-link>
              <span v-else>{{ scope.row[d.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="异常耗时(分)"
            width="60"
          >
            <template slot-scope="scope">
              <el-link v-if="scope.row.date==='平均值'" type="primary" @click="dialog(scope.row)">{{ scope.row[d.prop]===0?null:scope.row[d.prop] }}</el-link>
              <span v-else>{{ scope.row[d.prop] }}</span>
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
          label="交接班耗时(分)"
          width="60"
        />
        <el-table-column
          label="异常耗时(分)"
          width="60"
        />
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
          prop="不入库原因"
          label="开始时间"
          min-width="20"
        />
        <el-table-column
          prop="不入库原因"
          label="结束时间"
          min-width="20"
        />
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import { duratePutinReson } from '@/api/jqy'
import classSelect from '@/components/ClassSelect'
import { globalCodesUrl } from '@/api/base_w'
import { exportExcel, setDate } from '@/utils/index'
export default {
  name: 'ShiftHandoverTime',
  components: { classSelect },
  data() {
    return {
      groups: [],
      dateValue: [setDate(), setDate()],
      search: {},
      date: null,
      tableHead: [],
      equipList: ['Z01', 'Z02', 'Z03', 'Z04', 'Z05', 'Z06', 'Z07', 'Z08', 'Z09', 'Z10', 'Z11', 'Z12', 'Z13', 'Z14', 'Z15'],
      dialogVisible: false,
      loading: false,
      loading1: false,
      tableData: [],
      tableData1: []
    }
  },
  created() {
    this.search.s_time = this.dateValue[0]
    this.search.e_time = this.dateValue[1]
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
        const data = await duratePutinReson('get', null, { params: this.search })
        this.tableData = data.results
        if (this.tableData.length > 0) {
          const index = this.tableData.length
          this.tableData.push({
            date: '平均值'
          })
          this.tableHead.forEach(d => {
            this.tableData[index][d.prop] = sum(this.tableData, d.prop)
          })
          this.tableData[index].count = sum(this.tableData, 'count') / this.tableData.length
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      this.getList()
    },
    async dialog(row) {
      this.dialogVisible = true
      try {
        this.loading1 = true
        const data = await duratePutinReson('get', null, { params: { factory_date: this.date }})
        this.tableData1 = data.results
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

</script>

<style  lang="scss">
</style>
