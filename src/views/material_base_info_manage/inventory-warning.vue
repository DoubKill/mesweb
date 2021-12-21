<template>
  <div>
    <!-- 原材料-预警参数设定 -->
    <el-form :inline="true">
      <!-- <el-form-item label="原材料类别">
        <MaterialTypeSelect
          v-model="getParams.material_type_id"
          :is-material="true"
          @change="changeList"
        />
      </el-form-item> -->
      <el-form-item label="原材料名称">
        <el-input
          v-model="getParams.material_name"
          clearable
          @input="getParam"
        />
      </el-form-item>
      <el-form-item label="原材料编码">
        <el-input
          v-model="getParams.material_no"
          clearable
          @input="getParam"
        />
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="getParams.unset_flag_" @change="changeFlag">只显示未设定参数的物料</el-checkbox>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button v-permission="['material_warning_setting', 'set']" type="primary" @click="averageDailyDosage(false)">日均用量设定</el-button>
        <el-button v-permission="['material_warning_setting', 'set']" type="primary" @click="averageDailyDosage(true)">预警天数设定</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        :reserve-selection="true"
      />
      <el-table-column
        prop="material_no"
        label="原材料编码"
        min-width="20"
      />
      <el-table-column
        prop="material_name"
        label="原材料名称"
        min-width="20"
      />
      <!-- <el-table-column
        prop=""
        label="原材料简称"
        min-width="20"
      />
      <el-table-column
        prop=""
        label="原材料类别"
        min-width="20"
      /> -->
      <el-table-column
        prop="unit"
        label="包装单位"
        min-width="10"
      />
      <el-table-column
        prop="avg_consuming_weight"
        label="日均用量计算值(kg)"
        min-width="15"
      />
      <el-table-column
        prop="avg_setting_weight"
        label="日均用量设定值(kg)"
        min-width="15"
      />
      <el-table-column
        prop="warning_days"
        label="预警天数"
        min-width="10"
      />
      <el-table-column
        prop="warning_weight"
        label="预警重量(kg)"
        min-width="15"
      />
      <el-table-column
        prop="created_username"
        label="设定人员"
        min-width="10"
      />
      <el-table-column
        prop="created_time"
        label="设定时间"
        min-width="20"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`原材料 ${isAlertDays?'低库存预警天数设定':'日均用量设定'}`"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-radio v-if="!isAlertDays" v-model="formData.radio" label="1">使用计算值</el-radio>
      <el-radio v-if="!isAlertDays" v-model="formData.radio" label="2">使用设定值</el-radio>
      <div style="margin:20px 0" />
      <label v-if="!isAlertDays">日均用量（kg）</label>
      <el-input-number
        v-if="!isAlertDays"
        v-model="formData.num"
        controls-position="right"
        :min="1"
        :max="9999"
      />
      <label v-if="isAlertDays" style="margin-right:10px">预警天数</label>
      <el-input-number
        v-if="isAlertDays"
        v-model="formData.warning_days"
        controls-position="right"
        :min="1"
        :max="9999"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import MaterialTypeSelect from '@/components/MaterialTypeSelect'
import { wmsSafetySettings } from '@/api/base_w_five'
import page from '@/components/page'
export default {
  name: 'MaterialBaseInventoryWarning',
  components: { page },
  data() {
    return {
      getParams: {},
      tableData: [],
      multipleSelection: [],
      dialogVisible: false,
      btnLoading: false,
      isAlertDays: false,
      formData: {
        radio: '1',
        num: 1,
        warning_days: 1
      },
      loading: false,
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const response = await wmsSafetySettings('get', null, { params: this.getParams })
        this.tableData = response.results || []
        this.total = response.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getList()
    },
    changeFlag() {
      this.getParams.page = 1
      this.getParams.unset_flag = this.getParams.unset_flag_ ? 1 : ''
      this.getList()
    },
    changeList() {
      this.getParams.page = 1
      this.getList()
    },
    getParam() {
      this.getParams.page = 1
      this.$debounce(this, 'getList')
    },
    averageDailyDosage(bool) {
      this.isAlertDays = bool
      this.dialogVisible = true
    },
    handleSelectionChange(arr) {
      this.multipleSelection = arr
    },
    handleClose(done) {
      this.formData = {
        radio: '1',
        num: 1,
        warning_days: 1
      }
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    async submitFun() {
      try {
        if (!this.multipleSelection.length) {
          this.$message.info('请选择原材料')
          return
        }
        if (!this.formData.num) {
          this.$message.info('请输入日均用量')
          return
        }
        if (!this.formData.warning_days) {
          this.$message.info('请输入预警天数')
          return
        }
        const _arr = []
        this.multipleSelection.forEach(D => {
          _arr.push(D.material_no)
        })
        let _obj = { 'material_nos': _arr, 'warning_days': this.formData.warning_days }
        if (!this.isAlertDays) {
          if (this.formData.radio === '1') {
            _obj = { 'material_nos': _arr, 'avg_consuming_weight': this.formData.num }
          } else if (this.formData.radio === '2') {
            _obj = { 'material_nos': _arr, avg_setting_weight: this.formData.num }
          }
        }
        this.btnLoading = true
        await wmsSafetySettings('post', null, { data: _obj })
        this.$message.success('修改成功')
        this.getList()
        this.handleClose(false)
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection()
        }
      } catch (e) {
        //
      }
      this.btnLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
