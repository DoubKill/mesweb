<template>
  <div class="dailyOutputCompleted">
    <!-- 月产量完成 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.date"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
          :clearable="false"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['daily_production_completion_report','export']"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button
          v-permission="['daily_production_completion_report','add']"
          type="primary"
          @click="createE190"
        >录入190E的产量</el-button>
        <el-button v-permission="['daily_production_completion_report','save']" type="primary" :loading="btnLoading" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column width="140px">
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
      <template v-for="(d,index) in tableHead">
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
            <el-input-number v-if="row.name==='外发无硫料(吨)'&&!exportTableShow" v-model="row[d]" controls-position="right" :min="0" style="width:110px" />
            <span v-else>{{ row[d] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        prop="weight"
        label="日累计完成1日为起点"
        width="90"
      />
    </el-table>

    <div
      id="taskLine"
      style="width: 100%;height:500px;margin-top:100px"
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
            <el-input-number v-model="row.qty" :min="1" controls-position="right" @change="changeQty(row)" />
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
import { dailyProductionCompletionReport, equip190e } from '@/api/jqy'
import classSelect from '@/components/ClassSelect'
import * as echarts from 'echarts'
import { exportExcel } from '@/utils/index'
import { setDate } from '@/utils'
export default {
  name: 'DailyOutputCompleted',
  components: { classSelect },
  data() {
    return {
      search: {
        date: setDate(null, null, 'month')
      },
      loading: false,
      btnLoading: false,
      dialogVisible: false,
      dialogForm: { factory_date: '' },
      options: [],
      loading1: false,
      dataList: [],
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
            name: '无硫',
            type: 'bar',
            data: [],
            label: {
              color: '#F5FFFF',
              backgroundColor: '#C00000',
              position: 'top',
              show: true,
              formatter: function(params) {
                if (params.value === 0) {
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
                if (params.value === 0) {
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
                if (params.value === 0) {
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
                if (params.value === 0) {
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
                if (params.value === 0) {
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
        this.options = data.results
      }
    },
    changeQty(row) {
      console.log(row.qty)
      if (!row.weight1) {
        this.$message.info('请先选择规格和段数')
        return
      }
      if (row.qty === undefined) {
        row.weight = null
      } else {
        row.weight = row.qty * row.weight1
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
      row.weight = row.qty * row.weight1
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
        this.dataList = data.results || []
      } catch (e) {
        //
      }
    },
    async save() {
      const obj = this.tableData.find(d => d.name === '外发无硫料(吨)')
      var arr = []
      for (const key in obj) {
        if (key !== 'name' && key !== 'weight' && obj[key] !== undefined) {
          arr.push({
            factory_date: this.search.date + '-' + (key.split('日')[0] > 10 ? key.split('日')[0] : '0' + key.split('日')[0]),
            weight: obj[key]
          })
        }
      }
      try {
        this.btnLoading = true
        await dailyProductionCompletionReport('post', null, { data: { date: this.search.date, outer_data: arr }})
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
        await dailyProductionCompletionReport('post', null, { data: this.dialogForm })
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
        const data = await dailyProductionCompletionReport('get', null, { params: this.search })
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
        this.$nextTick(() => {
          const chartBar = echarts.init(document.getElementById('taskLine'))
          chartBar.setOption(this.option)
        })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.tableHead = getDiffDate(this.search.date + '-01', getCurrentMonthLastDay(this.search.date))
      this.getList()
    },
    async exportTable() {
      await this.$set(this, 'exportTableShow', true)
      await exportExcel('月产量完成报表')
      setTimeout(() => {
        this.exportTableShow = false
      }, 300)
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
        transform:rotate(17.8deg);
        width:160px;
        position: absolute;
        top:0px;
        left:-6px;
    }
    }
</style>
