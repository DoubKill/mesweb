<template>
  <div class="material-menni-equip">
    <!-- 原材料门尼设备管理 -->
    <el-form :inline="true">
      <el-form-item label="设备编号">
        <el-input v-model="search.no" clearable @input="debounceChange" />
      </el-form-item>
      <el-form-item label="检测类型">
        <testTypeSelect @typeSelect="typeSelect" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-permission="['material_report_equip','add']"
          type="primary"
          @click="addFun"
        >添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="no"
        label="设备编号"
        min-width="20"
      />
      <el-table-column
        prop="ip"
        label="Ip"
        min-width="20"
      />
      <el-table-column
        prop="type_name"
        label="检测类型"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="创建时间"
        min-width="20"
      />
      <el-table-column
        prop="last_updated_date"
        label="更新时间"
        min-width="20"
      />
      <el-table-column
        label="操作"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-button
            v-permission="['material_report_equip','change']"
            size="mini"
            @click="editFun(row)"
          >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      v-if="!loading"
      :total="total"
      :old-page="false"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="(formObj.id?'编辑':'添加')+'门尼设备'"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        ref="formObj"
        :rules="rulesFormData"
        :model="formObj"
        label-width="100px"
      >
        <el-form-item label="设备编号" prop="no">
          <el-input v-model="formObj.no" />
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="formObj.ip" />
        </el-form-item>
        <el-form-item label="检测类型" prop="type">
          <testTypeSelect :is-created="true" :default-val="formObj.type" @typeSelect="typeSelectForm" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import testTypeSelect from './components/test-type-select'
import { materialReportEquip } from '@/api/base_w_four'
import page from '@/components/page'
export default {
  name: 'MenniEquip',
  components: { testTypeSelect, page },
  data() {
    return {
      search: {},
      tableData: [],
      total: 0,
      loading: false,
      dialogVisible: false,
      formObj: {},
      rulesFormData: {
        no: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请输入IP', trigger: 'blur' }
        ],
        type: [{ required: true, message: '不能为空',
          validator: (rule, value, callback) => {
            if (!this.formObj.type && !value) {
              callback(new Error('请选择检测类型'))
            } else {
              callback()
            }
          }, trigger: 'change' }]
      },
      loadingBtn: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await materialReportEquip('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) { this.loading = false }
    },
    debounceChange() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    typeSelect(val) {
      this.search.page = 1
      this.search.type = val ? val.id : null
      this.getList()
    },
    editFun(row) {
      this.dialogVisible = true
      this.formObj = JSON.parse(JSON.stringify(row))
    },
    addFun() {
      this.dialogVisible = true
    },
    typeSelectForm(val) {
      this.formObj.type = val ? val.id : null
    },
    handleClose(done) {
      this.dialogVisible = false
      this.formObj = {
        no: '',
        ip: '',
        type: null
      }
      this.formObj.type = null
      this.$refs.formObj.resetFields()
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.formObj.validate(async(valid) => {
        if (valid) {
          const _api = this.formObj.id ? 'put' : 'post'
          try {
            this.loadingBtn = true
            await materialReportEquip(_api, this.formObj.id, { data: this.formObj })
            this.$message.success('操作成功')
            this.getList()
            this.loadingBtn = false
          } catch (e) {
            this.loadingBtn = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>
.material-menni-equip .el-input{
    width: auto;
}
</style>
