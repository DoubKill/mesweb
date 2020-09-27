<template>
  <div class="homePage-container">
    <div class="homePage-title">
      生产状况
    </div>
    <div class="homePage-status">
      <div class="status-left">
        <div class="status-num">
          <div>计划车次</div>
          <div>{{ getInfoData.cur_month_plan }}</div>
          <div>实际生产车次</div>
          <div>{{ getInfoData.cur_month_actual }}</div>
        </div>
        <div class="status-circular-circular">
          <ve-pie
            :data="chartData"
            width="100%"
            :settings="chartSettingsCir"
            :after-set-option="afterSetOption"
          />
        </div>
        <div class="status-circular-line">
          <ve-histogram
            width="100%"
            height="500px"
            :data="chartDataLine"
            :settings="chartSettings"
            :extend="extend"
          />
        </div>
      </div>
      <div class="status-right" />
    </div>
  </div>
</template>

<script>
import {
  homePageUrl
} from '@/api/base_w'
export default {
  name: 'HomePage',
  data() {
    this.chartSettings = {
      labelMap: {
        time: '时间',
        plan_trains: '计划车次',
        actual_trains: '实际生产车次'
      }
    }
    this.extend = {
      series: {
        label: { show: true, position: 'top' }
      }
    }
    this.chartSettingsCir = {
      radius: '110'
    }
    return {
      getInfoData: {},
      chartData: {
        columns: ['id', 'cur_month'],
        rows: []
      },
      chartDataLine: {
        columns: ['time', 'plan_trains', 'actual_trains'],
        rows: []
      },
      options: {
        series: [
          {
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            }
          }
        ]
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    afterSetOption(chartObj) {
      chartObj.setOption(this.options)
    },
    async getInfo() {
      try {
        const getInfoData = await homePageUrl('get')
        this.getInfoData = getInfoData
        const arrCircular = [
          {
            'cur_month': this.getInfoData.cur_month_actual,
            'id': '已完成'
          }, {
            'cur_month': Number(this.getInfoData.cur_month_plan) - Number(this.getInfoData.cur_month_actual),
            'id': '未完成'
          }
        ]
        this.chartData.rows = arrCircular
        const arr = []
        for (const i in this.getInfoData.result) {
          this.getInfoData.result[i].time = i
          arr.push(this.getInfoData.result[i])
        }
        this.chartDataLine.rows = arr
        // eslint-disable-next-line no-empty
      } catch (e) { }
    }
  }
}
</script>

<style lang="scss" scoped>
.homePage-container {
  .homePage-title{
    width:100%;
    text-align: center;
    padding: 10px;
  }
  .homePage-status{
    display: flex;
  }
  .status-left{
    flex:1;
  }
  .status-right{
    width:0px;
  }
  .status-left{
    display: flex;
  }
  .status-num{
    text-align: center;
    width:160px;
    font-size:18px;
  }
  .status-circular-circular{
    width:40%;
  }
  .status-circular-line{
    width:80%;
    margin-right: 80px;
  }
  .status-circular{
    flex:1
  }
}
</style>
