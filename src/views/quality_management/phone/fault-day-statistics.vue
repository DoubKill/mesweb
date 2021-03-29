<template>
  <div class="phone-day">
    <!-- 设备别故障日统计 -phone -->
    <!-- http://localhost:9000/#/phone/fault-day-statistics -->
    <h4 style="margin:0 0 5px 5px">设备别故障日统计</h4>
    <div v-for="(item,i) in 3" :key="i" class="box-fa">
      <div>z01</div>
      <div class="box-child">
        <span>早班</span>
        <span style="margin:0 20px">故障时间：100</span>
        <span>故障率：0.01%</span>
      </div>
      <div class="box-child">
        <span>肿班</span>
        <span style="margin:0 20px">故障时间：100</span>
        <span>故障率：0.01%</span>
      </div>
    </div>

    <div style="text-align:center;margin-top:25px;">
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
export default {
  data() {
    this.extend = {
      series: {
        animation: false,
        center: ['50%', '150']
      }
    }
    this.chartSettings = {
      radius: '90'
    }
    return {
      chartData2: {
        columns: ['global_name', 'global_no'],
        rows: [
          { global_name: 1111, global_no: 2 },
          { global_name: 2222, global_no: 2 },
          { global_name: 3332222233, global_no: 2 },
          { global_name: 4, global_no: 0 },
          { global_name: 5, global_no: 0 },
          { global_name: 6, global_no: 0 },
          { global_name: 7, global_no: 2 }
        ]
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
    }
}
</style>
