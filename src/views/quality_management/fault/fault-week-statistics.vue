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
          prop="id"
          label="机台"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="投料"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="主机"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="挤出压片"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="液压站"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="水冷"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="收皮"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="上辅机"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="上顶栓"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="御料门"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="加料门"
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
    <el-row v-if="activeName==='second'">
      <el-col
        v-for="(item,i) in 5"
        :key="i"
        :span="8"
        style="text-align:center"
      >
        <h4>各部位故障占比</h4>
        <div>
          <ve-pie
            style="height:200px"
            :data="chartData"
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
export default {
  data() {
    this.extend = {
      legend: {
        show: false
      },
      series: {
        center: ['220', '90'],
        animation: false
      }
    }
    this.chartSettings = {
      radius: '90'
    }
    this.chartSettings1 = {
      labelMap: {
        global_name: '时间',
        global_no: '温度'
      },
      backgroundColor: '#eee'
    }
    return {
      searchDate: '',
      tableData: [],
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
  },
  methods: {
    changeDate(val) {
      // 星期一-星期天 返回得星期二
      console.log(val)
      if (!val) {
        this.$message.info('请选择时间')
        return
      }
      this.$nextTick(d => {
        this.extend1.title.text = new Date(val).getFullYear() + '各机台停机时间(h)'
      })
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
