<template>
  <div>
    <!-- 原材料-预警参数设定 -->
    <el-form :inline="true">
      <el-form-item label="原材料类别">
        <MaterialTypeSelect
          v-model="getParams.material_type_id"
          :is-material="true"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="原材料名称">
        <el-input
          v-model="getParams.material_name"
          @input="getParam"
        />
      </el-form-item>
      <el-form-item label="原材料编码">
        <el-input
          v-model="getParams.material_no"
          @input="getParam"
        />
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" @click="averageDailyDosage(false)">日均用量设定</el-button>
        <el-button type="primary" @click="averageDailyDosage(true)">预警天数设定</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      border
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
      />
      <el-table-column
        prop=""
        label="原材料编码"
        min-width="20"
      />
      <el-table-column
        prop=""
        label="原材料名称"
        min-width="20"
      />
      <el-table-column
        prop=""
        label="原材料简称"
        min-width="20"
      />
      <el-table-column
        prop=""
        label="原材料类别"
        min-width="20"
      />
      <el-table-column
        prop=""
        label="包装单位"
        min-width="20"
      />
      <el-table-column
        prop=""
        label="日均用量计算值(吨)"
        min-width="20"
      />
      <el-table-column
        prop=""
        label="日均用量设定值(吨)"
        min-width="20"
      />
      <el-table-column
        prop=""
        label="预警天数"
        min-width="20"
      />
      <el-table-column
        prop=""
        label="预警重量(吨)"
        min-width="20"
      />
      <el-table-column
        prop=""
        label="设定人员"
        min-width="20"
      />
      <el-table-column
        prop=""
        label="设定时间"
        min-width="20"
      />
    </el-table>
    <el-dialog
      :title="`原材料 ${isAlertDays?'低库存预警天数设定':'日均用量设定'}`"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-radio v-if="!isAlertDays" v-model="formData.radio" label="1">使用计算值</el-radio>
      <el-radio v-if="!isAlertDays" v-model="formData.radio" label="2">使用设定值</el-radio>
      <div style="margin:20px 0" />
      <label v-if="!isAlertDays">日均用量（吨）</label>
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
        v-model="formData.num"
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
import MaterialTypeSelect from '@/components/MaterialTypeSelect'
export default {
  name: 'MaterialBaseInventoryWarning',
  components: { MaterialTypeSelect },
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
        num: 1
      }
    }
  },
  methods: {
    getList() {
      try {
        // let response = materialsUrl('get', null, { params: this.getParams })
        // this.total = response.count
        // this.tableData = response.results || []
        // this.loading = false
      } catch (e) {
        // this.loading = false
      }
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
        num: 1
      }
      if (done) {
        done()
      }
    },
    submitFun() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
