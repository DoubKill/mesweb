<template>
  <!-- 快检信息综合管理 -->
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
      <el-form-item label="机台">
        <equip-select
          :equip_no_props.sync="getParams.equip_no"
          @changeSearch="equipSelected"
        />
      </el-form-item>
      <el-form-item label="班次">
        <class-select @classSelected="classSelected" />
      </el-form-item>
      <el-form-item label="胶料">
        <all-product-no-select @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
      <el-form-item label="处理意见">
        <deal-suggestion-select @dealSuggestionChange="dealSuggestionChange" />
      </el-form-item>
      <el-form-item label="打印状态">
        <el-select
          v-model="getParams.is_print"
          clearable
          placeholder="请选择"
          @change="dayTimeChanged"
        >
          <el-option
            v-for="item in ['已打印','未打印']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button
      v-permission="['deal_result','print']"
      style="float:right;margin-bottom:10px;"
      @click="printingFun"
    >打印</el-button>
    <el-table
      v-loading="listLoading"
      border
      fit
      style="width: 100%"
      :data="palletFeedTestList"
      size="mini"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="30"
      />
      <el-table-column type="index" label="No" width="30" />
      <el-table-column align="center" label="生产信息">
        <el-table-column label="工厂日期" prop="day_time" width="80" />
        <el-table-column label="收皮条码" prop="lot_no" />
        <el-table-column label="生产班次/班组" width="60" align="center" prop="classes_group" />
        <el-table-column label="生产机台" prop="equip_no" width="40" />
        <el-table-column label="胶料编码" prop="product_no" />
        <el-table-column label="收皮重量" prop="actual_weight" width="40" />
        <el-table-column label="余量" prop="residual_weight" align="center" width="40" />
        <el-table-column label="生产时间" width="80" align="center" prop="production_factory_date" />
        <el-table-column label="有效时间" width="80" align="center" prop="valid_time" />
      </el-table-column>
      <el-table-column label="质量信息" align="center">
        <el-table-column label="检测状态" align="center" prop="test.test_status" width="45" />
        <el-table-column label="检测时间" width="80" align="center" prop="test.test_factory_date" />
        <el-table-column label="检测班次" prop="test.test_class" width="45" />
        <el-table-column label="打印时间" width="80" align="center" prop="print_time" />
        <el-table-column label="检测员" prop="test.test_user" width="60" />
        <el-table-column label="检测结果" prop="deal_result" width="30" />
        <el-table-column label="处理人" prop="deal_user" width="50" />
        <el-table-column label="处理意见" prop="deal_suggestion" width="40" />
        <el-table-column label="处理时间" align="center" prop="deal_time" width="80" />
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="{row}">
          <!-- <el-button size="mini" @click="handleEdit(row)">编辑</el-button> -->
          <el-button size="mini" @click="print(row)">查看质量卡片</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
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
import EquipSelect from '@/components/select_w/equip'
import ClassSelect from '@/components/ClassSelect'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import DealSuggestionSelect from '@/components/DealSuggestionSelect'
import TestCard from '@/components/TestCard'
import { palletFeedTest, changelValidTime, qualityPalletFeedTest } from '@/api/quick-check-detail'
import { labelPrint } from '@/api/base_w'
export default {
  components: { EquipSelect, ClassSelect, allProductNoSelect, Page, TestCard, DealSuggestionSelect },
  data() {
    return {
      total: 0,
      getParams: {
        page: 1,
        page_size: 10,
        day_time: dayjs().format('YYYY-MM-DD'),
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
      testCardDialogVisible: false,
      labelPrintList: []
    }
  },
  created() {
    this.getPalletFeedTest()
  },
  methods: {
    async getCardInfo(id) {
      try {
        const data = await qualityPalletFeedTest(id)
        this.$nextTick(() => {
          this.$refs['testCard'].setTestData(data)
        })
      } catch (e) {
        //
      }
    },
    print(row) {
      this.getCardInfo(row.id)
      this.testCardDialogVisible = true
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
    currentChange(page, page_size) {
      this.getParams.page = page
      this.getParams.page_size = page_size || this.getParams.page_size
      this.getPalletFeedTest()
    },
    async getPalletFeedTest() {
      this.listLoading = true
      this.palletFeedTestList = []
      try {
        const response = await palletFeedTest(this.getParams)
        this.total = response.count
        this.palletFeedTestList = response.results
      } catch (e) {
        //
      }
      this.listLoading = false
    },
    dayTimeChanged() {
      this.currentChange(1)
    },
    dealSuggestionChange(desc) {
      this.getParams.suggestion_desc = desc || null
      this.currentChange(1)
    },
    equipSelected() {
      this.currentChange(1)
    },
    classSelected(className) {
      this.getParams.classes = className || null
      this.currentChange(1)
    },
    productBatchingChanged(val) {
      this.getParams.product_no = val ? val.material_no : null
      this.currentChange(1)
    },
    handleSelectionChange(arr) {
      this.labelPrintList = arr
    },
    async printingFun() {
      try {
        if (this.labelPrintList.length === 0) return
        const arr = []
        this.labelPrintList.forEach(D => {
          arr.push(D.lot_no)
        })
        await labelPrint('post', null, { data: { lot_no: arr }})
        this.$message.success('打印任务已连接')
      } catch (e) {
        //
      }
    }
  }
}
</script>
