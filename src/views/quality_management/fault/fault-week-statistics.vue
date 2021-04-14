<template>
  <div class="fault-week-statistics">
    <!-- 设备别故障周统计 -->
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
      type="week"
      format="yyyy 第 WW 周"
      value-format="yyyy-MM-dd"
      placeholder="选择周"
      style="margin-bottom:20px"
      :clearable="false"
      :picker-options="{firstDayOfWeek:1}"
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
          :key="1"
          prop="sum"
          label="小计"
          min-width="20"
        />
        <el-table-column
          :key="2"
          label="停机时间/h"
          min-width="20"
          prop="sumHouse"
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
    <el-row v-if="activeName==='second'">
      <el-col
        v-for="(item,i) in tableData"
        :key="i"
        :span="8"
        style="text-align:center"
      >
        <h4>{{ item.machine }}各部位故障占比</h4>
        <div>
          <ve-pie
            style="height:250px"
            :data="item.data"
            :extend="extend"
            :judge-width="true"
            :settings="chartSettings"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { setDate, getWeekDay } from '@/utils'
import { weekErrorStatistics } from '@/api/base_w_three'
export default {
  data() {
    this.extend = {
      legend: {
        show: false
      },
      series: {
        center: ['200', '120'],
        animation: false,
        labelLine: {
          normal: {
            length: 1
          }
        }
      }
    }
    this.chartSettings = {
      radius: '80'
    }
    this.chartSettings1 = {
      labelMap: {
        global_name: '时间',
        global_no: '温度'
      },
      backgroundColor: '#eee'
    }
    return {
      searchDate: setDate(),
      tableData: [],
      activeName: 'first',
      title_set: [],
      chartData: { // 部位   数值
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
    this.$nextTick(d => {
      this.extend1.title.text = getWeekDay(this.searchDate)[0] + '至' + getWeekDay(this.searchDate)[6] + '  各机台停机时间(h)'
    })
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await weekErrorStatistics('get', null, { params: { day_time: this.searchDate }})
        const arr = []
        const chartData = []
        this.title_set = data.title_set || []
        for (const iterator in data.equips) {
          data.equips[iterator].machine = iterator
          data.equips[iterator].sumHouse = (data.equips[iterator].sum / 60).toFixed(2)
          arr.push(data.equips[iterator])
        }
        this.tableData = arr || []
        this.tableData.forEach((D, key, i) => {
          chartData.push({ global_name: D.machine, global_no: D.sumHouse })
          const arr = []
          this.title_set.forEach(d => {
            if (D[d]) {
              arr.push({ global_name: d, global_no: D[d] })
            }
          })
          D.data = {
            columns: ['global_name', 'global_no'],
            rows: arr
          }
        })
        this.chartData1.rows = chartData
      } catch (e) {
        this.loading = false
      }
    },
    changeDate(val) {
      // 星期一-星期天 返回得星期二
      if (!val) {
        this.$message.info('请选择时间')
        return
      }
      this.$nextTick(d => {
        this.extend1.title.text = getWeekDay(val)[0] + '至' + getWeekDay(val)[6] + '  各机台停机时间(h)'
      })
      this.getList()
    },
    handleClick() {

    }
  }
}

</script>

<style>
/* .fault-week-statistics{
} */
</style>
