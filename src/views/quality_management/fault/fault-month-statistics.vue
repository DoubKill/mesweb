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
          prop="id"
          label="机台"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="0投料"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="1主机"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="2挤压"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="3液压站"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="4水冷"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="5收皮"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="6上辅机"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="8立体库"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="小计"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="停机时间/h"
          min-width="20"
        />
      </el-table>
      <ve-histogram
        style="width:70%;"
        :data="chartData1"
        :extend="extend1"
        :judge-width="true"
        :settings="chartSettings1"
      />
    </div>
    <div v-if="activeName==='second'" style="display:flex">
      <div style="width:60%;text-align:center">
        <h4>{{ searchDate.slice(0, 7) }}故障频发去排名</h4>
        <el-table
          :data="tableData1"
          border
          show-summary
        >
          <el-table-column
            prop="id"
            label="排行"
            min-width="20"
          />
          <el-table-column
            prop="id"
            label="机台"
            min-width="20"
          />
          <el-table-column
            prop="id"
            label="停机时间/h"
            min-width="20"
          />
          <el-table-column
            prop="id"
            label="故障集中区1"
            min-width="20"
          />
          <el-table-column
            prop="id"
            label="故障1时间"
            min-width="20"
          />
          <el-table-column
            prop="id"
            label="故障集中区2"
            min-width="20"
          />
          <el-table-column
            prop="id"
            label="故障2时间"
            min-width="20"
          />
        </el-table>
      </div>
      <div style="width:40%;text-align:center">
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
export default {
  data() {
    this.chartSettings1 = {
      labelMap: {
        global_name: '时间',
        global_no: '温度'
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
      tableData1: [],
      activeName: 'first',
      chartData: {
        columns: ['global_name', 'global_no'],
        rows: [
          { global_name: 1, global_no: 2 },
          { global_name: 5566655, global_no: 2 },
          { global_name: 3, global_no: 2 },
          { global_name: 4, global_no: 0 },
          { global_name: 99, global_no: 0 },
          { global_name: 888888, global_no: 0 },
          { global_name: 22225, global_no: 2 }
        ]
      },
      chartData1: {
        columns: ['global_name', 'global_no'],
        rows: [
          { global_name: 11, global_no: 22 },
          { global_name: 22, global_no: 33 },
          { global_name: 33, global_no: 22 }
        ]
      },
      extend1: {
        title: {
          text: '',
          x: 'middle',	 // left, right, middle
          // y: 'bottom', // top, bottom
          textAlign: 'center' // auto, left, right, center
        },
        legend: {
          show: false
        },
        series: {
          animation: false,
          label: { show: true, position: 'top' }
        },
        backgroundColor: '#eee'
      }
    }
  },
  created() {
    const a = this.searchDate.slice(0, 7)
    this.extend1.title.text = a + '各机台停机时间(h)'
  },
  methods: {
    changeDate(val) {
      console.log(val)
      if (!val) {
        this.$message.info('请选择时间')
        return
      }
      this.$nextTick(d => {
        const a = val.slice(0, 7)
        this.extend1.title.text = a + '各机台停机时间(h)'
      })
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
