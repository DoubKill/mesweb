<template>
  <div class="phone-week">
    <!-- 设备别故障周统计 -phone -->
    <!-- http://10.20.180.65:9000/#/phone/fault-week-statistics -->
    <h4 style="margin:0 0 5px 5px">设备别故障周统计</h4>
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
    <div v-for="(item,index,i) in dataList" :key="i" class="box-fa">
      <div>{{ index }}</div>
      <div class="box-child" style="display:flex;flex-wrap:wrap">
        <span v-for="(itemChil,indexChil) in title_set" :key="indexChil" style="width:33%">
          {{ itemChil }}：{{ item[itemChil] || '--' }}
        </span>
        <span style="width:33%;color:green">小计：{{ item.sum }}</span>
        <span style="width:33%">停机时间/h：{{ item.sumHouse }}</span>
      </div>
    </div>
    <div v-if="chartData1.rows.length===0" style="text-align:center">暂无数据</div>
    <div v-if="chartData1.rows.length>0">
      <ve-histogram
        style="width:100%;"
        :data="chartData1"
        :extend="extend1"
        :judge-width="true"
        :settings="chartSettings1"
      />
    </div>
    <div
      v-for="(item,index,i) in dataList"
      :key="i+99"
    >
      <h4 style="text-align:center">{{ index }}各部位故障占比</h4>
      <ve-pie
        style="width:100%;"
        height="250px"
        :data="item.data"
        :extend="extend"
        :settings="chartSettings"
        :judge-width="true"
      />
    </div>
  </div>
</template>

<script>
import { setDate, getWeekDay } from '@/utils'
import { weekErrorStatistics } from '@/api/base_w_three'
export default {
  data() {
    this.chartSettings1 = {
      labelMap: {
        global_name: '时间',
        global_no: '停机时间'
      },
      backgroundColor: '#eee'
    }
    this.chartSettings = {
      radius: '70'
    }
    return {
      searchDate: setDate(),
      dataList: [],
      title_set: [],
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
          textStyle: {
            fontSize: 14 // 字体大小
          },
          x: 'middle',	 // left, right, middle
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
        backgroundColor: '#eee',
        grid: {
          bottom: '20'
        }
      },
      extend: {
        series: {
          animation: false,
          center: ['50%', '120'],
          labelLine: {
            normal: {
              length: 1
            }
          }
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
    this.$nextTick(d => {
      this.extend1.title.text = getWeekDay(this.searchDate)[0] + '至' + getWeekDay(this.searchDate)[6] + '  各机台停机时间(h)'
    })
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await weekErrorStatistics('get', null, { params: { day_time: this.searchDate }})
        this.dataList = data.equips || {}
        this.title_set = data.title_set || []
        const a = data.equips
        const chartData = []
        for (const iterator in a) {
          a[iterator].sumHouse = (a[iterator].sum / 60).toFixed(2)
          chartData.push({ global_name: iterator, global_no: a[iterator].sumHouse })

          const arr = []
          this.title_set.forEach(d => {
            if (a[iterator][d]) {
              arr.push({ global_name: d, global_no: a[iterator][d] })
            }
          })
          a[iterator].data = {
            columns: ['global_name', 'global_no'],
            rows: arr
          }
        }

        this.chartData1.rows = chartData
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
        this.extend1.title.text = getWeekDay(val)[0] + '至' + getWeekDay(val)[6] + '  各机台停机时间(h)'
      })
      this.getList()
    }
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
