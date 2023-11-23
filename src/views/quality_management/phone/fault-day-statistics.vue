<template>
  <div class="phone-day">
    <!-- 设备别故障日统计 -phone -->
    <!-- http://localhost:9000/#/phone/fault-day-statistics -->
    <h4 style="margin:0 0 5px 5px">设备别故障日统计</h4>
    <el-date-picker
      v-model="searchDate"
      type="date"
      placeholder="选择日期"
      value-format="yyyy-MM-dd"
      style="margin-bottom:20px"
      :clearable="false"
      @change="datePicker"
    />
    <div v-for="(item,i) in dataList" :key="i" class="box-fa">
      <div>{{ i }}</div>
      <div v-for="(itemChil,index) in item.class_name" :key="index" class="box-child">
        <span style="width:70px">{{ itemChil }}</span>
        <span style="margin:0 20px">故障时间：{{ item.error_time[index] }}</span>
        <span>故障率：{{ (item.error_percent[index] * 100).toFixed(2) }}%</span>
      </div>
    </div>
    <div v-if="chartData2.rows.length===0" style="text-align:center">暂无数据</div>

    <div v-if="chartData2.rows.length>0" style="text-align:center;margin-top:25px;">
      <h4 style="margin-top: 0;">炼胶工程设备故障占比</h4>
      <ve-pie
        style="width:100%;"
        :data="chartData2"
        :extend="extend"
        :settings="chartSettings"
      />
    </div>
  </div>
</template>

<script>
import { setDate } from '@/utils'
import { dayErrorStatistics } from '@/api/base_w_three'
export default {
  data() {
    this.extend = {
      series: {
        animation: false,
        center: ['50%', '220']
      }
    }
    this.chartSettings = {
      radius: '90'
    }
    return {
      searchDate: setDate(),
      // searchDate: '2023-02-19',
      chartData2: {
        columns: ['global_name', 'global_no'],
        rows: []
      },
      dataList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    datePicker() {
      this.getList()
    },
    async getList() {
      this.loading = true
      try {
        const data = await dayErrorStatistics('get', null, { params: { day_time: this.searchDate }})
        this.dataList = data || []
        const chartData = []
        const arr = []
        for (const iterator in data) {
          data[iterator].machine = iterator
          arr.push(data[iterator])
        }
        arr.forEach((D, i) => {
          chartData[i] = {
            global_name: D.machine,
            global_no: D.error_percent[D.error_percent.length - 1] * 100
          }
        })
        this.chartData2.rows = chartData
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.phone-day{
    padding: 10px 0;
    background: #eee;
    width:100%;
    min-height:100vh;
    .box-fa{
        background: #fff;
        padding:5px;
        margin-bottom:5px;
    }
    .box-child{
        font-size:12px;
        display: flex;
        span{
          width:33%;
        }
    }
}
</style>
