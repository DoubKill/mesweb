<template>
  <div>
    <!-- 规格切换时间明细 -->
    <h3>{{ type==='明细'?'规格切换时间明细':'规格切换时间汇总' }}</h3>
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
      <!-- <el-form-item label="时间:">
        <el-date-picker
          v-model="search.st"
          type="date"
          placeholder="日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item> -->
      <!-- <el-form-item>
        <el-radio-group v-model="search.radio">
          <el-radio :label="1">自然日</el-radio>
          <el-radio :label="2">工厂时间</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <br> -->
      <!-- <el-form-item label="时间跨度:">
        <time-span-select
          :equip_no_props.sync="search.equip_no"
          @changeSearch="timeSpanChanged"
        />
      </el-form-item> -->
      <el-form-item v-if="type==='明细'" label="机台">
        <equip-select
          :equip_no_props.sync="search.equip_no"
          :is-created="true"
          @changeSearch="equipChanged"
        />
      </el-form-item>
      <!-- <el-form-item label="时间单位:">
        <el-select v-model="timeUnit" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button
          :loading="btnExportLoad"
          type="primary"
          @click="changeType"
        >{{ type==='汇总'?'查看明细':'查看汇总' }}</el-button>
        <el-button
          :loading="btnExportLoad"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>

    <el-form v-show="type==='明细'" :inline="true">
      <el-form-item
        :label="'总耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.sum_time }}</span>
        <span v-else>{{ allData.sum_time |setTimeMin }}</span>
      </el-form-item>
      <el-form-item
        :label="'最小耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.min_time }}</span>
        <span v-else>{{ allData.min_time |setTimeMin }}</span>
      </el-form-item>
      <el-form-item
        :label="'最大耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.max_time }}</span>
        <span v-else>{{ allData.max_time |setTimeMin }}</span>
      </el-form-item>
      <el-form-item
        :label="'平均耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.avg_time }}</span>
        <span v-else>{{ allData.avg_time |setTimeMin }}</span>
      </el-form-item>
    </el-form>
    <div v-show="type==='明细'">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
      >
        <el-table-column
          type="index"
          label="No"
        />
        <el-table-column
          prop="time"
          label="时间"
        />
        <el-table-column
          prop="equip_no"
          label="设备编码"
        />
        <el-table-column
          prop="plan_classes_uid_age"
          label="切换前计划号"
        />
        <el-table-column
          prop="plan_classes_uid_later"
          label="切换后计划号"
        />
        <el-table-column
          prop="cut_ago_product_no"
          label="切换前胶料编码"
        />
        <el-table-column
          prop="cut_later_product_no"
          label="切换后胶料编码"
        />
        <el-table-column
          sortable
          prop="time_consuming"
          label="切换规格耗时/秒"
        />
        <!-- <el-table-column
          :label="'切换规格耗时/'+(timeUnit==='秒'?'秒':'min')"
        >
          <template slot-scope="{row}">
            <span v-if="timeUnit==='秒'">{{ row.time_consuming }}</span>
            <span v-else>{{ row.time_consuming |setTimeMin }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          sortable
          prop="time_abnormal"
          label="异常时间(秒)"
        />
      </el-table>
      <page
        :total="total"
        :current-page="search.page"
        @currentChange="currentChange"
      />
    </div>

    <div v-show="type==='汇总'">
      <el-table
        id="out-table"
        v-loading="loading"
        max-height="650px"
        :data="tableData1"
        border
      >
        <el-table-column
          prop="factory_date"
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
              :prop="d+'_1'"
              label="换规格时间(秒)"
              width="60"
            >
              <template slot-scope="{row}">
                <span>{{ row[d+'_1']*10!==0?row[d+'_1']:null }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :prop="d+'_2'"
              label="异常耗时(秒)"
              width="60"
            >
              <template slot-scope="{row}">
                <span>{{ row[d+'_2']*10!==0?row[d+'_2']:null }}</span>
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
            prop="true"
            label="换规格时间(秒)"
            width="60"
          >
            <template slot-scope="{row}">
              <span>{{ row.true*10!==0?row.true:null }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="error"
            label="异常耗时(秒)"
            width="60"
          >
            <template slot-scope="{row}">
              <span>{{ row.error*10!==0?row.error:null }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import equipSelect from '@/components/select_w/equip'
import classSelect from '@/components/ClassSelect'
import page from '@/components/page'
import { cutTimeCollect, globalCodesUrl } from '@/api/base_w'
// import timeSpanSelect from '@/components/select_w/timeSpan'
import { exportExcel, setDate } from '@/utils/index'
export default {
  name: 'SpecsSwitchSummary',
  components: { page, equipSelect, classSelect },
  data() {
    return {
      type: '明细',
      groups: [],
      equipList: ['Z01', 'Z02', 'Z03', 'Z04', 'Z05', 'Z06', 'Z07', 'Z08', 'Z09', 'Z10', 'Z11', 'Z12', 'Z13', 'Z14', 'Z15'],
      dateValue: [setDate(), setDate()],
      total: 0,
      loading: false,
      search: {
        page: 1,
        equip_no: ''
      },
      allData: {},
      tableData: [],
      tableData1: [],
      btnExportLoad: false,
      options: ['秒', '分钟'],
      timeUnit: '秒'
    }
  },
  created() {
    this.search.s_time = this.dateValue[0]
    this.search.e_time = this.dateValue[1]
    // this.getList()
  },
  methods: {
    changeType() {
      if (this.type === '明细') {
        delete this.search.page
        delete this.search.equip_no
        this.search.collect = 1
        this.type = '汇总'
        this.getList1()
      } else {
        delete this.search.collect
        this.search.page = 1
        this.type = '明细'
      }
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
    classChanged(val) {
      this.search.classes = val
      if (this.type === '明细') {
        delete this.search.collect
        this.search.page = 1
        this.getList()
      } else {
        this.search.collect = 1
        delete this.search.page
        delete this.search.equip_no
        this.getList1()
      }
    },
    exportTable() {
      if (this.type === '明细') {
        this.btnExportLoad = true
        const obj = Object.assign({ export: 1 }, this.search)
        cutTimeCollect('get', null, { params: obj, responseType: 'blob' })
          .then(res => {
            const link = document.createElement('a')
            const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            link.download = '规格切换时间明细.xlsx' // 下载的文件名
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            this.btnExportLoad = false
          }).catch(e => {
            this.btnExportLoad = false
          })
      } else {
        exportExcel('规格切换时间汇总')
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await cutTimeCollect('get', null, { params: this.search })
        this.total = data.count
        this.allData = data.results.pop() || {}
        this.tableData = data.results || []
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    async getList1() {
      try {
        this.loading = true
        const data = await cutTimeCollect('get', null, { params: this.search })
        this.tableData1 = data.results || []
        if (this.tableData1.length > 0) {
          this.tableData1.push({
            factory_date: '平均值',
            true: (sum(this.tableData1, 'true') / (sumNull(this.tableData1, 'true'))).toFixed(1),
            error: (sum(this.tableData1, 'error') / (sumNull(this.tableData1, 'error'))).toFixed(1)
          })
          const index = this.tableData1.length
          this.equipList.forEach(d => {
            this.tableData1[index - 1][d + '_1'] = (sum(this.tableData1, [d] + '_1') / (sumNull(this.tableData1, [d] + '_1'))).toFixed(1)
            this.tableData1[index - 1][d + '_2'] = (sum(this.tableData1, [d] + '_2') / (sumNull(this.tableData1, [d] + '_2'))).toFixed(1)
          })
        }
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      if (this.type === '明细') {
        delete this.search.collect
        this.search.page = 1
        this.getList()
      } else {
        this.search.collect = 1
        delete this.search.page
        delete this.search.equip_no
        this.getList1()
      }
    },
    equipChanged(val) {
      this.search.equip_no = val
      this.search.page = 1
      this.getList()
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

<style>

</style>
