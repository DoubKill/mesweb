<template>
  <div v-loading="loading">
    <!-- 班次密炼时间汇总 -->
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
      <el-form-item label="胶料编码:">
        <all-product-no-select @productBatchingChanged="productBatchingChanged" />
        <!-- <product-no-select @productBatchingChanged="productBatchingChanged" /> -->
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
      <el-form-item>
        <el-button
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      :data="tableData"
      border
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column
        :key="1"
        type="index"
        label="No"
        width="60"
      />
      <el-table-column
        :key="2"
        :label="search.dimension === 3?'月份':search.dimension === 1?'班次':'时间'"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
          <span v-if="search.dimension === 1">/{{ scope.row.classes }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :key="3"
        prop="equip_no"
        label="设备编码"
      />
      <el-table-column
        :key="4"
        prop="product_no"
        label="胶料编码"
      />
      <el-table-column
        :key="5"
        prop="total_trains"
        label="总车数"
      />
      <el-table-column
        :key="6"
        prop="total_time"
        :label="'总耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <template slot-scope="{row}">
          <span v-if="timeUnit==='秒'">{{ row.total_time }}</span>
          <span v-else>{{ row.total_time |setTimeMin }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :key="7"
        :label="'总时间/'+(timeUnit==='秒'?'s':'min')"
        prop="classes_time"
      >
        <template slot-scope="{row}">
          <span v-if="timeUnit==='秒'">{{ row.classes_time }}</span>
          <span v-else>{{ row.classes_time |setTimeMin }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :key="8"
        prop="min_train_time"
        :label="'单车最小耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <template slot-scope="{row}">
          <span v-if="timeUnit==='秒'">{{ row.min_train_time }}</span>
          <span v-else>{{ row.min_train_time |setTimeMin }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :key="9"
        prop="max_train_time"
        :label="'单车最大耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <template slot-scope="{row}">
          <span v-if="timeUnit==='秒'">{{ row.max_train_time }}</span>
          <span v-else>{{ row.max_train_time |setTimeMin }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :key="10"
        prop="max_train_time"
        :label="'单车平均耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <template slot-scope="{row}">
          <span v-if="timeUnit==='秒'">{{ (setUse(row.total_time,row.total_trains,false)) }}</span>
          <span v-else>{{ (setUse(row.total_time,row.total_trains,false)) |setTimeMin }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :key="11"
        prop="max_train_time"
        label="利用率"
      >
        <template
          slot-scope="{row}"
        >
          <span v-if="Number(search.day_type) === 2&&search.dimension === 1">
            {{ (setUse(row.total_time,row.classes_time,true))+ '%' }}
          </span>
          <span v-if="search.dimension === 2">
            {{ (setUse(row.total_time,24*60*60,true))+ '%' }}
          </span>
          <span v-if="search.dimension === 3">
            {{ (setUse(row.total_time,24*60*60*30,true))+ '%' }}
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
// import productNoSelect from '@/components/ProductNoSelect'
import equipSelect from '@/components/select_w/equip'
// import page from '@/components/page'
import timeSpanSelect from '@/components/select_w/timeSpan'
import { exportExcel } from '@/utils/index'
import { classesBanburySummary } from '@/api/base_w'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import myMixin from './aminxPublic'
export default {
  name: 'ClassesBanburyingSummary',
  components: { allProductNoSelect, equipSelect, timeSpanSelect },
  mixins: [myMixin],
  data() {
    return {
      // total: 0,
      loading: false,
      search: {
        page: 1,
        equip_no: null,
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
        const data = await classesBanburySummary('get', null, { params: this.search })
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
    setMonth(month) {
      if (!month) return
      const data = new Date(month)
      return data.getFullYear() + '/' + (data.getMonth() + 1)
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    exportTable() {
      exportExcel('班次密炼时间汇总')
    },
    productBatchingChanged(val) {
      this.search.product_no = val ? val.material_no : ''
      this.search.page = 1
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
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
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

          if (index === 4) {
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
        if (index === 6) {
          var obj = {}
          var newArr = data.reduce((item, next) => {
            if (this.search.dimension === 1) {
              obj[next.classes + next.date + next.equip_no]
                ? ' '
                : (obj[next.classes + next.date + next.equip_no] = true && item.push(next))
            } else {
              obj[next.date + next.equip_no]
                ? ' '
                : (obj[next.date + next.equip_no] = true && item.push(next))
            }
            return item
          }, [])
          let num6 = 0
          newArr.forEach(dd => {
            num6 += dd.classes_time
          })
          sums[index] = num6
          if (this.timeUnit === '分钟') {
            sums[index] = this.setNum(sums[index])
          } else if (this.timeUnit === '小时') {
            sums[index] = this.setTimeHour(sums[index])
          } else {
            sums[index]
          }
        }
        if (index === 7) {
          sums[index] = (sums[index] / data.length).toFixed(2)
        }
        if (index === 7) {
          sums[index] = (sums[index] / data.length).toFixed(2)
        }
        if (index === 8) {
          sums[index] = (sums[index] / data.length).toFixed(2)
        }
        if (index === 9) {
          sums[index] = (Number(sums[5]) / Number(sums[4])).toFixed(2)
        }
        if (index === 10) {
          sums[index] = ((Number(sums[5]) / Number(sums[6])) * 100).toFixed(2) + '%'
        }
      })
      return sums
    },
    setUse(total_time, classes_time, bool) {
      if (!total_time || !classes_time) return 0
      let a
      if (bool) {
        a = (parseFloat(total_time / classes_time * 100)).toString()
      } else {
        a = (parseFloat(total_time / classes_time)).toString()
      }
      let val
      if (a.lastIndexOf('.') > -1) {
        val = a.substring(0, a.lastIndexOf('.') + 3)
      } else {
        val = a
      }
      return Number(val)
    },
    setNum(value) {
      if (value < 0) return value
      if (!value) return 0
      const a = parseFloat(value / 60).toString()
      let num
      if (a.lastIndexOf('.') > -1) {
        num = a.substring(0, a.lastIndexOf('.') + 2)
      } else {
        num = a
      }
      return Number(num)
    }
  }
}
</script>

<style>

</style>
