<template>
  <div class="fault-month-statistics">
    <!-- 设备别故障月统计 -->
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="统计"
        name="first"
        style="padding:0 20px;"
      />
      <el-tab-pane
        label="占比"
        name="second"
        style="padding:0 20px;"
      />
    </el-tabs>
    <el-date-picker
      v-model="searchDate"
      type="month"
      value-format="yyyy-MM-dd"
      style="margin-bottom:20px"
      :clearable="false"
      placeholder="选择月"
      @change="changeDate"
    />
    <div v-if="activeName==='first'">
      <el-table
        :data="tableData"
        border
        show-summary
      >
        <el-table-column
          prop="machine"
          label="机台"
          min-width="20"
        />
        <el-table-column
          v-for="(item,i) in title_set"
          :key="i+99"
          :label="item"
          min-width="20"
          :prop="item"
        >
          <template slot-scope="{row}">
            {{ row[item] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="sum"
          label="小计"
          min-width="20"
        />
        <el-table-column
          prop="sumHouse"
          label="停机时间/h"
          min-width="20"
        >
          <template slot-scope="{row}">
            {{ row.sumHouse }}
          </template>
        </el-table-column>
      </el-table>
      <ve-histogram
        v-if="chartData1.rows.length>0"
        style="width:70%;margin-top:20px"
        :data="chartData1"
        :extend="extend1"
        :judge-width="true"
        :settings="chartSettings1"
      />
    </div>
    <div v-if="activeName==='second'" style="display:flex">
      <div style="width:60%;text-align:center">
        <h4>{{ searchDate.slice(0, 7) }}故障频发去排行</h4>
        <el-table
          :data="monthErrorSortData"
          border
        >
          <el-table-column
            label="排行"
            min-width="20"
          >
            <template slot-scope="{$index}">
              top{{ $index+1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="machine"
            label="机台"
            min-width="20"
          />
          <el-table-column
            prop="sumHouse"
            label="停机时间/h"
            min-width="20"
          />
          <el-table-column
            prop="faultName1"
            label="故障集中区1"
            min-width="20"
          />
          <el-table-column
            prop="faultVal1"
            label="故障1时间"
            min-width="20"
          />
          <el-table-column
            prop="faultName2"
            label="故障集中区2"
            min-width="20"
          />
          <el-table-column
            prop="faultVal2"
            label="故障2时间"
            min-width="20"
          />
        </el-table>
      </div>
      <div v-if="chartData.rows.length>0" style="width:40%;text-align:center;">
        <h4>{{ searchDate.slice(0, 7) }}设备故障分类</h4>
        <ve-pie
          style="width:100%"
          :data="chartData"
          :extend="extend"
          :judge-width="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { setDate } from '@/utils'
import { monthErrorStatistics, monthErrorSort } from '@/api/base_w_three'
export default {
  name: 'FaultMonthStatistics',
  data() {
    this.chartSettings1 = {
      labelMap: {
        global_name: '时间',
        global_no: '停机时间'
      },
      backgroundColor: '#eee'
    }
    this.extend = {
      series: {
        animation: false
      }
    }
    return {
      searchDate: setDate(),
      tableData: [],
      activeName: 'first',
      title_set: [],
      monthErrorSortData: [],
      chartData: {
        columns: ['global_name', 'global_no'],
        rows: []
      },
      chartData1: {
        columns: ['global_name', 'global_no'],
        rows: []
      },
      extend1: {
        title: {
          text: '',
          x: 'middle',	 // left, right, middle
          y: '10', // top, bottom
          textAlign: 'center' // auto, left, right, center
        },
        legend: {
          show: false
        },
        series: {
          animation: false,
          label: { show: true, position: 'top' },
          barMaxWidth: 50
        },
        backgroundColor: '#eee'
      }
    }
  },
  created() {
    const a = this.searchDate.slice(0, 7)
    this.extend1.title.text = a + '各机台停机时间(h)'
    this.getList()
    this.monthErrorSortList()
  },
  methods: {
    async getList() {
      try {
        const data = await monthErrorStatistics('get', null, { params: { day_time: this.searchDate }})
        const arr = []
        const chartData = []
        this.title_set = data.title || []
        for (const iterator in data.equips) {
          data.equips[iterator].machine = iterator
          data.equips[iterator].sumHouse = (data.equips[iterator].sum / 60).toFixed(2)
          arr.push(data.equips[iterator])
        }
        this.tableData = arr || []

        const obj = []
        this.tableData.forEach((D, key, i) => {
          chartData.push({ global_name: D.machine, global_no: D.sumHouse })
          const arr1 = []

          this.title_set.forEach(d => {
            if (!obj[d]) {
              obj[d] = 0
            }
            obj[d] += D[d]
            if (D[d]) {
              arr1.push({ global_name: d, global_no: D[d] })
            }
          })
          D.data = {
            columns: ['global_name', 'global_no'],
            rows: arr1
          }
        })

        this.chartData.rows = []
        for (const iterator in obj) {
          this.chartData.rows.push({
            global_name: iterator,
            global_no: obj[iterator]
          })
        }
        this.chartData1.rows = chartData
      } catch (e) {
        this.loading = false
      }
    },
    async monthErrorSortList() {
      try {
        const data = await monthErrorSort('get', null, { params: { day_time: this.searchDate }})
        const arr = []
        data.forEach(D => {
          for (const val in D) {
            arr.push({
              machine: val,
              sumHouse: (D[val][0][1] || 0 / 60).toFixed(2),
              faultName1: D[val][1][0] || '',
              faultVal1: D[val][1][1] || '',
              faultName2: D[val][2][0] || '',
              faultVal2: D[val][2][1] || ''
            })
          }
        })

        this.monthErrorSortData = arr || []

        console.log(this.monthErrorSortData, 11)
      } catch (e) {
        this.loading = false
      }
    },
    changeDate(val) {
      if (!val) {
        this.$message.info('请选择时间')
        return
      }
      this.$nextTick(d => {
        const a = val.slice(0, 7)
        this.extend1.title.text = a + '各机台停机时间(h)'
      })
      this.getList()
      this.monthErrorSortList()
    },
    handleClick() {

    }
  }
}
</script>

<style>
/* .fault-month-statistics{
} */
</style>
