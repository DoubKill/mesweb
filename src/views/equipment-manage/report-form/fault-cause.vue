<template>
  <div>
    <!-- 设备故障分析报表 -->
    <el-form :inline="true">
      <el-form-item>
        <el-radio-group v-model="search.type" @change="resetTime">
          <el-radio label="classes">班次</el-radio>
          <el-radio label="day">日报</el-radio>
          <el-radio label="week">周报</el-radio>
          <el-radio label="month">月报</el-radio>
          <el-radio label="year">年报</el-radio>
        </el-radio-group>
      </el-form-item>
      <br>
      <el-form-item label="机台">
        <equip-select
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="部位">
        <el-select v-model="search.part_id"  placeholder="请选择" clearable>
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.part_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日/周/月/年">
        <el-date-picker
          v-if="type==='day'||type==='classes'"
          key="1"
          v-model="search.time"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeList"
        />
        <el-date-picker
          v-if="type==='week'"
          key="2"
          v-model="search.time"
          type="week"
          :picker-options="{ firstDayOfWeek:1 }"
          format="yyyy第WW周"
          value-format="yyyy-MM-dd"
          placeholder="选择周"
          @change="changeList"
        />
        <el-date-picker
          v-if="type==='month'"
          key="3"
          v-model="search.time"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM-dd"
          placeholder="选择月"
          @change="changeList"
        />
        <el-date-picker
          v-if="type==='year'"
          key="4"
          v-model="search.time"
          type="year"
          format="yyyy"
          value-format="yyyy-MM-dd"
          placeholder="选择年"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['equip_fault_analyse','export']"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button type="primary" @click="showDialog">图表查看</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      :row-class-name="tableRowClassName"
      border
      show-summary
    >
      <el-table-column
        prop="display_date"
        label="日期"
        min-width="22"
      />
      <el-table-column
        v-if="type==='classes'"
        prop="batch_classes"
        label="班次"
        min-width="20"
      />
      <el-table-column
        v-if="type==='classes'"
        prop="batch_group"
        label="设备班组"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="10"
      />
      <el-table-column
        v-for="(item) in heardData"
        :key="item"
        :prop="item"
        :label="item"
        min-width="20"
      />
      <el-table-column
        prop="m_equip_time"
        label="小计(min)"
        min-width="20"
      />
      <el-table-column
        prop="h_equip_time"
        label="小计(h)"
        min-width="20"
      />
    </el-table>
    <el-dialog
      title="分析图表"
      :visible.sync="dialogVisible"
    >
      <div id="bar" style="width: 100%;height:300px;"/>
      <div id="pie" style="width: 100%;height:300px;"/>
    </el-dialog>
  </div>
</template>

<script>
import { equipPartNew } from '@/api/jqy'
import { equipFaultAnalyse } from '@/api/base_w_two'
import { exportExcel } from '@/utils/index'
import { setDate } from '@/utils'
import EquipSelect from '@/components/EquipSelect/index'
import * as echarts from 'echarts'
export default {
  name: 'EquipmentReportFormFaultCause',
  components: { EquipSelect },
  data() {
    return {
      search: { time: setDate(), type: 'year' },
      loading: false,
      tableData: [],
      heardData: [],
      type: 'year',
      options: [],
      dialogVisible: false,
      pieData: [],
      xDataBar: [],
      barData: [],
      optionPie: {
        title: {
          text: `设备故障分类`,
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return params.name + ':' + params.percent + '%'
          }
        },
        grid: {
          top: '20%'
        },
        series: [{
          name: '',
          type: 'pie',
          radius: '60%',
          data: [],
        }]
      },
      optionBar: {
        title: {
          text: `机台故障时间统计(min)`,
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'bar',
            itemStyle: { normal: {
            label: { show: true, position: 'top', color: '#000' }}}
          }
        ]
      }
    }
  },
  created() {
    this.getPart()
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.xDataBar = []
        this.barData = []
        this.pieData = []
        this.loading = true
        const data = await equipFaultAnalyse('get', null, { params: this.search })
        let arr = []
        for (const key in data.results) {
          if (Object.hasOwnProperty.call(data.results, key)) {
            const element = data.results[key];
            if(key.indexOf('_')===-1){
              element.equip_no = key
              arr.push(element)
              this.xDataBar.push(key)
              this.barData.push(element.m_equip_time)
            }
          }
        }
        this.tableData = arr || []
        this.heardData = Object.keys(data.results.part_time) || []
        this.loading = false

        for (const key1 in data.results.part_time) {
          if (Object.hasOwnProperty.call(data.results.part_time, key1)) {
            const element1 = data.results.part_time[key1];
            this.pieData.push({value: element1, name: key1})
          }
        }
      } catch (e) {
        this.loading = false
      }
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      // this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.time === '合计') {
        return 'summary-cell-style'
      }
    },
    changeList() {
      // this.getList()
    },
    async getPart() {
      try {
        const data = await equipPartNew('get', null, { params: { use_flag: true, all: 1 }})
        this.options = data.results || []
      } catch (e) {
        //
      }
    },
    resetTime() {
      this.search.time = setDate()
      this.type = this.search.type
      this.getList()
    },
    exportTable() {
      exportExcel('期间别处理时间报表')
    },
    showDialog(){
      this.dialogVisible = true

      setTimeout(d=>{
        const chartPie = echarts.init(document.getElementById('pie'))
        this.optionPie.series[0].data = this.pieData
        chartPie.setOption(this.optionPie)
        const chartBar = echarts.init(document.getElementById('bar'))
        this.optionBar.xAxis.data = this.xDataBar
        this.optionBar.series[0].data = this.barData
        chartBar.setOption(this.optionBar)
      })
    }
  }
}
function sum(arr, params) {
  var s = 0
  arr.forEach(function(val, idx, arr) {
    const a = val[params] ? Number(val[params]) : 0
    s += a
  }, 0)
  s = Math.round(s * 100) / 100
  return s
}
function handleDecimalPoint(value) {
  value = +value
  if (!value) return 0
  if (!Number.isInteger(value)) {
    value = +value.toFixed(2)
  }
  return value
}
</script>

<style>

</style>
