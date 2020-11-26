<template>
  <div v-loading="loading">
    <!-- 密炼时间占比汇总 -->
    <el-form :inline="true">
      <el-form-item label="时间:">
        <el-date-picker
          v-model="search.date"
          :clearable="true"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="search.day_type" @change="changeRadio">
          <el-radio :label="1">自然日</el-radio>
          <el-radio :label="2">工厂时间</el-radio>
        </el-radio-group>
      </el-form-item>
      <br>
      <el-form-item label="时间跨度:">
        <time-span-select
          :default-val="search.dimension"
          :day-type="search.day_type"
          @changeSelect="timeSpanChanged"
        />
      </el-form-item>
      <el-form-item label="设备编码:">
        <equip-select
          :equip_no_props.sync="search.equip_no"
          @changeSearch="equipChanged"
        />
      </el-form-item>
      <el-form-item label="时间单位:">
        <el-select v-model="timeUnit" placeholder="请选择">
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
      :data="tableData"
      border
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column
        type="index"
        label="No"
        width="60"
      />
      <el-table-column
        :label="search.dimension === 3?'月份':search.dimension === 1?'班次':'时间'"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
          <span v-if="search.dimension === 1">/{{ scope.row.classes }}</span>
          <!-- <span v-if="search.dimension === 3">{{ setMonth(scope.row.month) }}</span>
          <span v-if="search.dimension === 1&&scope.row.classes">
            {{ (Object.prototype.hasOwnProperty.call(scope.row, 'factory_date')?
              scope.row.factory_date:scope.row.end_time__date)
              + ' / '+ scope.row.classes }}</span>
          <span v-if="search.dimension === 2">
            {{ Object.prototype.hasOwnProperty.call(scope.row, 'factory_date')?
              scope.row.factory_date:scope.row. end_time__date }}
          </span> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="equip_no"
        label="设备编码"
      />
      <el-table-column
        prop="total_trains"
        label="总车数"
      />
      <el-table-column
        prop="total_time"
        :label="'总耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <template slot-scope="{row}">
          <span v-if="timeUnit==='秒'">{{ row.total_time }}</span>
          <span v-else>{{ row.total_time |setTimeMin }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="'总时间/'+(timeUnit==='秒'?'s':'min')"
        prop="classes_time"
      >
        <template slot-scope="{row}">
          <span v-if="timeUnit==='秒'">{{ row.classes_time }}</span>
          <span v-else>{{ row.classes_time |setTimeMin }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="利用率"
      >
        <template slot-scope="{row}">
          <span v-if="Number(search.day_type) === 2&&search.dimension === 1">
            {{ setUse(row.total_time,row.classes_time,true) }}
          </span>
          <span v-if="search.dimension === 2">
            {{ setUse(row.total_time,24*60*60,true) }}
          </span>
          <span v-if="search.dimension === 3">
            {{ setUse(row.total_time,24*60*60*30*60,true) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <page
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    /> -->
  </div>
</template>

<script>
import equipSelect from '@/components/select_w/equip'
// import page from '@/components/page'
import timeSpanSelect from '@/components/select_w/timeSpan'
import { equipBanburySummary } from '@/api/base_w'
import myMixin from './aminxPublic'
export default {
  components: { equipSelect, timeSpanSelect },
  mixins: [myMixin],
  data() {
    return {
      // total: 0,
      loading: false,
      search: {
        page: 1,
        dimension: 1,
        day_type: 2,
        date: []
      },
      tableData: [],
      options: ['秒', '分钟'],
      timeUnit: '秒'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipBanburySummary('get', null, { params: this.search })
        // this.total = data.count
        this.tableData = data
        if (this.tableData.length > 0 && (Number(this.search.day_type) !== 2 || this.search.dimension !== 1)) {
          let val
          if (this.search.dimension === 2) {
            val = 60 * 24 * 60
          } else if (this.search.dimension === 3) {
            val = 60 * 24 * 30 * 60
          }
          this.tableData.forEach(D => {
            D.classes_time = val
          })
        }
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    changeDate(date) {
      this.search.st = date ? date[0] : ''
      this.search.et = date ? date[1] : ''
      this.getList()
      this.search.page = 1
    },
    changeRadio(val) {
      this.search.day_type = val
      this.getList()
      this.search.page = 1
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    equipChanged(val) {
      this.search.equip_no = val
      this.getList()
      this.search.page = 1
    },
    timeSpanChanged(val) {
      this.search.dimension = val
      this.getList()
      this.search.page = 1
    },
    setMonth(month) {
      if (!month) return
      const data = new Date(month)
      return data.getFullYear() + '/' + (data.getMonth() + 1)
    },
    setUse(total_time, classes_time) {
      if (!total_time || !classes_time) return 0
      const a = parseFloat(total_time / classes_time * 100).toFixed(100)
      const num = (a.substring(0, a.lastIndexOf('.') + 3))
      return num + '%'
    },
    setNum(value) {
      if (value < 0) return value
      if (!value) return 0
      const a = parseFloat(value / 60).toFixed(10)
      const num = a.substring(0, a.lastIndexOf('.') + 2)
      return num
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }

        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (index === 3) {
            sums[index]
          } else {
            if (this.timeUnit !== '秒') {
              sums[index] = this.setNum(sums[index])
            } else {
              sums[index]
            }
          }
        } else {
          sums[index]
        }
      })
      return sums
    }
  }
}
</script>

<style>

</style>
