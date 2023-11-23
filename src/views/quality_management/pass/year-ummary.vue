<template>
  <div v-loading="loading">
    <!-- 综合合格率年度汇总 -->
    <el-form :inline="true">
      <el-form-item label="年">
        <el-date-picker
          v-model="search.s_time"
          type="year"
          :clearable="false"
          value-format="yyyy-MM"
          format="yyyy"
          placeholder="选择年"
          @change="getList"
        />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked" @change="getList">含试验料</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        label="No"
        width="40px"
      />
      <el-table-column
        prop="name"
        align="center"
        label="合格率类型"
        width="100"
      />
      <el-table-column
        v-for="(d) in 12"
        :key="d"
        align="center"
        :label="d+'月'"
        min-width="20"
      >
        <template slot-scope="{row}">
          {{ row[d] }}{{ row[d]!==''?'%':'' }}
        </template>
      </el-table-column>
    </el-table>

    <div
      id="passRateLine"
      class="volumeBox"
      style="width: 100%;height:400px;margin-top:20px"
    />
  </div>
</template>

<script>
import { productSynthesisMonthRate } from '@/api/base_w_five'
import { setDate, exportExcel } from '@/utils'
import * as echarts from 'echarts'
export default {
  name: 'YearUmmary',
  data() {
    return {
      loading: false,
      tableData: [],
      search: {
        s_time: setDate(false, false, 'month')
      },
      checked: false,
      optionPassRateLine: {
        title: {
          left: 'left',
          text: '综合合格率年度汇总',
          textStyle: { color: '#000' }
        },
        legend: {
          data: ['综合合格率', '一次合格率', '流变合格率'],
          textStyle: {
            color: '#000'// 字体颜色
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // type: 'cross'
          }
        },
        grid: {
          top: '25%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: [],
            axisLine: {
              lineStyle: {
                color: '#000',
                width: 1
              }
            }
          }
        ],
        yAxis: {
          type: 'value',
          name: '%',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000',
              width: 1
            }
          },
          max: 100,
          min: 0
        },
        series: [
          {
            name: '综合合格率',
            type: 'line',
            data: [],
            itemStyle: { normal: { label: { show: true }}}
          },
          {
            name: '一次合格率',
            type: 'line',
            data: [],
            itemStyle: { normal: { label: { show: true }}}
          },
          {
            name: '流变合格率',
            type: 'line',
            data: [],
            itemStyle: { normal: { label: { show: true }}}
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const aa = this.search.s_time.split('-')[0]
        const obj = {
          year: aa,
          sy_flag: 'Y'
        }
        if (!this.checked) {
          delete obj.sy_flag
        }
        const arr = await productSynthesisMonthRate('get', null, { params: obj })
        this.loading = false
        this.tableData = arr.data || []

        const _month = []
        const qualified_rate_data_rate = []
        const qualified_rate_data_qualified_count = []
        const qualified_rate_data_total = []
        for (let index = 1; index < 13; index++) {
          _month.push(index + '月')
        }
        this.tableData.forEach((d, i) => {
          for (let index = 1; index < 13; index++) {
            if (i === 0) {
              qualified_rate_data_rate.push(d[index])
            }
            if (i === 1) {
              qualified_rate_data_qualified_count.push(d[index])
            }
            if (i === 2) {
              qualified_rate_data_total.push(d[index])
            }
          }
        })
        this.optionPassRateLine.series[0].data = qualified_rate_data_rate
        this.optionPassRateLine.series[1].data = qualified_rate_data_qualified_count
        this.optionPassRateLine.series[2].data = qualified_rate_data_total
        this.optionPassRateLine.xAxis[0].data = _month

        this.myChartPassRateLine = echarts.init(document.getElementById('passRateLine'))
        this.myChartPassRateLine.setOption(this.optionPassRateLine, true)
      } catch (e) {
        this.loading = false
      }
    },
    exportTable() {
      exportExcel('综合合格率年度汇总', '综合合格率汇总')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
