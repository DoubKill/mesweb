<template>
  <div class="phone-month">
    <!-- 设备别故障月统计 -phone -->
    <h4 style="margin:0 0 5px 5px">设备别故障月统计</h4>
    <div v-for="(item,i) in 3" :key="i" class="box-fa">
      <div>z01 <span style="float:right;font-size:12px">小计：1111</span></div>
      <div class="box-child">
        <div style="display: flex;justify-content: space-between;">
          <span style="width:33%">0投料：11</span>
          <span style="width:33%">1主机：10</span>
          <span style="width:33%">2挤压：221</span>
        </div>
        <div style="display: flex;justify-content: space-between;">
          <span style="width:33%">3液压站：0.</span>
          <span style="width:33%">4水冷：0</span>
          <span style="width:33%">5收皮：111</span>
        </div>
        <div style="display: flex;justify-content: space-between;">
          <span style="width:33%">6上辅机：1</span>
          <span style="width:33%">8立体库：22</span>
          <span style="width:33%">停机时间/h：10100</span>
        </div>
      </div>
    </div>
    <div>
      <ve-histogram
        style="width:100%;"
        :data="chartData1"
        :extend="extend1"
        :judge-width="true"
        :settings="chartSettings1"
      />
    </div>
    <div style="text-align:center">
      <h4>{{ searchDate.slice(0, 7) }}设备故障分类</h4>
      <ve-pie
        style="width:100%;"
        height="350px"
        :data="chartData"
        :extend="extend"
        :judge-width="true"
      />
    </div>
    <table
      cellspacing="0"
      border="1"
      cellpadding="1"
      bordercolor="black"
      class="min-table"
    >
      <tr style="text-align:center">
        <th colspan="7">{{ searchDate.slice(0, 7) }}故障频发区排行</th>
      </tr>
      <tr style="text-align:center">
        <td>排行</td>
        <td>机台</td>
        <td>停机时间/h</td>
        <td>故障集中区1</td>
        <td>故障1时间</td>
        <td>故障集中区2</td>
        <td>故障2时间</td>
      </tr>
      <tr style="text-align:center">
        <td>排行</td>
        <td>机台</td>
        <td>停机时间/h</td>
        <td>故障集中区1</td>
        <td>故障1时间</td>
        <td>故障集中区2</td>
        <td>故障2时间</td>
      </tr>
    </table>
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
    return {
      searchDate: setDate(),
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
          { global_name: 'fhdh', global_no: 22 },
          { global_name: 35453, global_no: 22 },
          { global_name: 365653, global_no: 22 },
          { global_name: 33, global_no: 22 },
          { global_name: 33, global_no: 22 }
        ]
      },
      extend: {
        series: {
          animation: false
        },
        grid: {
          bottom: '0'
        }
      },
      extend1: {
        title: {
          text: '',
          x: 'middle',	 // left, right, middle
          textAlign: 'center' // auto, left, right, center
        },
        legend: {
          show: false
        },
        series: {
          animation: false,
          label: { show: true, position: 'top' }
        },
        backgroundColor: '#eee',
        grid: {
          bottom: '0'
        }
      }
    }
  },
  created() {
    const a = this.searchDate.slice(0, 7)
    this.extend1.title.text = a + '各机台停机时间(h)'
  }
}
</script>

<style lang="scss" scoped>
.phone-month{
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
    }
    .min-table{
       border-collapse:collapse;
       width:100%;
       td{
           padding:0 6px;
       }
    }
}
</style>
