<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="getParams.day_time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="dayTimeChanged"
        />
      </el-form-item>
      <!-- <el-form-item label="倒班规则">
        <plan-schedules-select :day-time="getParams.day_time" @planScheduleSelected="planScheduleSelected" />
      </el-form-item> -->
      <el-form-item label="机台">
        <equip-select @equipSelected="equipSelected" />
      </el-form-item>
      <el-form-item label="班次">
        <class-select @classSelected="classSelected" />
      </el-form-item>
      <el-form-item label="胶料">
        <product-no-select
          :is-stage-productbatch-no-remove="true"
          :make-use-batch="true"
          @productBatchingChanged="productBatchingChanged"
        />
      </el-form-item>
      <!-- <el-form-item label="综合处理意见">
        <el-select />
      </el-form-item> -->
      <el-form-item label="段次">
        <stage-select v-model="getParams.stage" @change="getMaterialTestOrders" />
      </el-form-item>
      <el-form-item>
        <el-button @click="filterDialogVisible = true">
          显示过滤界面
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="testOrders"
      border
      fit
      style="width: 100%"
      max-height="500"
      row-key="index"
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :row-class-name="tableRowClassName"
    >
      <!-- <el-table-column label="No" align="center" prop="index" /> -->
      <el-table-column label="生产信息" align="center">
        <el-table-column label="生产计划号" width="220" prop="plan_classes_uid" align="center" />
        <el-table-column label="收皮条码" prop="lot_no" />
        <el-table-column label="生产班次/班组" width="110" prop="class_group" />
        <el-table-column label="生产机台" prop="production_equip_no" />
        <el-table-column label="胶料编码" align="center" width="150" prop="product_no" />
        <el-table-column label="车次" width="50" align="center" prop="actual_trains" />
        <el-table-column label="检测状态" prop="test_status" align="center" />
      </el-table-column>
      <el-table-column v-for="header in testTypeList.filter(type => type.show)" :key="header.test_type_name" align="center" :label="header.test_type_name">
        <el-table-column v-for="subHeader in header.data_indicator_detail.filter(item => item.show)" :key="header.test_type_name + subHeader.detail" width="110" :label="subHeader.detail" align="center">
          <el-table-column label="机台" align="center">
            <template slot-scope="{ row }">
              {{ getDataPoint(header.test_type_name, subHeader.detail, row.order_results, 'machine_name') }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="检测次数" align="center">
            <template slot-scope="{ row }">
              {{ getDataPoint(header.test_type_name, subHeader.detail, row.order_results, 'test_times') }}
            </template>
          </el-table-column> -->
          <el-table-column label="检测值" align="center">
            <template slot-scope="{ row }">
              {{ getDataPoint(header.test_type_name, subHeader.detail, row.order_results, 'value') }}
            </template>
          </el-table-column>
          <el-table-column label="等级" align="center">
            <template slot-scope="{ row }">
              {{ getDataPoint(header.test_type_name, subHeader.detail, row.order_results, 'level') }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="等级" align="center">
          <template slot-scope="{row}">
            {{ getDataPoint(header.test_type_name, 'maxLevelItem', row.order_results, 'level') }}
            <!-- {{ row.test_indicator_list_[header.test_type_name].maxLevel }} -->
          </template>
        </el-table-column>
        <!-- <el-table-column label="检测结果" align="center">
          <template slot-scope="{row}">
            {{ getDataPoint(header.test_type_name, 'maxLevelItem', row.order_results, 'mes_result') }}
          </template>
        </el-table-column> -->
      </el-table-column>
      <el-table-column label="综合等级" prop="level" align="center" />
      <el-table-column label="综合检测结果" width="110" prop="mes_result" align="center" />
    </el-table>
    <el-dialog
      title="选择过滤"
      :visible.sync="filterDialogVisible"
    >
      <el-table
        border
        :data="testTypeList"
      >
        <el-table-column label="选择" width="50">
          <template slot-scope="{row}">
            <el-checkbox v-model="row.show" />
          </template>
        </el-table-column>
        <el-table-column label="实验方法" width="80">
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
import PlanSchedulesSelect from '@/components/PlanSchedulesSelect'
import EquipSelect from '@/components/EquipSelect'
import ClassSelect from '@/components/ClassSelect'
import ProductNoSelect from '@/components/ProductNoSelect'
import StageSelect from '@/components/StageSelect'
import { testTypes, materialTestOrders, testResultHistory } from '@/api/quick-check-detail'

export default {
  components: { PlanSchedulesSelect, EquipSelect, ClassSelect, ProductNoSelect, StageSelect },
  data() {
    return {
      getParams: {
        day_time: dayjs().format('YYYY-MM-DD'),
        equip_no: null,
        classes: null,
        product_no: null,
        stage: null
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
      index: 1
    }
  },
  created() {
    this.getTestTypes()
    this.getMaterialTestOrders()
  },
  methods: {
    dayTimeChanged() {
      this.getMaterialTestOrders()
    },
    equipSelected(equip) {
      this.getParams.equip_no = equip ? equip.equip_no : null
      this.getMaterialTestOrders()
    },
    classSelected(className) {
      this.getParams.classes = className || null
      this.getMaterialTestOrders()
    },
    productBatchingChanged(val) {
      this.getParams.product_no = val ? val.stage_product_batch_no : null
      this.getMaterialTestOrders()
    },
    load(tree, treeNode, resolve) {
      const subRows = []
      testResultHistory(tree.id).then(testResul => {
        for (const testTime in testResul) {
          const row = JSON.parse(JSON.stringify(tree))
          row.index = this.index++
          row.hasChildren = false
          row.order_results = testResul[testTime]
          subRows.push(row)
        }
        resolve(subRows)
      })
    },
    async getMaterialTestOrders() {
      this.listLoading = true
      try {
        this.testOrders = await materialTestOrders(this.getParams)
        this.testOrders = this.testOrders.map(result => {
          return {
            ...result,
            index: this.index++,
            hasChildren: true,
            test_status: '正常',
            class_group: `${result.production_class}/${result.production_group}`
          }
        })
        this.testOrders.forEach(row => {
          row.level = 0
          row.mes_result = '未检测'
          for (const testTypeName in row.order_results) {
            const testType = row.order_results[testTypeName]
            let maxLevel = 0
            let mes_result = '未检测'
            for (const dataPointName in testType) {
              const dataPoint = testType[dataPointName]
              if (dataPoint.test_times > 1) {
                row.test_status = '复检'
              }
              if (dataPoint.level > maxLevel) {
                maxLevel = dataPoint.level
                mes_result = dataPoint.mes_result
                testType['maxLevelItem'] = dataPoint
              }
            }
            if (maxLevel > row.level) {
              row.level = maxLevel
              row.mes_result = mes_result
            }
          }
        })
      // eslint-disable-next-line no-empty
      } catch (e) {}
      this.listLoading = false
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
      // eslint-disable-next-line no-empty
      } catch (e) {}
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
      if (row.mes_result !== '合格') {
        return 'warning-row'
      }
      return ''
    }
    // planScheduleSelected(planScheduleId) {
    //   console.log(planScheduleId)
    // }
  }
}
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }
</style>
