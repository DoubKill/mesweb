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
      <el-form-item label="处理意见">
        <deal-suggestion-select @dealSuggestionChange="dealSuggestionChange" />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      border
      fit
      style="width: 100%"
      :data="palletFeedTestList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column
        type="selection"
        width="55"
      /> -->
      <el-table-column type="index" label="No" />
      <el-table-column align="center" label="生产信息">
        <el-table-column label="工厂日期" prop="day_time" />
        <el-table-column label="收皮条码" prop="lot_no" />
        <el-table-column label="生产班次/班组" width="110" align="center" prop="classes_group" />
        <el-table-column label="生产机台" prop="equip_no" />
        <el-table-column label="胶料编码" prop="product_no" />
        <el-table-column label="收皮重量" prop="actual_weight" />
        <el-table-column label="余量" prop="residual_weight" align="center" />
        <el-table-column label="生产时间" width="160" align="center" prop="production_factory_date" />
        <el-table-column label="有效时间" width="90" align="center" prop="valid_time" />
      </el-table-column>
      <el-table-column label="质量信息" align="center">
        <el-table-column label="检测状态" align="center" prop="test.test_status" />
        <el-table-column label="检测时间" width="160" align="center" prop="test.test_factory_date" />
        <el-table-column label="检测班次" prop="test.test_class" />
        <el-table-column label="打印时间" width="160" align="center" prop="print_time" />
        <el-table-column label="检测员" prop="test.test_user" />
        <el-table-column label="检测结果" prop="deal_result" />
        <!-- <el-table-column label="备注" prop="test.test_note" /> -->
        <el-table-column label="处理人" prop="deal_user" />
        <el-table-column label="处理意见" prop="deal_suggestion" />
        <el-table-column label="处理时间" width="160" align="center" prop="deal_time" />
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="{row}">
          <!-- <el-button size="mini" @click="handleEdit(row)">编辑</el-button> -->
          <el-button size="mini" @click="print(row)">查看质量卡片</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page :total="total" :current-page="getParams.page" @currentChange="currentChange" />
    <el-dialog
      title="修改有效时间"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="dataForm" :model="formData" :rules="rules" label-position="left" label-width="110px">
        <el-form-item label="有效时间" prop="valid_time">
          <el-input-number v-model.number="formData.valid_time" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :fullscreen="true"
      :visible.sync="testCardDialogVisible"
    >
      <test-card ref="testCard" />
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import Page from '@/components/page'
// import PlanSchedulesSelect from '@/components/PlanSchedulesSelect'
import EquipSelect from '@/components/EquipSelect'
import ClassSelect from '@/components/ClassSelect'
import ProductNoSelect from '@/components/ProductNoSelect'
import DealSuggestionSelect from '@/components/DealSuggestionSelect'
import TestCard from '@/components/TestCard'
import { palletFeedTest, changelValidTime } from '@/api/quick-check-detail'

export default {
  components: { EquipSelect, ClassSelect, ProductNoSelect, Page, TestCard, DealSuggestionSelect },
  data() {
    return {
      total: 0,
      getParams: {
        page: 1,
        day_time: dayjs().format('YYYY-MM-DD'),
        // day_time: null,
        equip_no: null,
        classes: null,
        product_no: null,
        suggestion_desc: null
      },
      palletFeedTestList: [],
      listLoading: false,
      dialogFormVisible: false,
      formData: {
        valid_time: null
      },
      rules: {
        valid_time: [{ required: true, message: '该字段不能为空', trigger: 'blur' }]
      },
      testCardDialogVisible: false
    }
  },
  created() {
    this.getPalletFeedTest()
  },
  methods: {
    print(row) {
      this.testCardDialogVisible = true
      this.$nextTick(() => {
        this.$refs['testCard'].setTestData(row)
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          changelValidTime(this.formData.id, this.formData.valid_time).then(() => {
            this.dialogFormVisible = false
            this.currentChange(1)
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleEdit(row) {
      this.formData.valid_time = row.valid_time
      this.formData.id = row.id
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    currentChange(page) {
      this.getParams.page = page
      this.getPalletFeedTest()
    },
    async getPalletFeedTest() {
      this.listLoading = true
      this.palletFeedTestList = []
      try {
        const response = await palletFeedTest(this.getParams)
        this.total = response.count
        this.palletFeedTestList = response.results
        // console.log(response, 'response')
      // eslint-disable-next-line no-empty
      } catch (e) {}
      this.listLoading = false
    },
    dayTimeChanged() {
      this.currentChange(1)
    },
    // planScheduleSelected(val) {

    // },
    dealSuggestionChange(desc) {
      this.getParams.suggestion_desc = desc || null
      this.currentChange(1)
    },
    equipSelected(equip) {
      this.getParams.equip_no = equip ? equip.equip_no : null
      this.currentChange(1)
    },
    classSelected(className) {
      this.getParams.classes = className || null
      this.currentChange(1)
    },
    productBatchingChanged(val) {
      this.getParams.product_no = val ? val.stage_product_batch_no : null
      this.currentChange(1)
    },
    handleSelectionChange() {

    }
  }
}
</script>
