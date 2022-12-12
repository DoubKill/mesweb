<template>
  <div>
    <!-- 胶料别合格率 -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="searchDate"
        />
      </el-form-item>
      <el-form-item label="胶料段">
        <el-select
          v-model="search.station"
          clearable
          placeholder="请选择"
          @visible-change="visibleStageList"
          @change="changeSearch1"
        >
          <el-option
            v-for="(item,k) in options"
            :key="k"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="胶料规格">
        <el-select
          v-model="search.product_type"
          style="width:250px"
          filterable
          placeholder="请选择"
          clearable
          @visible-change="visibleChange"
          @change="getList"
        >
          <el-option
            v-for="item in optionsProduct"
            :key="item.id"
            :label="item.product_no"
            :value="item.product_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产机台">
        <selectEquip
          :equip_no_props.sync="search.equip_no"
          @changeSearch="getList"
        />
      </el-form-item>
      <el-form-item label="班次">
        <class-select @classSelected="classChanged" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked" @change="getList">含试验料</el-checkbox>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          type="primary"
          @click="exportTable('胶料规格别合格率统计')"
        >导出表格</el-button>
      </el-form-item>
    </el-form>
    <div id="out-table">
      <!-- <div
        v-for="(item,key) in [tableData,tableData1]"
        :key="key"
      > -->
      <el-table
        v-loading="loading"
        :data="tableData"
        :row-class-name="tableRowClassName"
        border
        tooltip-effect="dark"
        style="width: 100%"
        max-height="600"
      >
        <!-- <el-table-column
          prop="product_type"
          label="胶料"
          width="70"
        /> -->
        <el-table-column label="胶料">
          <template slot-scope="scope">
            <el-link v-if="scope.row.product_type!=='合计'" type="primary" @click="clickOrderNum(scope.$index,scope.row)">{{ scope.row.product_type }}</el-link>
            <span v-else>{{ scope.row.product_type }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="JC"
          label="检查数"
          width="80"
          sortable
        />
        <el-table-column
          prop="HG"
          label="合格量"
          width="80"
          sortable
        />
        <el-table-column
          label="门尼不合格"
          width="110"
          align="center"
        >
          <el-table-column
            prop="mn_upper"
            label="+"
            width="55"
            sortable
          />
          <el-table-column
            prop="mn_lower"
            label="-"
            width="55"
            sortable
          />
        </el-table-column>
        <el-table-column
          label="硬度不合格"
          width="110"
          align="center"
        >
          <el-table-column
            prop="yd_upper"
            label="+"
            width="55"
            sortable
          />
          <el-table-column
            prop="yd_lower"
            label="-"
            width="55"
            sortable
          />
        </el-table-column>
        <el-table-column
          label="比重不合格"
          width="110"
          align="center"
        >
          <el-table-column
            prop="bz_upper"
            label="+"
            width="55"
            sortable
          />
          <el-table-column
            prop="bz_lower"
            label="-"
            width="55"
            sortable
          />
        </el-table-column>
        <el-table-column
          label="硫变不合格"
          align="center"
        >
          <el-table-column
            prop="MH"
            label="MH"
            min-width="20"
            align="center"
          >
            <el-table-column
              prop="MH_upper"
              label="+"
              min-width="20"
              sortable
            />
            <el-table-column
              prop="MH_lower"
              label="-"
              min-width="20"
              sortable
            />
          </el-table-column>
          <el-table-column
            prop="ML"
            label="ML"
            min-width="20"
            align="center"
          >
            <el-table-column
              prop="ML_upper"
              label="+"
              min-width="20"
              sortable
            />
            <el-table-column
              prop="ML_lower"
              label="-"
              min-width="20"
              sortable
            />
          </el-table-column>
          <el-table-column
            prop="TC10"
            label="TC10"
            min-width="20"
            align="center"
          >
            <el-table-column
              prop="TC10_upper"
              label="+"
              min-width="20"
              sortable
            />
            <el-table-column
              prop="TC10_lower"
              label="-"
              min-width="20"
              sortable
            />
          </el-table-column>
          <el-table-column
            prop="TC50"
            label="TC50"
            min-width="20"
            align="center"
          >
            <el-table-column
              prop="TC50_upper"
              label="+"
              min-width="20"
              sortable
            />
            <el-table-column
              prop="TC50_lower"
              label="-"
              min-width="20"
              sortable
            />
          </el-table-column>
          <el-table-column
            prop="TC90"
            label="TC90"
            min-width="20"
            align="center"
          >
            <el-table-column
              prop="TC90_upper"
              label="+"
              min-width="20"
              sortable
            />
            <el-table-column
              prop="TC90_lower"
              label="-"
              min-width="20"
              sortable
            />
          </el-table-column>
          <el-table-column
            prop="sum_s"
            label="硫变合计"
            min-width="35"
            sortable
          />
        </el-table-column>
        <el-table-column
          prop="RATE_1_PASS"
          label="一次合格率"
          min-width="35"
          sortable
        />
        <el-table-column
          prop="RATE_S_PASS"
          label="硫变合格率"
          sortable
          min-width="35"
        />
        <el-table-column
          prop="cp_all"
          label="次品合计"
          min-width="35"
          sortable
        />
        <el-table-column
          prop="rate"
          label="合格率"
          min-width="30"
          sortable
        />
      </el-table>
    </div>

    <el-dialog
      title=""
      :visible.sync="historyDialogVisible"
      width="80%"
      append-to-body
    >
      <h3 style="display:inline-block;margin:0 10px">日期</h3>
      <el-date-picker
        v-model="historyDate"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :clearable="false"
        @change="getHistoryDate"
      />
      <h3 style="display:inline-block;margin:0 10px">机台</h3>
      <selectEquip
        :equip_no_props.sync="history_equip_no"
        @changeSearch="getHistoryDate"
      />
      <div
        id="historySpot"
        style="width: 100%;height:1000px;margin-top:8px"
      />
    </el-dialog>
    <!-- </div> -->
  </div>
</template>

<script>
import ClassSelect from '@/components/ClassSelect'
import { globalCodesUrl, productInfosUrl } from '@/api/base_w'
import { rubberPass } from '@/api/jqy'
import { debounce, setDate, exportExcel } from '@/utils/index'
import selectEquip from '@/components/select_w/equip'
import * as echarts from 'echarts'
import { datapointCurve, pbRecentName } from '@/api/quick-check-detail'
export default {
  name: 'RubberCompound',
  components: { ClassSelect, selectEquip },
  data() {
    return {
      tableData: [],
      tableData1: null,
      formHeadData: [],
      search: {
      },
      loading: false,
      options: [],
      handleCardDialogVisible: false,
      dateValue: [setDate(), setDate()],
      checked: false,
      optionsProduct: [],
      historySpot: {
        title: [{
          text: "Anscombe's quartet"
        }],
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: [
          { left: '7%', top: '7%', width: '38%', height: '38%' }
        ],
        xAxis: [
          { gridIndex: 0 },
          { gridIndex: 1 }
        ],
        yAxis: [
          { gridIndex: 0 },
          { gridIndex: 1 }
        ],
        tooltip: {
          trigger: 'axis'
        },
        // tooltip: {
        //   triggerOn: 'click'
        // },
        series: [
          {
            name: 'I',
            type: 'scatter',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: []
          },
          {
            name: 'II',
            type: 'scatter',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      historyDialogVisible: false,
      historyDate: [],
      history_equip_no: '',
      row_roduct_no: ''
    }
  },
  created() {
    this.search.s_time = setDate()
    this.search.e_time = setDate()
    this.getList()
  },
  methods: {
    submitFun() {
      this.handleCardDialogVisible = false
      this.getList()
    },
    async getList() {
      try {
        this.search.sy_flag = 'Y'
        if (!this.checked) {
          delete this.search.sy_flag
        }
        this.loading = true
        this.tableData = []
        const data = await rubberPass('get', null, { params: this.search })
        this.tableData = data.result || []
        if (this.tableData.length > 0) {
          this.JC = 0
          this.HG = 0
          this.mn_upper = 0
          this.yd_upper = 0
          this.bz_upper = 0
          this.MH_upper = 0
          this.ML_upper = 0
          this.TC10_upper = 0
          this.TC50_upper = 0
          this.TC90_upper = 0
          this.mn_lower = 0
          this.yd_lower = 0
          this.bz_lower = 0
          this.MH_lower = 0
          this.ML_lower = 0
          this.TC10_lower = 0
          this.TC50_lower = 0
          this.TC90_lower = 0
          this.sum_s = 0
          this.cp_all = 0
          this.tableData.forEach(D => {
            // D.RATE_1_PASS = Number(D.RATE_1_PASS)
            // D.RATE_S_PASS = Number(D.RATE_S_PASS)
            // D.rate = Number(D.rate)
            this.JC += Number(D.JC)
            this.HG += Number(D.HG)
            this.mn_upper += Number(D.mn_upper)
            this.yd_upper += Number(D.yd_upper)
            this.bz_upper += Number(D.bz_upper)
            this.MH_upper += Number(D.MH_upper)
            this.ML_upper += Number(D.ML_upper)
            this.TC10_upper += Number(D.TC10_upper)
            this.TC50_upper += Number(D.TC50_upper)
            this.TC90_upper += Number(D.TC90_upper)
            this.mn_lower += Number(D.mn_lower)
            this.yd_lower += Number(D.yd_lower)
            this.bz_lower += Number(D.bz_lower)
            this.MH_lower += Number(D.MH_lower)
            this.ML_lower += Number(D.ML_lower)
            this.TC10_lower += Number(D.TC10_lower)
            this.TC50_lower += Number(D.TC50_lower)
            this.TC90_lower += Number(D.TC90_lower)
            this.sum_s += Number(D.sum_s)
            this.cp_all += Number(D.cp_all)
          })
          if (this.JC !== 0 && this.tableData.length !== 0) {
            this.tableData1 = [{
              product_type: '合计',
              JC: this.JC,
              HG: this.HG,
              mn_upper: this.mn_upper,
              yd_upper: this.yd_upper,
              bz_upper: this.bz_upper,
              RATE_1_PASS: data.all.rate_1,
              MH_upper: this.MH_upper,
              ML_upper: this.ML_upper,
              TC10_upper: this.TC10_upper,
              TC50_upper: this.TC50_upper,
              TC90_upper: this.TC90_upper,
              mn_lower: this.mn_lower,
              yd_lower: this.yd_lower,
              bz_lower: this.bz_lower,
              MH_lower: this.MH_lower,
              ML_lower: this.ML_lower,
              TC10_lower: this.TC10_lower,
              TC50_lower: this.TC50_lower,
              TC90_lower: this.TC90_lower,
              sum_s: this.sum_s,
              RATE_S_PASS: data.all.rate_lb,
              cp_all: this.cp_all,
              rate: (this.HG / this.JC * 100).toFixed(2)
            }]
            this.tableData.push(...this.tableData1)
          }
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    visibleStageList(bool) {
      if (bool) {
        globalCodesUrl('get', {
          params: {
            class_name: '胶料段次'
          }
        }).then((response) => {
          this.options = response.results
        }).catch(function() {
        })
      }
    },
    searchDate(arr) {
      if (arr === null) {
        this.$message.info('请选择时间')
        return
      } else {
        this.search.s_time = arr ? arr[0] : ''
        this.search.e_time = arr ? arr[1] : ''
        this.getList()
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.product_type === '合计') {
        return 'summary-cell-style'
      }
    },
    classChanged(val) {
      this.search.classes = val
      this.getList()
    },
    productBatchingChanged(val) {
      this.search.product_type = val.material_name
      this.getList()
    },
    changeSearch() {
      debounce(this, 'getList')
    },
    changeSearch1() {
      this.getList()
    },
    exportTable(val) {
      exportExcel(val)
    },
    async visibleChange(val) {
      if (val) {
        try {
          const data = await productInfosUrl('get', null, { params: { all: 1 }})
          this.optionsProduct = data.results || []
        } catch (e) {
        //
        }
      }
    },
    clickOrderNum(index, row) {
      this.showRoductNo(row)
      this.historyDialogVisible = true
    },
    async showRoductNo(row) {
      try {
        const data = await pbRecentName({ product_no: row.product_type,
          st: this.dateValue[0], et: this.dateValue[1] })
        let a = setDate()
        let timestamp = new Date().getTime()
        let b = setDate(timestamp - 1000 * 60 * 60 * 24 * 10)
        if (this.dateValue && this.dateValue.length > 0) {
          a = this.dateValue[1]
          timestamp = new Date(this.dateValue[0]).getTime()
          b = setDate(timestamp - 1000 * 60 * 60 * 24 * 10)
        }
        this.historyDate = [b, a]

        this.row_roduct_no = data || ''
        this.getHistoryDate()
      } catch (e) {
        this.$message.info('没有查到该类型的胶料')
      }
    },
    async getHistoryDate() {
      try {
        const obj = {
          st: this.historyDate[0] || '',
          et: this.historyDate[1] || '',
          product_no: this.row_roduct_no || '',
          equip_no: this.history_equip_no
        }
        this.historyLoading = true
        const data = await datapointCurve(obj)
        this.historyLoading = false

        const _x = []
        const _y = []
        const _title = []
        const _grid = []
        const _series = []
        const _num = Math.ceil(data.data.length / 2) + 3.1
        const _height = (1 / _num * 100).toFixed(0) + '%'
        const _height1 = (1 / _num * 100 + 8).toFixed(0)

        data.data.forEach((d, _i) => {
          const _dataSeries = []
          const _dataSeriesX = []
          const _1 = data.indicators[d.name] ? data.indicators[d.name].lower_limit : 0 // 下限
          const _3 = data.indicators[d.name] ? data.indicators[d.name].upper_limit : 0 // 上限
          const _2 = setData((_3 + _1) / 2)
          let _min = setData(_1 - (_3 - (_3 + _1) / 2))
          let _max = setData(_3 + (_3 - (_3 + _1) / 2))
          if (_3 >= 999) {
            _min = setData(_1 - 10)
            _max = setData(_1 + 30)
          }
          if (_3 >= 999 && ['伸长率%', '钢拔'].includes(d.name)) {
            _min = setData(_1 - 150)
            _max = setData(_1 + 450)
          }
          if (_min < 0) {
            _min = 0
          }

          d.data.forEach((dd, ii) => {
            _dataSeries.push(dd.v)
            _dataSeriesX.push(dd.date)
          })
          _x.push({
            gridIndex: _i,
            data: _dataSeriesX,
            type: 'category',
            boundaryGap: false
          })
          _y.push({
            gridIndex: _i,
            type: 'value',
            max: _max,
            min: _min,
            interval: setData(_1 - _min)
          })
          if (_i % 2 === 0 || _i === 0) {
            const _top1 = (_i / 2) * _height1 + 5 + '%'
            const _topTitle1 = (_i / 2) * _height1 + 2 + '%'
            _title.push({ text: d.name, left: '8%', top: _topTitle1 })
            _grid.push({ left: '3%', top: _top1, width: '40%', height: _height })
          } else {
            const _top2 = ((_i - 1) / 2) * _height1 + 5 + '%'
            const _topTitle2 = ((_i - 1) / 2) * _height1 + 2 + '%'
            _title.push({ text: d.name, right: '8%', top: _topTitle2 })
            _grid.push({ right: '7%', top: _top2, width: '40%', height: _height })
          }

          if (_3 < 999) {
            _dataSeries.push(_3)
          }
          _series.push({
            name: d.name,
            type: 'scatter',
            xAxisIndex: _i,
            yAxisIndex: _i,
            data: _dataSeries,
            smooth: true,
            markLine: data.indicators[d.name] ? {
              // symbol: 'none',
              precision: 3,
              data: [{
                // silent: true,
                yAxis: _1, label: {
                  position: 'end',
                  formatter: `下限(${_1})`
                }},
              {
                yAxis: _2, label: {
                  position: 'end',
                  formatter: `中央值(${_2})`
                }},
              {
                yAxis: _3, label: {
                  position: 'end',
                  formatter: `上限(${_3})`
                }}
              ]
            } : {}
          })
        })
        let equip_nos = JSON.stringify(data.equip_nos)
        if (this.history_equip_no) {
          equip_nos = '[' + JSON.stringify(this.history_equip_no) + ']'
        }
        equip_nos = equip_nos.replace(/"/g, '')
        equip_nos = equip_nos.replace(/,/g, '/')
        _title.push({ text: this.row_roduct_no + '数据推移' +
        ' (' + this.historyDate[0] + '至' + this.historyDate[1] + ') ' +
        equip_nos, left: 'center', top: 0 })
        this.historySpot.toolbox.feature.saveAsImage.name = this.row_roduct_no + ' (' + this.historyDate[0] + '至' + this.historyDate[1] + ') ' + setDate()
        this.historySpot.xAxis = _x || []
        this.historySpot.yAxis = _y || []
        this.historySpot.title = _title || []
        this.historySpot.grid = _grid || []
        this.historySpot.series = _series || []

        this.chartHistoryBar = echarts.init(document.getElementById('historySpot'))
        this.chartHistoryBar.setOption(this.historySpot, true)
      } catch (e) {
        //
      }
    }
  }
}
function setData(val) {
  return Math.round(val * 1000) / 1000
}
</script>
