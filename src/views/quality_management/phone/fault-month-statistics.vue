<template>
  <div class="phone-month">
    <!-- 设备别故障月统计 -phone -->
    <h4 style="margin:0 0 5px 5px">设备别故障月统计</h4>
    <el-date-picker
      v-model="searchDate"
      type="month"
      value-format="yyyy-MM-dd"
      style="margin-bottom:20px"
      :clearable="false"
      placeholder="选择月"
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
    <div v-if="chartData1.rows.length>0" style="text-align:center">
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
      v-if="monthErrorSort.length>0"
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
      <tr v-for="(item1,index1) in monthErrorSortData" :key="index1" style="text-align:center">
        <td>top{{ index1+1 }}</td>
        <td>{{ item1.machine }}</td>
        <td>{{ item1.sumHouse }}</td>
        <td>{{ item1.faultName1 }}</td>
        <td>{{ item1.faultVal1 }}</td>
        <td>{{ item1.faultName2 }}</td>
        <td>{{ item1.faultVal2 }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { setDate } from '@/utils'
import { monthErrorStatistics, monthErrorSort } from '@/api/base_w_three'
export default {
  data() {
    this.chartSettings1 = {
      labelMap: {
        global_name: '时间',
        global_no: '停机时间'
      },
      backgroundColor: '#eee'
    }
    return {
      searchDate: setDate(),
      dataList: [],
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
      extend: {
        series: {
          animation: false,
          center: ['50%', '160'],
          labelLine: {
            normal: {
              length: 1
            }
          }
        },
        grid: {
          bottom: '0'
        }
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
          bottom: '0'
        }
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
        this.title_set = data.title || []
        const arr = []
        for (const iterator in data.equips) {
          data.equips[iterator].machine = iterator
          data.equips[iterator].sumHouse = (data.equips[iterator].sum / 60).toFixed(2)
          arr.push(data.equips[iterator])
        }
        this.dataList = data.equips || {}

        const obj = []
        const chartData = []
        arr.forEach((D, key, i) => {
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
    }
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
