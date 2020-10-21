<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="dayTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="倒班规则">
        <plan-schedules-select :day-time="dayTime" @planScheduleSelected="planScheduleSelected" />
      </el-form-item>
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
      :data="testData"
      border
      fit
      style="width: 100%"
    >
      <el-table-column type="index" label="No" />
      <el-table-column label="生产信息" align="center">
        <el-table-column label="生产计划号" prop="plan_classes_uid" />
        <el-table-column label="收皮条码" />
        <el-table-column label="生产班次/班组" />
        <el-table-column label="生产机台" />
        <el-table-column label="胶料编码" />
        <el-table-column label="车次" />
        <el-table-column label="检测状态" />
      </el-table-column>
      <el-table-column v-for="header in filterData.filter(data => data.show)" :key="header.method" align="center" :label="header.method">
        <el-table-column v-for="subHeader in header.testItems.filter(item => item.show)" :key="header.method + subHeader.name" :label="subHeader.name">
          <template slot-scope="scope">
            {{ scope.row[header.method][subHeader.name] }}
          </template>
        </el-table-column>
        <el-table-column label="等级" />
        <el-table-column label="处理意见" />
      </el-table-column>
      <el-table-column label="综合等级" />
      <el-table-column label="综合处理意见" />
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button size="mini" @click="showCard(scope.row)">显示条码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="选择过滤"
      :visible.sync="filterDialogVisible"
    >
      <el-table
        border
        :data="filterData"
      >
        <el-table-column label="选择">
          <template slot-scope="{row}">
            <el-checkbox v-model="row.show" />
          </template>
        </el-table-column>
        <el-table-column label="实验方法">
          <template slot-scope="{row}">
            <span>{{ row.method }}</span>
          </template>
        </el-table-column>
        <el-table-column label="检测项">
          <template slot-scope="{row}">
            <template v-for="item in row.testItems">
              <el-checkbox :key="item.name" v-model="item.show">{{ item.name }}</el-checkbox>
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
      :visible.sync="testCardDialogVisible"
    >
      <test-card />
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import PlanSchedulesSelect from '@/components/PlanSchedulesSelect'
import EquipSelect from '@/components/EquipSelect'
import ClassSelect from '@/components/ClassSelect'
import ProductNoSelect from '@/components/ProductNoSelect'
import TestCard from '@/components/TestCard'

export default {
  components: { PlanSchedulesSelect, EquipSelect, ClassSelect, ProductNoSelect, TestCard },
  data() {
    return {
      dayTime: dayjs().format('YYYY-MM-DD'),
      filterDialogVisible: false,
      testCardDialogVisible: false,
      filterData: [
        {
          method: '比重',
          show: true,
          testItems: [{ name: '比重值', show: false }]
        },
        {
          method: '流变',
          show: false,
          testItems: [{ name: 'ML', show: false }, { name: 'T10', show: true }]
        }
      ],
      testData: [
        {
          plan_classes_uid: 1,
          '流变': {
            'ML': 'mltest',
            'T10': 'T10test'
          },
          '比重': {
            '比重值': '比重值test'
          }
        },
        {
          plan_classes_uid: 2,
          '流变': {
            'ML': 'mltest2',
            'T10': 'T10test2'
          },
          '比重': {
            '比重值': '比重值test2'
          }
        }
      ]
    }
  },
  methods: {
    showCard(row) {
      this.testCardDialogVisible = true
      console.log(row)
    },
    planScheduleSelected(planScheduleId) {
      console.log(planScheduleId)
    },
    equipSelected(equip) {
      console.log(equip)
    },
    classSelected(className) {
      console.log(className)
    },
    productBatchingChanged(val) {
      console.log(val)
    }
  }
}
</script>

<style>

</style>
