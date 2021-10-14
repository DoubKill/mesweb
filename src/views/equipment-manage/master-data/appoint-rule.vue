<template>
  <div class="location-area-style">
    <!-- 工单指派规则定义 -->
    <el-form :inline="true" class="search-form-style">
      <el-form-item label="规则名称">
        <el-input v-model="formInline.rule_name" clearable placeholder="规则名称" @input="debounceFun" />
      </el-form-item>
      <el-form-item label="作业类型">
        <el-select v-model="formInline.work_type" clearable placeholder="作业类型" @change="changeList">
          <el-option
            v-for="item in workTypeList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型">
        <equipTypeSelect @equipTypeSelect="equipTypeSelect" />
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select v-model="formInline.equip_condition" clearable placeholder="设备条件" @change="changeList">
          <el-option
            v-for="item in ['停机','不停机']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="重要程度">
        <el-select v-model="formInline.important_level" clearable placeholder="重要程度" @change="changeList">
          <el-option
            v-for="item in ['高','中','低']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="formInline.use_flag" clearable @change="changeList">
          <el-option
            v-for="(item,key) in [{label:true,name:'Y'},{label:false,name:'N'}]"
            :key="key"
            :label="item.name"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button size="small" type="primary" @click="exportTable">导出Excel</el-button>
        <el-upload
          style="display:inline-block;margin:0 6px"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button size="small" type="primary">导入Excel</el-button>
        </el-upload>
        <el-button size="small" type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="rule_code"
        label="规则编号"
        min-width="20"
      />
      <el-table-column
        prop="rule_name"
        label="规则名称"
        min-width="20"
      />
      <el-table-column
        prop="work_type"
        label="作业类型"
        min-width="20"
      />
      <el-table-column
        prop="equip_type_name"
        label="设备类型"
        min-width="20"
      />
      <el-table-column
        prop="equip_condition"
        label="设备条件"
        min-width="20"
      />
      <el-table-column
        prop="important_level"
        label="重要程度"
        min-width="20"
      />
      <el-table-column
        prop="receive_interval"
        label="接单间隔时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="receive_warning_times"
        label="接单重复提示次数"
        min-width="20"
      />
      <el-table-column
        prop="start_interval"
        label="维修开始时间间隔（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="start_warning_times"
        label="开始重复提示次数"
        min-width="20"
      />
      <el-table-column
        prop="accept_interval"
        label="验收间隔时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="accept_warning_times"
        label="验收重复提示次数"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="录入人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
        min-width="20"
      />
      <el-table-column label="操作" width="140px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >{{ scope.row.use_flag?'停用':'启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="formInline.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`${dialogForm.id?'编辑':'新建'}工单指派规则`"
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="200px"
        :model="dialogForm"
        :inline="true"
      >
        <el-form-item
          label="标准编号"
          prop="rule_code"
        >
          <el-input v-model="dialogForm.rule_code" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item
          label="接单间隔时间（分钟）"
          prop="receive_interval"
        >
          <el-input-number v-model="dialogForm.receive_interval" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item
          label="标准名称"
          prop="rule_name"
        >
          <el-input v-model="dialogForm.rule_name" />
        </el-form-item>
        <el-form-item
          label="接单重复提醒次数"
          prop="receive_warning_times"
        >
          <el-input-number v-model="dialogForm.receive_warning_times" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item
          label="作业类型"
          prop="work_type"
        >
          <el-select v-model="dialogForm.work_type" placeholder="请选择">
            <el-option
              v-for="item in workTypeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="维修开始间隔时间（分钟）"
          prop="start_interval"
        >
          <el-input-number v-model="dialogForm.start_interval" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item
          label="设备类型"
          prop="equip_type"
        >
          <equipTypeSelect :default-val="dialogForm.equip_type" :is-created="true" @equipTypeSelect="equipTypeSelect1" />
        </el-form-item>
        <el-form-item
          label="开始重复提醒次数"
          prop="start_warning_times"
        >
          <el-input-number v-model="dialogForm.start_warning_times" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item
          label="设备条件"
          prop="equip_condition"
        >
          <el-select v-model="dialogForm.equip_condition" placeholder="设备条件">
            <el-option
              v-for="item in ['停机','不停机']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="验收间隔时间（分钟）"
          prop="accept_interval"
        >
          <el-input-number v-model="dialogForm.accept_interval" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item
          label="重要程度"
          prop="important_level"
        >
          <el-select v-model="dialogForm.important_level" placeholder="请选择">
            <el-option
              v-for="item in ['高','中','低']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="验收重复提醒次数"
          prop="accept_warning_times"
        >
          <el-input-number v-model="dialogForm.accept_warning_times" controls-position="right" :min="1" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import equipTypeSelect from '../components/equip-type-select'
import commons from '@/utils/common'
import { equipOrderAssignRule, equipOrderAssignRuleImportXlsx } from '@/api/base_w_four'
export default {
  name: 'EquipmentMasterDataAppointRule',
  components: { page, equipTypeSelect },
  data() {
    return {
      formInline: {},
      workTypeList: commons.workTypeList,
      tableData: [{}],
      total: 0,
      loading: false,
      dialogVisible: false,
      rules: {
        rule_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        rule_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        receive_interval: [{ required: true, message: '不能为空', trigger: 'blur' }],
        receive_warning_times: [{ required: true, message: '不能为空', trigger: 'blur' }],
        start_interval: [{ required: true, message: '不能为空', trigger: 'blur' }],
        accept_interval: [{ required: true, message: '不能为空', trigger: 'blur' }],
        start_warning_times: [{ required: true, message: '不能为空', trigger: 'blur' }],
        accept_warning_times: [{ required: true, message: '不能为空', trigger: 'blur' }],
        equip_condition: [{ required: true, message: '不能为空', trigger: 'change' }],
        work_type: [{ required: true, message: '不能为空', trigger: 'change' }],
        important_level: [{ required: true, message: '不能为空', trigger: 'change' }],
        equip_type: [{ required: true, message: '不能为空', trigger: 'change', validator: (rule, value, callback) => {
          if (this.dialogForm.equip_type === '' && !value) {
            callback(new Error('请选择设备类型'))
          } else {
            callback()
          }
        } }]
      },
      dialogForm: {},
      btnLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipOrderAssignRule('get', null, { params: this.formInline })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    equipTypeSelect1(row) {
      this.dialogForm.equip_type = row ? row.id : ''
    },
    debounceFun() {
      this.$debounce(this, 'changeList')
    },
    currentChange(page, pageSize) {
      this.formInline.page = page
      this.formInline.page_size = pageSize
      this.getList()
    },
    changeList() {
      this.formInline.page = 1
      this.getList()
    },
    onSubmit() {
      this.dialogVisible = true
    },
    showEditDialog(row) {
      this.dialogForm = row
      this.dialogVisible = true
    },
    equipTypeSelect(val) {
      this.formInline.equip_type_id = val ? val.id : ''
      this.changeList()
    },
    exportTable() {
      this.btnExportLoad = true
      equipOrderAssignRule('get', null, { responseType: 'blob', params: { export: 1 }})
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '工单指派规则.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      equipOrderAssignRuleImportXlsx('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
        this.changeList()
      })
    },
    handleDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipOrderAssignRule('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    handleClose(done) {
      this.dialogVisible = false
      this.dialogForm = {}
      this.$refs.createForm.resetFields()
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.dialogForm.id ? 'put' : 'post'
            await equipOrderAssignRule(_api, this.dialogForm.id || null, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.handleClose(null)
            this.getList()
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

<style lang="scss">
.location-area-style{
  .search-form-style{
    .el-input{
      width:140px;
    }
  }
  .el-dialog__wrapper .el-input{
    width:200px;
  }
  .el-input-number .el-input{
    width:auto;
  }
}
</style>
