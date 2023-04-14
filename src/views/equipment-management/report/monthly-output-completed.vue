<template>
  <div class="dailyOutputCompleted">
    <!-- 月产量完成 -->
    <el-form :inline="true">
      <el-form-item label="年">
        <el-date-picker
          v-model="search.date"
          type="year"
          :clearable="false"
          value-format="yyyy"
          :editable="false"
          placeholder="选择年"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="td_flag" @change="changeList">总计和平均统计包含当日产量</el-checkbox>
      </el-form-item>
      <el-form-item style="margin-left:50px">
        <el-button
          v-permission="['monthly_production_completion_report','export']"
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
        <!-- <el-button
          v-permission="['daily_production_completion_report','add']"
          type="primary"
          @click="createE190"
        >录入190E的产量</el-button>
        <el-button v-permission="['daily_production_completion_report','save']" type="primary" :loading="btnLoading" @click="save">保存</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column fixed width="180px">
        <template
          slot="header"
          slot-scope="{row}"
        >
          <span v-if="false">{{ row }}</span>
          <div v-if="!exportTableShow" class="header-style">
            <div style="width:100%;text-align:right">日期</div>
            <span>项目</span>
            <div class="header-style-line three-line" />
          </div>
          <div v-else>项目</div>
        </template>
        <template
          slot-scope="{row}"
        >
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="weight"
        label="总计"
        fixed
        width="90"
      />
      <el-table-column
        prop="avg"
        label="平均"
        fixed
        width="90"
      />
      <div v-for="(d,index) in tableHead" :key="index">
        <el-table-column
          :key="index"
          align="center"
          :label="d"
          :prop="d"
          width="120"
        >
          <template
            slot-scope="{row}"
          >
            <!-- <el-input-number
              v-if="(row.name==='外发无硫料(吨)'
                ||row.name==='实际生产工作日数'
                ||row.name==='190E实际生产工作日数'
                ||row.name==='实际生产机台数')&&!exportTableShow"
              v-model="row[d]"
              controls-position="right"
              :min="0"
              style="width:110px"
            />
            <span v-else>{{ row[d] }}</span> -->
            {{ row[d] }}
          </template>
        </el-table-column>
      </div>
    </el-table>
    <div
      id="taskLine"
      style="width: 100%;height:550px;margin-top:100px"
    />
    <el-divider style="background:black" />
    <div
      id="taskLine1"
      style="width: 100%;height:500px"
    />
    <el-divider style="background:black" />
    <div
      id="taskLine2"
      style="width: 100%;height:500px"
    />
    <el-dialog
      title="190E机台的产量（车数）输入"
      :visible.sync="dialogVisible"
      width="80%"
    >
      <el-form :inline="true">
        <el-form-item label="工厂日期">
          <el-date-picker
            v-model="dialogForm.factory_date"
            type="date"
            :clearable="false"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择工厂日期"
            @change="getTable"
          />
        </el-form-item>
        <el-form-item label="班次">
          <class-select
            :is-clearable="false"
            @classSelected="classChanged"
          />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading1"
        :data="dialogForm.data"
        border
        max-height="600px"
      >
        <el-table-column
          prop="specification"
          label="规格"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-select
              v-model="row.specification"
              placeholder="请选择规格"
              filterable
              @change="changeRow(row)"
              @visible-change="getProduct"
            >
              <el-option
                v-for="item in optionsProduct"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="keyword_name"
          label="段数"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-select
              v-model="row.state"
              placeholder="请选择段数"
              filterable
              @change="changeRow1(row)"
              @visible-change="classesChange(row,$event)"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.state"
                :value="item.state"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="qty"
          label="车数"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.qty" :precision="0" :min="1" controls-position="right" @change="changeQty(row)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          label="重量kg"
          min-width="20"
        />
        <el-table-column
          label="操作"
          width="160"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDisposeDelete(scope)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;margin-top:15px">
        <el-button
          size="small"
          @click="addCellDispose"
        >插入一行</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { monthlyProductionCompletionReport, equip190e, dailyProductionCompletionDown } from '@/api/jqy'
import classSelect from '@/components/ClassSelect'
import * as echarts from 'echarts'
// import { exportExcel } from '@/utils/index'
import { setDate } from '@/utils'
export default {
  name: 'MonthlyOutputCompleted',
  components: { classSelect },
  data() {
    return {
      search: {
        date: setDate(null, null, 'year')
      },
      btnExportLoad: false,
      loading: false,
      btnLoading: false,
      dialogVisible: false,
      dialogForm: { factory_date: '' },
      options: [],
      loading1: false,
      dataList: [],
      td_flag: false,
      optionsProduct: [],
      tableHead: [],
      tableData: [],
      exportTableShow: false,
      option: {
        color: ['#C0504D', '#9BBB59', '#8064A2', '#4BACC6', '#4A7EBB'],
        title: {
          left: 'center',
          text: '安吉（炼胶）每日产能情况说明（含彩胶线）'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '6%',
          orient: 'horizontal',
          data: ['无硫', '发制造部吨位数', '发动力吨位数', '无硫发出吨位(收发)', '合计']
        },
        toolbox: {
          show: true
        },
        calculable: true,
        grid: {
          x: 60,
          y: 150,
          x2: 0,
          y2: 30
        },
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            barGap: '0%',
            name: '无硫',
            type: 'bar',
            data: [],
            label: {
              color: '#F5FFFF',
              backgroundColor: '#C00000',
              position: 'top',
              show: true,
              formatter: function(params) {
                if (params.value === 0 || params.value === '0') {
                  return ''
                } else {
                  return params.value
                }
              }
            }
          },
          {
            barGap: '0%',
            name: '发制造部吨位数',
            type: 'bar',
            data: [],
            label: {
              color: '#000000',
              backgroundColor: '#92D050',
              position: 'top',
              show: true,
              formatter: function(params) {
                if (params.value === 0 || params.value === '0') {
                  return ''
                } else {
                  return params.value
                }
              }
            }
          },
          {
            barGap: '0%',
            name: '发动力吨位数',
            type: 'bar',
            data: [],
            label: {
              color: '#000000',
              backgroundColor: '#FAC090',
              show: true,
              formatter: function(params) {
                if (params.value === 0 || params.value === '0') {
                  return ''
                } else {
                  return params.value
                }
              }
            }
          },
          {
            barGap: '0%',
            name: '无硫发出吨位(收发)',
            type: 'bar',
            data: [],
            label: {
              color: '#000000',
              position: 'top',
              show: true,
              formatter: function(params) {
                if (params.value === 0 || params.value === '0') {
                  return ''
                } else {
                  return params.value
                }
              }
            }
          },
          {
            name: '合计',
            type: 'line',
            data: [],
            label: {
              position: 'top',
              color: 'black',
              backgroundColor: '#FFFF00',
              show: true,
              formatter: function(params) {
                if (params.value === 0 || params.value === '0') {
                  return ''
                } else {
                  return params.value
                }
              }
            }
          }
        ]
      },
      option1: {
        color: ['#C0504D', '#9BBB59', '#4A7EBB'],
        title: {
          left: 'center',
          text: '安吉（炼胶）190E彩胶线每日产能情况说明'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '6%',
          orient: 'horizontal',
          data: ['无硫(吨)', '加硫(吨)', '合计']
        },
        toolbox: {
          show: true
        },
        calculable: true,
        grid: {
          x: 60,
          y: 100,
          x2: 0,
          y2: 30
        },
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            barGap: '0%',
            name: '无硫(吨)',
            type: 'bar',
            data: [],
            label: {
              color: '#F5FFFF',
              backgroundColor: '#C00000',
              position: 'top',
              show: true,
              formatter: function(params) {
                if (params.value === 0 || params.value === '0') {
                  return ''
                } else {
                  return params.value
                }
              }
            }
          },
          {
            barGap: '0%',
            name: '加硫(吨)',
            type: 'bar',
            data: [],
            label: {
              color: '#000000',
              backgroundColor: '#92D050',
              position: 'top',
              show: true,
              formatter: function(params) {
                if (params.value === 0 || params.value === '0') {
                  return ''
                } else {
                  return params.value
                }
              }
            }
          },
          {
            name: '合计',
            type: 'line',
            data: [],
            label: {
              position: 'top',
              color: 'black',
              backgroundColor: '#FFFF00',
              show: true,
              formatter: function(params) {
                if (params.value === 0 || params.value === '0.00') {
                  return ''
                } else {
                  return params.value
                }
              }
            }
          }
        ]
      },
      option2: {
        color: ['#5B9BD5', '#ED7D31'],
        title: {
          left: 'center',
          text: '准备分厂吨耗时/吨胶密炼耗能趋势图'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '6%',
          orient: 'horizontal',
          data: ['吨胶密炼耗能（KWH/吨）', '吨耗时（分钟/吨）']
        },
        toolbox: {
          show: true
        },
        calculable: true,
        grid: {
          x: 60,
          y: 100,
          x2: 60,
          y2: 30
        },
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'KWH/吨',
            splitLine: {
              show: false
            },
            nameGap: 20
          },
          {
            type: 'value',
            name: '分钟/吨',
            min: 10,
            splitLine: {
              show: false
            },
            nameGap: 20
          }
        ],
        series: [
          {
            name: '吨胶密炼耗能（KWH/吨）',
            barWidth: 15,
            type: 'bar',
            yAxisIndex: 0,
            data: [],
            label: {
              fontSize: 15,
              color: '#F5FFFF',
              backgroundColor: '#5B9BD5',
              show: true,
              formatter: function(params) {
                if (params.value === 0 || params.value === '0') {
                  return ''
                } else {
                  return params.value
                }
              }
            }
          },
          {
            name: '吨耗时（分钟/吨）',
            type: 'line',
            yAxisIndex: 1,
            data: [],
            label: {
              fontSize: 15,
              position: 'top',
              color: 'black',
              backgroundColor: '#ED7D31',
              show: true,
              formatter: function(params) {
                if (params.value === 0 || params.value === '0') {
                  return ''
                } else {
                  return params.value
                }
              }
            }
          }
        ]
      }
    }
  },
  created() {
    this.tableHead = getDiffDate(this.search.date + '-01', getCurrentMonthLastDay(setDate()))
    this.getList()
  },
  methods: {
    async getProduct(val) {
      if (val) {
        try {
          const data = await equip190e('get', null, { params: { search: 1 }})
          this.optionsProduct = data.results || []
        } catch (e) {
        //
        }
      }
    },
    async classesChange(row, val) {
      if (val) {
        if (!row.specification) {
          this.$message('请先选择规格')
          return
        }
        const data = await equip190e('get', null, { params: { specification: row.specification }})
        this.options = data
      }
    },
    changeQty(row) {
      if (!row.weight1) {
        this.$message.info('请先选择规格和段数')
        return
      }
      if (row.qty === undefined) {
        row.weight = null
      } else {
        row.weight = (row.qty * row.weight1).toFixed(1)
      }
    },
    handleDisposeDelete(row) {
      this.dialogForm.data.splice(row.$index, 1)
    },
    changeRow(row) {
      if (row.state) {
        row.state = null
      }
      if (row.qty) {
        row.qty = undefined
      }
      if (row.weight) {
        row.weight = null
      }
      this.options = []
    },
    changeRow1(row) {
      row.weight1 = this.dataList.find(d => d.specification === row.specification && d.state === row.state).weight
      row.setup = this.dataList.find(d => d.specification === row.specification && d.state === row.state).id
      row.qty = 1
      row.weight = (row.qty * row.weight1).toFixed(1)
    },
    classChanged(val) {
      this.dialogForm.classes = val
      this.getTable()
    },
    async getTable() {
      if (!this.dialogForm.factory_date || !this.dialogForm.classes) {
        this.$message('请先选择工厂日期和班次')
        return
      }
      try {
        this.loading1 = true
        const data = await equip190e('get', null, { params: { detail: 1, factory_date: this.dialogForm.factory_date, classes: this.dialogForm.classes }})
        this.dialogForm.data = data.results || []
        this.dialogForm.data.forEach(d => {
          d.weight1 = d.weight
          d.weight = d.weight1 * d.qty
        })
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
      }
    },
    async get190eList() {
      try {
        const data = await equip190e('get', null, { params: {}})
        this.dataList = data || []
      } catch (e) {
        //
      }
    },
    async save() {
      const obj = this.tableData.filter(
        d => d.name === '外发无硫料(吨)' ||
      d.name === '实际生产工作日数' ||
      d.name === '190E实际生产工作日数' ||
      d.name === '实际生产机台数')
      var arr = []
      var arr1 = []
      var arr2 = []
      var arr3 = []
      obj.forEach(d => {
        for (const key in d) {
          if (d.name === '外发无硫料(吨)') {
            if (key !== 'name' && key !== 'weight' && key !== 'avg' && d[key] !== undefined) {
              arr.push({
                factory_date: this.search.date + '-' + (key.split('日')[0] >= 10 ? key.split('日')[0] : '0' + key.split('日')[0]),
                weight: d[key]
              })
            }
          }
          if (d.name === '实际生产工作日数') {
            if (key !== 'name' && key !== 'weight' && key !== 'avg' && d[key] !== undefined) {
              arr1.push({
                factory_date: this.search.date + '-' + (key.split('日')[0] >= 10 ? key.split('日')[0] : '0' + key.split('日')[0]),
                num: d[key]
              })
            }
          }
          if (d.name === '190E实际生产工作日数') {
            if (key !== 'name' && key !== 'weight' && key !== 'avg' && d[key] !== undefined) {
              arr2.push({
                factory_date: this.search.date + '-' + (key.split('日')[0] >= 10 ? key.split('日')[0] : '0' + key.split('日')[0]),
                num: d[key]
              })
            }
          }
          if (d.name === '实际生产机台数') {
            if (key !== 'name' && key !== 'weight' && key !== 'avg' && d[key] !== undefined) {
              arr3.push({
                factory_date: this.search.date + '-' + (key.split('日')[0] >= 10 ? key.split('日')[0] : '0' + key.split('日')[0]),
                num: d[key]
              })
            }
          }
        }
      })
      try {
        this.btnLoading = true
        await monthlyProductionCompletionReport('post', null, { data: {
          date: this.search.date, outer_data: arr, working_data: arr1,
          working_190e_data: arr2, equip_data: arr3 }})
        this.$message.success('操作成功')
        this.btnLoading = false
        this.getList()
      } catch (e) {
        this.btnLoading = false
      }
    },
    addCellDispose() {
      this.dialogForm.data.push({ })
    },
    createE190() {
      this.dialogVisible = true
      this.get190eList()
      this.dialogForm.data = []
      this.dialogForm.factory_date = setDate()
      this.getTable()
    },
    async submitFun() {
      if (!this.dialogForm.factory_date || !this.dialogForm.classes) {
        this.$message.info('工厂日期、班次必选')
        return
      }
      try {
        this.dialogForm.data.forEach(d => {
          if (!d.specification || !d.state || !d.qty) {
            throw new Error('每行数据必填')
          }
        })
        for (var i = 0; i < this.dialogForm.data.length; i++) {
          for (var j = i + 1; j < this.dialogForm.data.length; j++) {
            if (this.dialogForm.data[i].specification === this.dialogForm.data[j].specification &&
              this.dialogForm.data[i].state === this.dialogForm.data[j].state) {
              throw new Error('存在相同规格和段数')
            }
          }
        }
        this.btnLoading = true
        await monthlyProductionCompletionReport('post', null, { data: this.dialogForm })
        this.$message.success('操作成功')
        this.btnLoading = false
        this.dialogVisible = false
        this.getList()
      } catch (e) {
        this.btnLoading = false
        if (e.message === '每行数据必填' || e.message === '存在相同规格和段数') {
          this.$message(e.message)
        }
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await monthlyProductionCompletionReport('get', null, { params: this.search })
        this.tableData = data.results || []
        this.xList = []
        this.tableHead.forEach(d => {
          this.xList.push(parseInt(this.search.date.split('-')[1]) + '/' + d.split('日')[0])
        })
        this.tableData.forEach(d => {
          if (d.name === '终炼胶实际完成(吨)') {
            this.addList = []
            this.tableHead.forEach(item => {
              this.addList.push(
                d[item] ? d[item].toFixed(0) : 0)
            })
          }
          if (d.name === '混炼胶实际完成(吨)') {
            this.yList1 = []
            this.tableHead.forEach(item => {
              this.yList1.push(
                d[item] ? d[item].toFixed(0) : 0)
            })
          }
          if (d.name === '实际完成数-1(吨)') {
            this.yList2 = []
            this.tableHead.forEach(item => {
              this.yList2.push(
                d[item] ? d[item].toFixed(0) : 0)
            })
          }
          if (d.name === '实际完成数-2(吨)') {
            this.yList3 = []
            this.tableHead.forEach(item => {
              this.yList3.push(
                d[item] ? d[item].toFixed(0) : 0)
            })
          }
          if (d.name === '外发无硫料(吨)') {
            this.yList4 = []
            this.tableHead.forEach(item => {
              this.yList4.push(
                d[item] ? d[item].toFixed(0) : 0)
            })
          }
          if (d.name === '吨胶密炼耗能（KWH/吨）') {
            this.yList6 = []
            this.tableHead.forEach(item => {
              this.yList6.push(
                d[item] ? d[item].toFixed(2) : 0)
            })
          }
          if (d.name === '吨耗时（分钟/吨）') {
            this.yList7 = []
            this.tableHead.forEach(item => {
              this.yList7.push(
                d[item] ? d[item].toFixed(2) : 0)
            })
          }
        })
        this.yList5 = []
        for (var i = 0; i < this.tableHead.length; i++) {
          this.yList5.push(Number(this.addList[i]) + Number(this.yList1[i]))
        }
        this.option.xAxis[0].data = this.xList
        this.option.series[0].data = this.yList1
        this.option.series[1].data = this.yList2
        this.option.series[2].data = this.yList3
        this.option.series[3].data = this.yList4
        this.option.series[4].data = this.yList5
        this.option1.xAxis[0].data = this.xList
        this.option1.series[0].data = data.data_190e.wl
        this.option1.series[1].data = data.data_190e.jl
        this.option2.xAxis[0].data = this.xList
        this.option2.series[0].data = this.yList6
        this.option2.series[1].data = this.yList7
        this.totalList = []
        for (var index = 0; index < this.tableHead.length; index++) {
          this.totalList.push((Number(data.data_190e.wl[index]) + Number(data.data_190e.jl[index])).toFixed(2))
        }
        this.option1.series[2].data = this.totalList
        this.$nextTick(() => {
          const chartBar = echarts.init(document.getElementById('taskLine'))
          chartBar.setOption(this.option)
          const chartBar1 = echarts.init(document.getElementById('taskLine1'))
          chartBar1.setOption(this.option1)
          const chartBar2 = echarts.init(document.getElementById('taskLine2'))
          chartBar2.setOption(this.option2)
        })
        this.option.graphic = [{
          type: 'group',
          left: '85%',
          top: 0,
          children: [
            {
              type: 'rect',
              z: 100,
              left: 'center',
              top: 'middle',
              shape: {
                width: 150,
                height: 140
              },
              style: {
                fill: '#fff',
                stroke: '#555',
                lineWidth: 1,
                shadowBlur: 8,
                shadowOffsetX: 3,
                shadowOffsetY: 3,
                shadowColor: 'rgba(0,0,0,0.2)'
              }
            },
            {
              type: 'text',
              z: 100,
              left: 'center',
              top: 'middle',
              style: {
                text: [`日均产能/吨`, `无硫:${data.results[0].avg}`, `发制造部:${data.results[3].avg}`, `发动力:${data.results[4].avg}`, `无硫发出:${data.results[2].avg}`, `段数:${data.avg_results.ds}`].join('\n'),
                font: '500 14px sy',
                fill: '#1D2F2E',
                textLineHeight: 22
              }
            }
          ]
        }]
        this.option1.graphic = [{
          type: 'group',
          left: '85%',
          top: 0,
          children: [
            {
              type: 'rect',
              z: 100,
              left: 'center',
              top: 'middle',
              shape: {
                width: 150,
                height: 90
              },
              style: {
                fill: '#fff',
                stroke: '#555',
                lineWidth: 1,
                shadowBlur: 8,
                shadowOffsetX: 3,
                shadowOffsetY: 3,
                shadowColor: 'rgba(0,0,0,0.2)'
              }
            },
            {
              type: 'text',
              z: 100,
              left: 'center',
              top: 'middle',
              style: {
                text: [`日均产能`, `加硫:${data.avg_190e.jl}`, `无硫:${data.avg_190e.wl}`, `段数:${data.avg_190e.ds}`].join('\n'),
                font: '500 14px sy',
                fill: '#1D2F2E',
                textLineHeight: 22
              }
            }
          ]
        }]
        this.option2.graphic = [{
          type: 'group',
          left: '85%',
          top: 0,
          children: [
            {
              type: 'rect',
              z: 100,
              left: 'center',
              top: 'middle',
              shape: {
                width: 150,
                height: 90
              },
              style: {
                fill: '#fff',
                stroke: '#555',
                lineWidth: 1,
                shadowBlur: 8,
                shadowOffsetX: 3,
                shadowOffsetY: 3,
                shadowColor: 'rgba(0,0,0,0.2)'
              }
            },
            {
              type: 'text',
              z: 100,
              left: 'center',
              top: 'middle',
              style: {
                text: [`日均耗能/耗时`, `吨胶密炼耗能:${data.results[14].avg}`, `吨耗时:${data.results[13].avg}`].join('\n'),
                font: '500 14px sy',
                fill: '#1D2F2E',
                textLineHeight: 22
              }
            }
          ]
        }]
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.search.td_flag = this.td_flag ? 'Y' : undefined
      this.tableHead = getDiffDate(this.search.date + '-01', getCurrentMonthLastDay(this.search.date))
      this.getList()
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = { export: 1, date: this.search.date }
      const _api = dailyProductionCompletionDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = `月产量完成${setDate('', true)}.xlsx` // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    }
  }
}
function getDiffDate(start, end) {
  var startTime = getDate(start)
  var endTime = getDate(end)
  var dateArr = []
  while ((endTime.getTime() - startTime.getTime()) >= 0) {
    var d = startTime.getDate()
    dateArr.push(d + '日')
    startTime.setDate(startTime.getDate() + 1)
  }
  return dateArr
}
function getDate(datestr) {
  var temp = datestr.split('-')
  if (temp[1] === '01') {
    temp[0] = parseInt(temp[0], 10) - 1
    temp[1] = '12'
  } else {
    temp[1] = parseInt(temp[1], 10) - 1
  }
  // new Date()的月份入参实际都是当前值-1
  var date = new Date(temp[0], temp[1], temp[2])
  return date
}

function getCurrentMonthLastDay(d) {
  const date = new Date(d)
  let currentMonth = date.getMonth()
  const nextMonth = ++currentMonth
  const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
  const oneDay = 1000 * 60 * 60 * 24
  const lastTime = new Date(nextMonthFirstDay - oneDay)
  let month = parseInt(lastTime.getMonth() + 1)
  let day = lastTime.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return date.getFullYear() + '-' + month + '-' + day
}
</script>

<style lang="scss">
.dailyOutputCompleted{
  .el-divider{
    background: black;
  }
  .el-table .cell{
    text-overflow:clip;
  }
.el-table th{
        padding:0;
    }
    .header-style{
        position: relative;
    }
    .header-style-line{
        height: 1px;
        background:  #e4e6e9;
    }
    .three-line{
        transform-origin:left center;
        transform:rotate(14.5deg);
        width:185px;
        position: absolute;
        top:0px;
        left:-6px;
    }
    }
</style>
