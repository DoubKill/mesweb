<template>
  <div class="OEE">
    <!-- 密炼机 设备OEE分析 -->
    <el-form :inline="true">
      <el-form-item label="起止日期">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button type="primary" @click="dialogVisible = true">统计</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="order_id"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="设备综合效率"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="开动时间"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="负荷时间"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="时间开动率"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="净开动率"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="速度开动率"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="性能开动率"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="合格品率"
        min-width="20"
      />
    </el-table>
    <el-dialog
      :visible.sync="dialogVisible"
      width="70%"
      @open="open()"
    >
      <div
        id="OEELine"
        class="volumeBox"
        style="width: 100%;height:500px;flex:1;border-radius: 0"
      />
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'EquipmentReportFormOEE',
  data() {
    return {
      dateValue: [],
      btnExportLoad: false,
      search: {},
      loading: false,
      dialogVisible: false,
      tableData: [],
      optionOEELine: {
        title: {
          left: 'center',
          text: '设备OEE分析'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: ['设备综合效率', '时间开动率', '性能开动率', '合格品率']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          min: 0,
          max: 1,
          splitNumber: 10,
          axisLabel: {
            formatter: function(value, index) {
              return value.toFixed(2)
            }
          },
          type: 'value'
        },
        series: [
          {
            name: '设备综合效率',
            symbol: 'diamond',
            type: 'line',
            stack: 'Total',
            data: [0.25, 0.52, 0.22, 0.82, 0.90, 0.35, 0.45]
          },
          {
            name: '时间开动率',
            symbol: 'rect',
            type: 'line',
            data: [0.52, 0.42, 0.82, 0.99, 0.90, 0.85, 0.75]
          },
          {
            name: '性能开动率',
            symbol: 'triangle',
            type: 'line',
            data: [0.55, 0.77, 0.82, 0.92, 0.95, 0.55, 0.32]
          },
          {
            name: '合格品率',
            symbol: 'circle',
            type: 'line',
            data: [0.66, 0.78, 0.88, 0.73, 0.51, 0.91, 0.88]
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    // this.myChartPassRateLine = echarts.init(document.getElementById('OEELine'))
    // this.myChartPassRateLine.setOption(this.optionOEELine)
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const obj = {}
        Object.assign(obj, this.search)
        // const data = await equipWarehouseRecord('get', null, { params: obj })
        // this.tableData = data.results || []
        // this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    open() {
      this.$nextTick(() => {
        //  执行echarts方法
        this.myChartPassRateLine = echarts.init(document.getElementById('OEELine'))
        this.myChartPassRateLine.setOption(this.optionOEELine, true)
      })
    },
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      this.getList()
    },
    exportTable() {
      this.btnExportLoad = true
      // const obj = Object.assign({ export: 1 }, this.search)
      // const _api = equipWarehouseRecord
      // _api('get', null, { params: obj, responseType: 'blob' })
      //   .then(res => {
      //     const link = document.createElement('a')
      //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      //     link.style.display = 'none'
      //     link.href = URL.createObjectURL(blob)
      //     link.download = '备件出入库履历.xlsx' // 下载的文件名
      //     document.body.appendChild(link)
      //     link.click()
      //     document.body.removeChild(link)
      //     this.btnExportLoad = false
      //   }).catch(e => {
      //     this.btnExportLoad = false
      //   })
    }
  }
}
</script>

<style lang="scss" scoped>
// .OEE {
//  .volumeBox{
//     background: #fff;
//     // padding:10px;
//     border-radius: 20px;
//     margin-bottom:10px;
//   }
// }

</style>

