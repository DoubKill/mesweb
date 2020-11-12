<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="生产日期">
        <el-date-picker
          v-model="getParams.day"
          value-format="yyyy-MM-dd"
          clearable
          type="date"
          placeholder="选择日期"
          @change="dayChanged"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="getParams.status"
          placeholder="请选择"
          clearable
          @change="statusChanged"
        >
          <el-option
            v-for="item in resultStatusList"
            :key="item.status"
            :label="item.status"
            :value="item.status"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      border
      fit
      style="width: 100%"
      :data="inferiorQualityList"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="生产日期" width="155" prop="production_factory_date" />
      <el-table-column label="机台" prop="product_info.production_equip_no" />
      <el-table-column label="班次" prop="product_info.production_class" />
      <el-table-column label="胶料编码" prop="product_info.product_no" />
      <el-table-column label="lot追踪号" width="90" prop="lot_no" />
      <!-- <el-table-column label="检测结果" prop="test_result" /> -->
      <el-table-column label="等级" prop="level" width="60" />
      <el-table-column label="不合格原因" width="100" prop="reason">
        <template slot-scope="{row}">
          <el-popover
            placement="top-start"
            title="不合格原因"
            width="400"
            trigger="hover"
            :content="row.reason"
          >
            <a slot="reference"> {{ row.reason.slice(0,6) }}</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" />
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="{row}">
          <el-button v-if="row.status==='待处理'" size="mini" @click="handleDispose(row)">处理</el-button>
          <el-button v-if="row.status==='待确认'" size="mini" @click="confirm(row)">确认</el-button>
          <el-button v-if="row.status==='待确认'" size="mini" @click="reject(row)">驳回</el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否出库" align="center" prop="be_warehouse_out" :formatter="(row)=>{ return row.be_warehouse_out ? 'Y' : 'N'}" />
      <el-table-column label="出库时间" width="155" prop="warehouse_out_time" align="center" />
      <el-table-column label="处理意见" align="center" width="155" prop="deal_suggestion" />
      <el-table-column label="检测结果" prop="deal_result" />
      <el-table-column label="处理人" prop="deal_user" />
      <el-table-column label="确认人" prop="confirm_user" />
    </el-table>
    <page :total="total" :current-page="getParams.page" @currentChange="currentChange" />
    <el-dialog
      title="处理不合格品"
      :visible.sync="dialogDisposeVisible"
    >
      <el-form ref="disposeForm" :model="disposeForm" :rules="rules" label-position="left" label-width="110px">
        <el-form-item label="处理意见" prop="deal_suggestion">
          <el-select v-model="disposeForm.deal_suggestion" clearable>
            <el-option-group
              v-for="group in suggestionOptions"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.id"
                :label="item.suggestion_desc"
                :value="item.suggestion_desc"
              />
            </el-option-group>
          </el-select>

        </el-form-item>
        <el-form-item label="出库">
          <el-checkbox v-model="disposeForm.be_warehouse_out" />
        </el-form-item>
        <el-form-item label="出库时间选择" prop="warehouse_out_time">
          <el-date-picker
            v-model="disposeForm.warehouse_out_time"
            clearable
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogOpinionsVisible = true">新建处理意见</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDisposeVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateDispose()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="不合格处理意见管理"
      :visible.sync="dialogOpinionsVisible"
      width="80%"
      :before-close="(done)=> { getDealSuggestions();done()}"
    >
      <unqualified-treatment-opinions />
    </el-dialog>

  </div>
</template>

<script>
import Page from '@/components/page'
import UnqualifiedTreatmentOpinions from './unqualified_treatment_opinions_manage'
import { materialDealResult, editMaterialDeal, resultStatus, dealSuggestion } from '@/api/material-deal-result'

export default {
  components: { Page, UnqualifiedTreatmentOpinions },
  data() {
    const validateWarehouseOutTime = (rule, value, callback) => {
      if (this.disposeForm.be_warehouse_out && !value) {
        callback(new Error('出库时必须选择出库时间'))
      } else {
        callback()
      }
    }
    return {
      total: 0,
      getParams: { page: 1, day: null, status: null },
      inferiorQualityList: [],
      dialogDisposeVisible: false,
      disposeForm: {
        deal_suggestion: '',
        be_warehouse_out: false,
        warehouse_out_time: null
      },
      rules: {
        deal_suggestion: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        warehouse_out_time: [
          { validator: validateWarehouseOutTime, trigger: 'change' }
        ]
      },
      resultStatusList: [
        { status: '待处理' },
        { status: '待确认' },
        { status: '已处理' }
      ],
      dialogOpinionsVisible: false,
      suggestionOptions: []
    }
  },
  created() {
    // this.getResultStatus()
    this.getMaterialDealResult()
  },
  methods: {
    getDealSuggestions() {
      this.suggestionOptions = []
      try {
        ['放行处理', '不合格处理'].forEach(async(label) => {
          const response = await dealSuggestion(label)
          this.suggestionOptions.push({
            label,
            options: response.results
          })
        })
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    async getResultStatus() {
      try {
        this.resultStatusList = await resultStatus()
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    dayChanged() {
      this.currentChange(1)
    },
    statusChanged() {
      this.currentChange(1)
    },
    currentChange(page) {
      this.getParams.page = page
      this.getMaterialDealResult()
    },
    async getMaterialDealResult() {
      try {
        const response = await materialDealResult(this.getParams)
        this.inferiorQualityList = response.results
        this.total = response.count
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    handleDispose(row) {
      this.getDealSuggestions()
      this.disposeForm = Object.assign({}, row)
      this.dialogDisposeVisible = true
      this.$nextTick(() => {
        this.$refs['disposeForm'].clearValidate()
      })
    },
    confirm(row) {
      editMaterialDeal('patch', row.id, {
        status: '已处理',
        material_no: row.product_info.product_no,
        warehouse_info: 1
      }).then(() => {
        this.currentChange(this.getParams.page)
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    reject(row) {
      editMaterialDeal('patch', row.id, {
        status: '待处理',
        material_no: row.product_info.product_no,
        warehouse_info: 1
        // deal_suggestion: '',
        // be_warehouse_out: false,
        // warehouse_out_time: null
      }).then(() => {
        this.currentChange(this.getParams.page)
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateDispose() {
      console.log(this.disposeForm, 'here')
      this.$refs['disposeForm'].validate(valid => {
        if (valid) {
          const {
            deal_suggestion,
            be_warehouse_out,
            warehouse_out_time
          } = this.disposeForm
          editMaterialDeal('patch', this.disposeForm.id, {
            deal_suggestion,
            be_warehouse_out,
            warehouse_out_time,
            status: '待确认',
            material_no: this.disposeForm.product_info.product_no,
            warehouse_info: 1
          }).then(() => {
            this.dialogDisposeVisible = false
            this.currentChange(this.getParams.page)
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
