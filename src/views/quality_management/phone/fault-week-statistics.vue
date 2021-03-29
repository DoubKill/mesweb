<template>
  <div class="phone-week">
    <!-- 设备别故障周统计 -phone -->
    <h4 style="margin:0 0 5px 5px">设备别故障周统计</h4>
    <div v-for="(item,i) in 3" :key="i" class="box-fa">
      <div>z01</div>
      <div class="box-child">
        <div style="display: flex;justify-content: space-between;">
          <span style="width:33%">投料：11</span>
          <span style="width:33%">主机：10</span>
          <span style="width:33%">挤出压片：221</span>
        </div>
        <div style="display: flex;justify-content: space-between;">
          <span style="width:33%">液压站：0.</span>
          <span style="width:33%">水冷：0</span>
          <span style="width:33%">收皮：111</span>
        </div>
        <div style="display: flex;justify-content: space-between;">
          <span style="width:33%">上辅机：1</span>
          <span style="width:33%">上顶栓：1</span>
          <span style="width:33%">卸料门：22</span>
        </div>
        <div style="display: flex;justify-content: space-between;">
          <span style="width:33%">加料门：10100</span>
          <span style="width:33%">小计：5555</span>
          <span style="width:33%">停机时间/h：</span>
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
    <div>
      <ve-pie
        style="width:100%;"
        height="350px"
        :data="chartData"
        :extend="extend"
        :settings="chartSettings"
        :judge-width="true"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    this.chartSettings1 = {
      labelMap: {
        global_name: '时间',
        global_no: '温度'
      },
      backgroundColor: '#eee'
    }
    this.chartSettings = {
      radius: '70'
    }
    return {
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
          bottom: '20'
        }
      },
      extend: {
        title: {
          text: '99888',
          x: 'middle',	 // left, right, middle
          textAlign: 'center' // auto, left, right, center
        },
        series: {
          animation: false,
          center: ['50%', '100']
        },
        legend: {
          show: false
        },
        grid: {
          bottom: '0'
        }
      }
    }
  },
  created() {
    // const a = this.searchDate.slice(0, 7)
    // this.extend1.title.text = a + '各机台停机时间(h)'
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.phone-week{
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
}
</style>
