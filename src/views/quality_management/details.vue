<template>
  <div
    class="app-container details_style"
  >
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="getParams.day_time"
          :clearable="false"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="dayTimeChanged"
        />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          :equip_no_props.sync="getParams.equip_no"
          @changeSearch="equipSelected"
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
        <stage-select v-model="getParams.stage" @change="stageChange" />
      </el-form-item>
      <el-form-item label="综合检测结果">
        <el-select
          v-model="getParams.mes_result"
          placeholder="请选择"
          clearable
          @change="valueResultFun"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clickQuery">查询</el-button>
      </el-form-item>
      <br>
      <el-form-item>
        <el-button @click="filterDialogVisible = true">
          显示过滤界面
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['result_info','export']"
          @click="exportExcel"
        >
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <!-- v-el-table-infinite-scroll="infiniteScroll" -->
    <el-table
      id="out-table"
      v-loading="listLoading"
      :data="testOrders"
      border
      fit
      row-key="index"
      lazy
      :load="load"
      max-height="600"
      size="mini"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="生产信息" align="center">
        <el-table-column label="工厂日期" min-width="90px" prop="production_factory_date" align="center">
          <template slot-scope="{row}">
            {{ (row.production_factory_date).split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column label="生产班次/班组" prop="class_group" show-overflow-tooltip min-width="75px" />
        <el-table-column label="生产机台" min-width="40px" prop="production_equip_no" />
        <el-table-column label="胶料编码" min-width="105px" align="center" prop="product_no" />
        <el-table-column label="车次" align="center" min-width="35px" prop="actual_trains" />
        <el-table-column label="检测状态" min-width="35px" prop="test_status" align="center">
          <template slot-scope="{ row }">
            <div :class="row.test_status === '复检' ? 'test_type_name_style': ''">
              {{ row.test_status }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-for="header in testTypeList.filter(type => type.show)" :key="header.test_type_name" align="center" :label="header.test_type_name">
        <el-table-column v-for="subHeader in header.data_indicator_detail.filter(item => item.show)" :key="header.test_type_name + subHeader.detail" min-width="55px" :label="subHeader.detail" align="center">
          <template slot-scope="{ row }">
            <div :class="getDataPoint(header.test_type_name, subHeader.detail, row.order_results, 'level')!==1&&getDataPoint(header.test_type_name, subHeader.detail, row.order_results, 'level')!==''?'test_type_name_style':''">
              {{ getDataPoint(header.test_type_name, subHeader.detail, row.order_results, 'value') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="header.test_type_name === '门尼' || header.test_type_name === '流变'" label="检测机台" min-width="50px" align="center">
          <template slot-scope="{row}">
            {{ getDataPoint(header.test_type_name, 'maxLevelItem', row.order_results, 'machine_name') }}
          </template>
        </el-table-column>
        <el-table-column min-width="35px" label="等级" align="center">
          <template slot-scope="{row}">
            {{ getDataPoint(header.test_type_name, 'maxLevelItem', row.order_results, 'level') }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="综合等级" min-width="35px" prop="level" align="center" />
      <el-table-column label="综合检测结果" show-overflow-tooltip min-width="60px" prop="mes_result" align="center" />
    </el-table>
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
  </div>
</template>

<script>
import dayjs from 'dayjs'
import EquipSelect from '@/components/select_w/equip'
import ClassSelect from '@/components/ClassSelect'
import StageSelect from '@/components/StageSelect'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import { testTypes, materialTestOrders, testResultHistory } from '@/api/quick-check-detail'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: { EquipSelect, allProductNoSelect, ClassSelect, StageSelect },
  data() {
    return {
      count: 0,
      allPage: 0,
      getParams: {
        day_time: dayjs().format('YYYY-MM-DD'),
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
      testOrders: [
      ],
      testOrdersAll: [],
      index: 1,
      recordList: [],
      isMoreLoad: true,
      // 默认每页数量
      definePafeSize: 10,
      valueResult: '',
      options: ['一等品', '三等品']
    }
  },
  created() {
    this.getTestTypes()
    // this.getMaterialTestOrders()
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
      // this.clearList()
      // this.getMaterialTestOrders()
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
    equipSelected(equip) {
    },
    stageChange() {
    },
    classSelected(className) {
      this.getParams.classes = className || null
    },
    productBatchingChanged(val) {
      this.getParams.product_no = val ? val.material_no : null
    },
    load(tree, treeNode, resolve) {
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
    valueResultFun(val) {
    },
    clickQuery() {
      this.getMaterialTestOrders()
    },
    async getMaterialTestOrders() {
      this.listLoading = true
      try {
        const data = await materialTestOrders(this.getParams)
        let arr = data
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
                row.test_status = '复检'
                row.hasChildren = true
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
            hasChildren: false,
            test_status: '正常',
            class_group: `${row.production_class}/${row.production_group}`
          }
        })
        // arr.forEach(row => {
        // })
        // if (data.count - this.getParams.page * this.definePafeSize > 0) {
        //   this.isMoreLoad = true
        // } else {
        //   this.isMoreLoad = false
        // }
        this.testOrders = arr
        this.testOrdersAll = arr
        this.listLoading = false

        if (this.getParams.mes_result) {
          let testOrders = []
          testOrders = this.testOrdersAll.filter(D => D.mes_result === this.getParams.mes_result)
          this.testOrders = testOrders
        }
        // this.allPage = data.count
        // this.testOrders.push(...arr)
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 300)
      // eslint-disable-next-line no-empty
      } catch (e) {
        this.listLoading = false
      }
    },
    infiniteScroll() {
      if (Number(this.allPage - this.getParams.page * this.definePafeSize) < 0) {
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
      // eslint-disable-next-line no-empty
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
    // planScheduleSelected(planScheduleId) {
    //   console.log(planScheduleId)
    // }
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
  td{
    position: relative;
  }
  .test_type_name_style{
    position: absolute;
    top: 0;
    left: 0;
    background: red;
    width: 100%;
    line-height: auto;
    justify-content: center;
    height: 100%;
    display: flex;
    align-items: center;
    color:#fff;
  }

}

</style>
