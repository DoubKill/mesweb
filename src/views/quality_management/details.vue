<template>
  <div
    class="app-container details_style"
  >
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="day_time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="dayChange"
        />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          :equip_no_props.sync="getParams.equip_no"
          @changeSearch="clickQuery"
        />
      </el-form-item>
      <el-form-item label="胶料">
        <all-product-no-select
          @productBatchingChanged="productBatchingChanged"
        />
      </el-form-item>
      <el-form-item label="班次">
        <class-select @classSelected="classSelected" />
      </el-form-item>
      <el-form-item label="段次">
        <stage-select v-model="getParams.stage" @change="clickQuery" />
      </el-form-item>
      <el-form-item label="综合检测结果">
        <el-select
          v-model="getParams.is_qualified"
          placeholder="请选择"
          clearable
          @change="clickQuery"
        >
          <el-option
            v-for="(item,i) in options"
            :key="i"
            :label="item.name"
            :value="item.bool"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="clickQuery">查询</el-button>
      </el-form-item> -->
      <br>
      <el-form-item>
        <el-button @click="filterDialogVisible = true">
          显示过滤界面
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['result_info','export']"
          :loading="btnLoading"
          @click="getALLData"
        >
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <u-table
      v-el-table-infinite-scroll="infiniteScroll"
      style="height:auto"
      :data="testOrders"
      fixed-columns-roll
      border
      fit
      row-id="id"
      max-height="600"
      size="mini"
      :tree-config="{
        children: 'children',
        expandAll: false,
        lazy: true,
        load: load,
        hasChildren: 'hasChildren'}"
      :data-changes-scroll-top="false"
      :row-class-name="tableRowClassName"
    >
      <!-- use-virtual 省略号 -->
      <u-table-column label="生产信息" align="center">
        <u-table-column
          label="工厂日期"
          min-width="20px"
          prop="production_factory_date"
          align="center"
          :tree-node="true"
        >
          <template v-if="row.production_factory_date" slot-scope="{row}">
            {{ (row.production_factory_date).split(' ')[0] }}
          </template>
        </u-table-column>
        <u-table-column label="生产班次/班组" prop="class_group" min-width="20px" />
        <u-table-column align="center" label="生产机台" min-width="20px" prop="production_equip_no" />
        <u-table-column label="胶料编码" min-width="20px" align="center" prop="product_no">
          <template slot-scope="scope">
            <el-link type="primary" @click="clickOrderNum(scope.$index,scope.row)">{{ scope.row.product_no }}</el-link>
          </template>
        </u-table-column>
        <u-table-column label="车次" align="center" min-width="20px" prop="actual_trains" />
        <u-table-column label="检测状态" prop="test_status" align="center" min-width="20px">
          <template slot-scope="{ row }">
            <div :class="row.test_status === '复检' ? 'test_type_name_style': ''">
              {{ row.test_status }}
            </div>
          </template>
        </u-table-column>
      </u-table-column>
      <u-table-column v-for="header in testTypeList.filter(type => type.show)" :key="header.test_type_name" align="center" :label="header.test_type_name">
        <u-table-column v-for="subHeader in header.data_indicator_detail.filter(item => item.show)" :key="header.test_type_name + subHeader.detail" min-width="20px" :label="subHeader.detail" align="center">
          <template slot-scope="{ row }">
            <div :class="getDataPoint(header.test_type_name, subHeader.detail, row.order_results, 'level')!==1&&getDataPoint(header.test_type_name, subHeader.detail, row.order_results, 'level')!==''?'test_type_name_style':''">
              {{ getDataPoint(header.test_type_name, subHeader.detail, row.order_results, 'value') }}
            </div>
          </template>
        </u-table-column>
        <u-table-column v-if="header.test_type_name === '门尼' || header.test_type_name === '流变'" label="检测机台" min-width="20px" align="center">
          <template slot-scope="{row}">
            {{ getDataPoint(header.test_type_name, 'maxLevelItem', row.order_results, 'machine_name') }}
          </template>
        </u-table-column>
        <u-table-column min-width="20px" label="标准" align="center">
          <template slot-scope="{row}">
            {{ getDataPoint(header.test_type_name, 'maxLevelItem', row.order_results, 'upper_lower') }}
          </template>
        </u-table-column>
        <u-table-column min-width="20px" label="等级" align="center">
          <template slot-scope="{row}">
            {{ getDataPoint(header.test_type_name, 'maxLevelItem', row.order_results, 'level') }}
          </template>
        </u-table-column>
      </u-table-column>
      <u-table-column label="综合等级" min-width="20px" prop="level" align="center" />
      <u-table-column label="综合检测结果" min-width="20px" prop="mes_result" align="center" />
    </u-table>
    <el-dialog
      title="选择过滤"
      :visible.sync="filterDialogVisible"
    >
      <el-table
        border
        :data="testTypeList"
      >
        <el-table-column label="选择" min-width="50">
          <template slot-scope="{row}">
            <el-checkbox v-model="row.show" />
          </template>
        </el-table-column>
        <el-table-column label="实验方法" min-width="80">
          <template slot-scope="{row}">
            <span>{{ row.test_type_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="检测项">
          <template slot-scope="{row}">
            <template v-for="item in row.data_indicator_detail">
              <el-checkbox :key="item.detail" v-model="item.show">{{ item.detail }}</el-checkbox>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="filterDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="胶料信息卡"
      width="80%"
      :visible.sync="testCardDialogVisible"
    >
      <test-card ref="testCard" />
    </el-dialog>
    <el-dialog
      title="快检值历史曲线"
      :visible.sync="historyDialogVisible"
      width="80%"
    >
      <el-date-picker
        v-model="historyDate"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :clearable="false"
        @change="changeHistoryDate"
      />
      <div
        id="historyBar"
        style="width: 100%;height:300px;margin-top:8px"
      />
    </el-dialog>

    <!-- 下载使用 -->
    <DetailsUTable
      v-show="false"
      id="out-table"
      :test-orders="ALLData"
      :test-type-list="testTypeList"
    />

  </div>
</template>

<script>
import dayjs from 'dayjs'
import EquipSelect from '@/components/select_w/equip'
import ClassSelect from '@/components/ClassSelect'
import StageSelect from '@/components/StageSelect'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import { testTypes, materialTestOrders, testResultHistory, datapointCurve } from '@/api/quick-check-detail'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import DetailsUTable from './components/details-u-table'
import { setDate } from '@/utils'
import * as echarts from 'echarts'
export default {
  name: 'Details',
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: { EquipSelect, DetailsUTable, allProductNoSelect, ClassSelect, StageSelect },
  data() {
    return {
      count: 0,
      allPage: 0,
      day_time: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
      getParams: {
        st: dayjs().format('YYYY-MM-DD'),
        et: dayjs().format('YYYY-MM-DD'),
        equip_no: null,
        classes: null,
        product_no: null,
        stage: null,
        page: 1
      },
      listLoading: true,
      filterDialogVisible: false,
      testCardDialogVisible: false,
      testTypeList: [
        {
          test_type_id: null,
          test_type_name: '',
          show: false,
          data_indicator_detail: [{ detail: '', show: false }]
        }
      ],
      testOrders: [],
      testOrdersAll: [],
      index: 1,
      recordList: [],
      isMoreLoad: true,
      // 默认每页数量
      definePafeSize: 10,
      valueResult: '',
      ALLData: [],
      btnLoading: false,
      options: [{ name: '一等品', bool: true }, { name: '三等品', bool: false }],
      historyDialogVisible: false,
      historyDate: [],
      row_roduct_no: '',
      optionBar: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          name: '测试点值'
        },
        series: []
      }
    }
  },
  created() {
    this.getTestTypes()
    this.testOrders = []
    this.testOrdersAll = []
    this.getMaterialTestOrders()
  },
  mounted() {
    // window.addEventListener('scroll', () => {
    //   const scrollHeight = document.body.scrollHeight - 1
    //   const clientHeight = document.body.clientHeight
    //   const scrollTop = document.documentElement.scrollTop + document.body.scrollTop

    //   if (clientHeight + scrollTop >= scrollHeight) {
    //     // 滚动到了底部
    //     if (this.isMoreLoad && !this.listLoading) {
    //       this.getParams.page = this.getParams.page + 1
    //       this.getMaterialTestOrders()
    //     }
    //   }
    // })
  },
  beforeUpdata() {

  },
  methods: {
    dayTimeChanged() {
      this.clickQuery()
    },
    clearList() {
      this.getParams.page = 1
      this.allPage = 0
      this.testOrders = []
      this.testOrdersAll = []
    },
    titleInfo(val, error) {
      if (!val && val !== 0) {
        this.$message.info(error)
        throw new Error(error)
      }
    },
    classSelected(className) {
      this.getParams.classes = className || null
      this.clickQuery()
    },
    productBatchingChanged(val) {
      this.getParams.product_no = val ? val.material_no : null
      this.clickQuery()
    },
    load(tree, resolve) {
      // expand-change
      const subRows = []
      testResultHistory(tree.id).then(testResul => {
        for (const testTime in testResul) {
          const row = JSON.parse(JSON.stringify(tree))
          row.test_status = '正常'
          row.index = this.index++
          row.hasChildren = false
          row.order_results = testResul[testTime]

          row.level = 0
          row.mes_result = '未检测'
          for (const testTypeName in row.order_results) {
            const testType = row.order_results[testTypeName]
            let maxLevel = 0
            // let mes_result = '未检测'
            for (const dataPointName in testType) {
              const dataPoint = testType[dataPointName]
              if (dataPoint.test_times > 1) {
                row.test_status = '复检'
              }
              if (dataPoint.level > maxLevel) {
                maxLevel = dataPoint.level
                // mes_result = dataPoint.mes_result
                testType['maxLevelItem'] = dataPoint
              }
            }
            if (maxLevel > row.level) {
              row.level = maxLevel
              row.mes_result = row.level === 1 ? '一等品' : '三等品'
            }
          }

          subRows.push(row)
        }
        resolve(subRows)
      })
    },
    clickQuery() {
      this.getParams.page = 1
      this.testOrders = []
      this.testOrdersAll = []
      this.getMaterialTestOrders()
    },
    dayChange(val) {
      this.getParams.st = val ? val[0] : ''
      this.getParams.et = val ? val[1] : ''
      this.clickQuery()
    },
    async getALLData() {
      try {
        this.btnLoading = true
        const arr = await this.getMaterialTestOrders(true)
        this.ALLData = arr || []
        this.btnLoading = false
        this.exportExcel()
      } catch (e) {
        //
      }
    },
    async getMaterialTestOrders(bool = false) {
      this.listLoading = true
      try {
        const paramsObj = JSON.parse(JSON.stringify(this.getParams))
        paramsObj.page_size = bool ? 99999999 : 10
        const data = await materialTestOrders(paramsObj)
        let arr = data.results // 加分页
        // let arr = data
        arr = arr.map(row => {
          row.level = 0
          row.mes_result = '未检测'
          for (const testTypeName in row.order_results) {
            const testType = row.order_results[testTypeName]
            let maxLevel = 0
            // let mes_result = '未检测'
            for (const dataPointName in testType) {
              const dataPoint = testType[dataPointName]
              if (dataPoint.test_times > 1) {
                this.$set(row, 'test_status', '复检')
                this.$set(row, 'hasChildren', true)
              } else {
                this.$set(row, 'test_status', '正常')
                this.$set(row, 'hasChildren', false)
              }
              if (dataPoint.level > maxLevel) {
                maxLevel = dataPoint.level
                // mes_result = dataPoint.mes_result
                testType['maxLevelItem'] = dataPoint
              }
            }
            if (maxLevel > row.level) {
              row.level = maxLevel
              row.mes_result = row.level === 1 ? '一等品' : '三等品'
            }
          }
          return {
            ...row,
            index: this.index++,
            class_group: `${row.production_class}/${row.production_group}`
          }
        })
        // arr.forEach(row => {
        // })
        // for (let i = 1; i < 8; i++) {
        //   arr = arr.concat(arr)
        // }

        if (bool) {
          return arr
        }
        this.listLoading = false
        this.allPage = data.count

        this.testOrdersAll.push(...arr)
        this.testOrders = this.testOrdersAll
      } catch (e) {
        this.listLoading = false
      }
    },
    infiniteScroll() {
      if (Number(this.allPage - this.getParams.page * this.definePafeSize) <= 0) {
        return
      }
      this.getParams.page = this.getParams.page + 1
      this.getMaterialTestOrders()
    },
    async getTestTypes() {
      try {
        this.testTypeList = []
        const testTypeList = await testTypes()
        this.testTypeList = testTypeList.map(testType => {
          testType.data_indicator_detail = testType.data_indicator_detail.map(detail => {
            return {
              detail,
              show: true
            }
          })
          return {
            ...testType,
            show: true
          }
        })
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
      }
    },
    showCard(row) {
      this.testCardDialogVisible = true
      this.$nextTick(() => {
        this.$refs['testCard'].setTestData(row)
      })
    },
    getDataPoint(testType, dataPoint, data, key) {
      const result = data[testType] ? (data[testType][dataPoint] ? data[testType][dataPoint] : null) : null
      return result ? result[key] : ''
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.mes_result !== '一等品') {
        return 'warning-row'
      }
      return ''
    },
    changeHistoryDate() {
      this.getHistoryDate()
    },
    clickOrderNum(index, row) {
      let a = setDate()
      let timestamp = new Date().getTime()
      let b = setDate(timestamp - 1000 * 60 * 60 * 24 * 10)
      if (this.day_time && this.day_time.length > 0) {
        a = this.day_time[1]
        timestamp = new Date(this.day_time[0]).getTime()
        b = setDate(timestamp - 1000 * 60 * 60 * 24 * 10)
      }
      this.historyDate = [b, a]

      this.historyDialogVisible = true
      this.row_roduct_no = row.product_no
      this.getHistoryDate()
    },
    async getHistoryDate() {
      try {
        const obj = {
          st: this.historyDate[0] || '',
          et: this.historyDate[1] || '',
          product_no: this.row_roduct_no || ''
        }
        this.historyLoading = true
        const data = await datapointCurve(obj)
        this.historyLoading = false

        data.y_axis.forEach(d => {
          d.markLine = {
            silent: true,
            lineStyle: {
              color: '#333'
            },
            data: [{
              yAxis: data.indicators[d.name] ? data.indicators[d.name][0] : ''
            }, {
              yAxis: data.indicators[d.name] ? data.indicators[d.name][1] : ''
            }]
          }
        })

        const arr = []
        for (const iterator in data.indicators) {
          arr.push(iterator)
        }

        this.optionBar.xAxis.data = data.x_axis || []
        this.optionBar.series = data.y_axis || []
        this.optionBar.legend.data = arr
        this.chartHistoryBar = echarts.init(document.getElementById('historyBar'))
        this.chartHistoryBar.setOption(this.optionBar, true)
      } catch (e) {
        //
      }
    },
    exportExcel() {
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          // Blob 对象表示一个不可变、原始数据的类文件对象。
          // Blob 表示的不一定是JavaScript原生格式的数据。
          // File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: 'application/octet-stream' }),
          // 设置导出文件名称
          '胶料快检详细信息.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    }
  }
}
</script>

<style lang="scss">
.details_style{
  .el-table .warning-row {
    background: oldlace;

  }
  .el-table [class*=el-table__row--level] .el-table__expand-icon{
    width: 10px;
  }
  .el-table .cell{
    line-height: 18px;
    padding: 4px !important;
  }
  // td{
    // position: relative;
    // padding:2px !important;
    // margin:2px !important;
  // }
  .el-table .cell{
    padding: 0px 4px !important;
  }
  // .el-table td, .el-table th.is-center{
    // padding: 2px !important;
  // }
  .test_type_name_style{
    // position: absolute;
    // top: 0;
    // left: 0;
    background: red;
    // width: 100%;
    // line-height: auto;
    // justify-content: center;
    // height: 100%;
    // display: flex !important;
    // align-items: center;
    color:#fff;
  }

}

</style>
