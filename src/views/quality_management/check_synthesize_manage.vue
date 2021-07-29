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
      <el-form-item label="收皮条码">
        <el-input v-model="getParams.lot_no" clearable @input="changeSearch" />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['deal_result','all']"
          type="primary"
          @click="modifyTrainFun(false)"
        >批量修改车次</el-button>
        <el-button
          v-permission="['deal_result','only']"
          type="primary"
          @click="modifyTrainFun(true)"
        >修改特定托的车次</el-button>
      </el-form-item>
    </el-form>
    <div style="width:100%;text-align:right;margin-top:-10px">
      <el-switch
        v-model="is_showed"
        active-text="打印时显示区间"
        @change="showedChange"
      />
    </div>
    <el-button
      v-permission="['deal_result','print']"
      style="float:right;margin:10px 0;"
      @click="printingFun"
    >打印</el-button>
    <el-table
      v-loading="listLoading"
      border
      fit
      style="width: 100%"
      :data="palletFeedTestList"
      size="mini"
      highlight-current-row
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
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
        <el-table-column label="检测时间" width="80" align="center">
          <template slot-scope="{row}">
            {{ setDate(row.test.test_factory_date,true) }}
          </template>
        </el-table-column>
        <el-table-column label="检测班次" prop="test.test_class" width="45" />
        <el-table-column label="打印时间" width="80" align="center" prop="print_time" />
        <el-table-column label="检测员" prop="test.test_user" width="60" />
        <el-table-column label="检测结果" prop="test_result" width="30" />
        <el-table-column label="处理人" prop="deal_user" width="50" />
        <el-table-column label="处理意见" prop="deal_suggestion" width="40" />
        <el-table-column label="处理时间" align="center" prop="deal_time" width="80" />
      </el-table-column>
      <el-table-column label="车次" prop="trains" width="60" />
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

    <el-dialog
      :title="modifyTrain?'修改特定托的车次':'批量修改车次'"
      :visible.sync="dialogVisibleTrain"
      width="500px"
      :before-close="handleClose"
    >
      <el-form ref="ruleFormTrain" :model="ruleFormTrain" label-width="130px" :rules="rulesTrain">
        <el-form-item :key="10" label="生产日期" prop="factory_date">
          <span v-if="ruleFormTrain.id">{{ ruleFormTrain.factory_date }}</span>
          <el-date-picker
            v-else
            v-model="ruleFormTrain.factory_date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="changeProduct"
          />
        </el-form-item>
        <el-form-item :key="9" label="生产班次" prop="classes">
          <span v-if="ruleFormTrain.id">{{ ruleFormTrain.classes }}</span>
          <class-select v-else :value-default="ruleFormTrain.classes" @classSelected="classSelectedTrain" />
        </el-form-item>
        <el-form-item :key="8" label="生产机台" prop="equip_no">
          <span v-if="ruleFormTrain.id">{{ ruleFormTrain.equip_no }}</span>
          <equip-select
            v-else
            :equip_no_props.sync="ruleFormTrain.equip_no"
            @changeSearch="changeProduct"
          />
        </el-form-item>
        <el-form-item :key="7" label="胶料规格" prop="product_no">
          <span v-if="ruleFormTrain.id">{{ ruleFormTrain.product_no }}</span>
          <all-product-no-select v-else :params-obj="ruleFormTrain" :default-val="ruleFormTrain.product_no" @productBatchingChanged="productBatchingTrain" />
        </el-form-item>
        <el-form-item v-if="!modifyTrain" :key="1" label="开始车次" prop="begin_trains">
          <el-input-number v-model="ruleFormTrain.begin_trains" :max="ruleFormTrain.end_trains" controls-position="right" :step="1" step-strictly />
        </el-form-item>
        <el-form-item v-if="!modifyTrain" :key="2" label="结束车次" prop="end_trains">
          <el-input-number v-model="ruleFormTrain.end_trains" :min="ruleFormTrain.begin_trains" controls-position="right" :step="1" step-strictly />
        </el-form-item>
        <el-form-item v-if="!modifyTrain" :key="3" label="修改车次" prop="fix_num">
          <el-input-number v-model="ruleFormTrain.fix_num" :disabled="true" controls-position="right" :min="-5" :max="5" :step="1" step-strictly />
          <el-button style="margin-left:5px" type="primary" circle @click="ruleFormTrain.fix_num++">+1</el-button>
          <el-button type="primary" circle @click="ruleFormTrain.fix_num--">-1</el-button>
        </el-form-item>
        <el-form-item v-if="modifyTrain" :key="4" label="收皮条码" prop="lot_no">
          <!-- <el-input v-model="ruleFormTrain.lot_no" @input="debounceLotNo" /> -->
          {{ ruleFormTrain.lot_no }}
        </el-form-item>
        <el-form-item v-if="modifyTrain" :key="5" label="现有车次" prop="">
          {{ ruleFormTrain.trains }}
          <!-- <el-input v-model="ruleFormTrain.trains" /> -->
        </el-form-item>
        <el-form-item v-if="modifyTrain" :key="6" label="修改车次" prop="begin_trains">
          <!-- <el-input v-model="ruleFormTrain.ggg" />  例：17-18-19 -->
          <el-input-number v-model="ruleFormTrain.begin_trains" style="width:100px" :max="ruleFormTrain.end_trains" :min="ruleFormTrain.end_trains-5" controls-position="right" :step="1" step-strictly /> —
          <el-input-number v-model="ruleFormTrain.end_trains" style="width:100px" :min="ruleFormTrain.begin_trains" :max="ruleFormTrain.begin_trains+5" controls-position="right" :step="1" step-strictly />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitTrain">确 定</el-button>
      </span>
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
import { labelPrint, showQualifiedRange, trainsFix } from '@/api/base_w'
import { debounce, setDate } from '@/utils'
export default {
  name: 'CheckSynthesizeManage',
  components: { EquipSelect, ClassSelect, allProductNoSelect, Page, TestCard, DealSuggestionSelect },
  data() {
    const validator = (rule, value, callback, _value, str) => {
      if (!_value) {
        callback(new Error(str))
      } else {
        callback()
      }
    }
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
      labelPrintList: [],
      is_showed: false,
      modifyTrain: false,
      dialogVisibleTrain: false,
      ruleFormTrain: {
        fix_num: -1,
        factory_date: '',
        equip_no: '',
        lot_no: ''
      },
      rulesTrain: {
        factory_date: [{ required: true, message: '请选择生产日期', trigger: 'change' }],
        classes: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          validator(rule, value, callback,
            this.ruleFormTrain.classes, '请选择生产班次')
        } }],
        equip_no: [{ required: true, message: '请选择生产机台', trigger: 'change' }],
        product_no: [{ required: true, message: '请选择生产机台', trigger: 'change', validator: (rule, value, callback) => {
          validator(rule, value, callback,
            this.ruleFormTrain.product_no, '请选择胶料规格')
        } }],
        begin_trains: [{ required: true, trigger: 'blur', validator: (rule, value, callback) => {
          if (this.ruleFormTrain.id) {
            if (!this.ruleFormTrain.begin_trains || !this.ruleFormTrain.end_trains) {
              callback(new Error('请填写'))
            } else {
              callback()
            }
          } else {
            if (!this.ruleFormTrain.begin_trains) {
              callback(new Error('请填写开始车次'))
            } else {
              callback()
            }
          }
        } }],
        end_trains: [{ required: true, message: '请填写结束车次', trigger: 'blur' }],
        lot_no: [{ required: true, message: '请填写收皮条码', trigger: 'blur' }],
        trains: [{ required: true, message: '请填写现有车次', trigger: 'blur' }]
      },
      valCurrent: {},
      btnLoading: false
    }
  },
  created() {
    this.getPalletFeedTest()
    this.getShowed()
  },
  methods: {
    setDate,
    changeSearch() {
      this.getParams.page = 1
      debounce(this, 'getPalletFeedTest')
    },
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
    handleCurrentChange(val) {
      this.valCurrent = val
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
    },
    async getShowed() {
      try {
        const data = await showQualifiedRange('get')
        this.is_showed = data.is_showed
      } catch (e) {
        //
      }
    },
    async showedChange() {
      try {
        await showQualifiedRange('post', null, { data: { is_showed: this.is_showed }})
      } catch (e) {
        //
      }
    },
    modifyTrainFun(bool) {
      if (bool) {
        this.ruleFormTrain = {
          id: this.valCurrent.id,
          factory_date: this.valCurrent.day_time,
          classes: this.valCurrent.classes_group ? this.valCurrent.classes_group.split('/')[0] : '',
          equip_no: this.valCurrent.equip_no,
          product_no: this.valCurrent.product_no,
          trains: this.valCurrent.trains,
          lot_no: this.valCurrent.lot_no,
          fix_num: -1
        }
        if (!this.ruleFormTrain.id) {
          this.$message.info('请单击选中列表某一行')
          return
        }
      }
      this.modifyTrain = bool
      this.dialogVisibleTrain = true
      this.$nextTick(() => {
        this.$refs.ruleFormTrain.clearValidate()
      })
    },
    handleClose(done) {
      this.dialogVisibleTrain = false
      this.ruleFormTrain = {}
      this.$set(this.ruleFormTrain, 'product_no', '')
      this.$set(this.ruleFormTrain, 'classes', '')
      this.$set(this.ruleFormTrain, 'fix_num', -1)
      this.$set(this.ruleFormTrain, 'id', '')
      // this.$set(this.ruleFormTrain, 'end_trains', '')
      this.$nextTick(() => {
        this.$refs.ruleFormTrain.clearValidate()
      })
      if (done) {
        done()
      }
    },
    classSelectedTrain(val) {
      this.changeProduct()
      this.$set(this.ruleFormTrain, 'classes', val)
    },
    productBatchingTrain(val) {
      this.ruleFormTrain.product_no = val ? val.material_no : ''
    },
    async changeProduct() {
      if (!this.modifyTrain) {
        this.$set(this.ruleFormTrain, 'product_no', null)
      }
    },
    submitTrain() {
      const a = this.ruleFormTrain.begin_trains + ',' + this.ruleFormTrain.end_trains
      if (this.ruleFormTrain.trains === a) {
        this.$message.info('修改车次和现有车次相同')
        return
      }
      if (!this.ruleFormTrain.fix_num) {
        this.$message.info('修改车次不能为0')
        return
      }
      this.$refs.ruleFormTrain.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            await trainsFix('post', null, { data: this.ruleFormTrain })
            this.$message.success('修改成功')
            this.handleClose(false)
            this.getPalletFeedTest()
            this.btnLoading = false
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-input {
    width: auto;
  }
</style>
