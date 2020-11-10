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
      <el-form-item label="综合处理意见">
        <!-- <el-select /> -->
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
    >
      <el-table-column type="index" label="No" />
      <el-table-column label="生产信息" align="center">
        <el-table-column label="生产计划号" width="95" prop="plan_classes_uid" />
        <el-table-column label="收皮条码" prop="lot_no" />
        <el-table-column label="生产班次/班组" width="110" prop="class_group" />
        <el-table-column label="生产机台" prop="production_equip_no" />
        <el-table-column label="胶料编码" align="center" width="150" prop="product_no" />
        <el-table-column label="车次" width="50" align="center" prop="actual_trains" />
        <el-table-column label="检测状态" prop="test_status" />
      </el-table-column>
      <el-table-column v-for="header in testTypeList.filter(type => type.show)" :key="header.test_type_name" align="center" :label="header.test_type_name">
        <el-table-column v-for="subHeader in header.data_indicator_detail.filter(item => item.show)" :key="header.test_type_name + subHeader.detail" width="110" :label="subHeader.detail" align="center">
          <template v-if="scope.row.test_indicator_list_[header.test_type_name][subHeader.detail][0]" slot-scope="scope">
            <el-popover
              placement="top-start"
              trigger="hover"
            >
              <el-table border :data="scope.row.test_indicator_list_[header.test_type_name][subHeader.detail][1]">
                <el-table-column label="检测次数" prop="test_times" />
                <el-table-column label="检测值" prop="value" />
                <el-table-column label="试验方法名称" prop="test_method_name" />
                <el-table-column label="等级" prop="level" />
                <el-table-column label="结果" prop="mes_result" />
              </el-table>
              <el-button slot="reference">{{
                scope.row.test_indicator_list_[header.test_type_name][subHeader.detail][0].value
              }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="等级" align="center">
          <template slot-scope="{row}">
            {{ row.test_indicator_list_[header.test_type_name].maxLevel }}
          </template>
        </el-table-column>
        <el-table-column label="检测结果" align="center">
          <template slot-scope="{row}">
            {{ row.test_indicator_list_[header.test_type_name].mes_result }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="综合等级" prop="maxLevel" />
      <el-table-column label="综合检测结果" width="110" prop="mes_result" />
      <!-- <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button size="mini" @click="showCard(scope.row)">显示条码</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <page :total="total" :current-page="getParams.page" @currentChange="currentChange" />
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
import Page from '@/components/page'
import PlanSchedulesSelect from '@/components/PlanSchedulesSelect'
import EquipSelect from '@/components/EquipSelect'
import ClassSelect from '@/components/ClassSelect'
import ProductNoSelect from '@/components/ProductNoSelect'
import TestCard from '@/components/TestCard'
import { testTypes, materialTestOrders } from '@/api/quick-check-detail'

export default {
  components: { PlanSchedulesSelect, EquipSelect, ClassSelect, ProductNoSelect, TestCard, Page },
  data() {
    return {
      total: 0,
      getParams: {
        page: 1,
        day_time: dayjs().format('YYYY-MM-DD'),
        equip_no: null,
        classes: null,
        product_no: null
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
      ]
    }
  },
  created() {
    this.getTestTypes()
    this.getMaterialTestOrders()
  },
  methods: {
    dayTimeChanged() {
      this.getMaterialTestOrdersPage1()
    },
    equipSelected(equip) {
      this.getParams.equip_no = equip ? equip.equip_no : null
      this.getMaterialTestOrdersPage1()
    },
    classSelected(className) {
      this.getParams.classes = className || null
      this.getMaterialTestOrdersPage1()
    },
    productBatchingChanged(val) {
      this.getParams.product_no = val ? val.stage_product_batch_no : null
      this.getMaterialTestOrdersPage1()
    },
    getMaterialTestOrdersPage1() {
      this.getParams.page = 1
      this.getMaterialTestOrders()
    },
    matchedTestData(row, header, subHeader) {
      let maxTestTimesCheck = null
      const subCheckGroup = row.order_results.filter(result => {
        return result.test_indicator_name === header.test_type_name
      }).filter(subItem => {
        return subItem.data_point_name === subHeader.detail
      })
      if (subCheckGroup.length > 0) {
        maxTestTimesCheck =
          subCheckGroup.reduce((acc, cur) => {
            if (acc.test_times > cur.test_times) {
              return acc
            } else {
              return cur
            }
          }, [])
        subCheckGroup.sort(function(l, r) {
          r.test_times - l.test_times
        })
      }
      const data = [maxTestTimesCheck, subCheckGroup]
      return data
    },
    currentChange(page) {
      this.getParams.page = page
      this.getMaterialTestOrders()
    },
    async getMaterialTestOrders() {
      this.listLoading = true
      try {
        this.testOrders = []
        const response = await materialTestOrders(this.getParams)
        this.total = response.count
        this.testOrders = response.results.map(result => {
          return {
            ...result,
            class_group: `${result.production_class}/${result.production_group}`
          }
        })
        this.testOrders.forEach(row => {
          row.maxLevel = 0
          row.mes_result = '未检测'
          row.test_indicator_list_ = {}
          this.testTypeList.forEach(header => {
            row.test_indicator_list_[header.test_type_name] = {}
            let maxLevel = 0
            let mes_result = '未检测'
            header.data_indicator_detail.forEach(subHeader => {
              const matchedTestData = this.matchedTestData(row, header, subHeader)
              row.test_indicator_list_[header.test_type_name][subHeader.detail] = matchedTestData
              if (matchedTestData[0] && matchedTestData[0].level > maxLevel) {
                maxLevel = matchedTestData[0].level
              }
              if (matchedTestData[0] && matchedTestData[0].mes_result === '合格') {
                if (mes_result === '未检测') {
                  mes_result = '合格' // 覆盖默认值
                }
              }
              if (matchedTestData[0] && matchedTestData[0].mes_result === '不合格') {
                mes_result = '不合格'
              }
            })
            row.test_indicator_list_[header.test_type_name]['maxLevel'] = maxLevel
            row.test_indicator_list_[header.test_type_name]['mes_result'] = mes_result
            if (maxLevel > row.maxLevel) {
              row.maxLevel = maxLevel
            }
            if (mes_result === '合格' && row.mes_result === '未检测') {
              row.mes_result = '合格' // 覆盖默认值
            }
            if (mes_result === '不合格') {
              row.mes_result = '不合格'
            }
          })
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
    }
    // planScheduleSelected(planScheduleId) {
    //   console.log(planScheduleId)
    // }
  }
}
</script>

<style>

</style>
