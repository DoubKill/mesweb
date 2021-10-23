<template>
  <div class="supplier-style">
    <!-- 设备位置区域定义 -->
    <el-form :inline="true">
      <el-form-item label="位置区域名称">
        <el-input v-model="formInline.area_name" :disabled="isDialogView" clearable placeholder="位置区域名称" @input="debounceList" />
      </el-form-item>
      <el-form-item v-if="!isDialogView" label="是否启用">
        <el-select v-model="formInline.use_flag" clearable placeholder="是否启用" @change="changeSearch">
          <el-option
            v-for="item in [{label:'Y',value:1},{label:'N',value:0}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!isDialog" style="float:right">
        <el-button v-permission="['equip_area', 'export']" type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
        <el-upload
          v-permission="['equip_area', 'import']"
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
        <el-button v-permission="['equip_area', 'add']" type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column
        prop="area_code"
        label="位置区域编号"
        min-width="20"
      />
      <el-table-column
        prop="area_name"
        label="位置区域名称"
        min-width="20"
      />
      <el-table-column
        prop="inspection_line_no"
        label="巡检顺序编号"
        min-width="20"
      />
      <el-table-column
        prop="desc"
        label="备注说明"
        min-width="20"
      />
      <el-table-column
        prop="use_flag"
        label="是否启用"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.use_flag===true">Y</span>
          <span v-if="scope.row.use_flag===false">N</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_username"
        label="录入者"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
        min-width="20"
      />
      <el-table-column v-if="!isDialog" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['equip_area', 'change']"
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['equip_area', 'delete']"
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
      v-if="!isDialogView"
      :old-page="false"
      :total="total"
      :current-page="formInline.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`${dialogForm.id?'编辑':'新建'}供应商`"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="150px"
        :model="dialogForm"
      >
        <el-form-item
          label="位置区域编号"
          prop="area_code"
        >
          <el-input v-model="dialogForm.area_code" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item
          label="位置区域名称"
          prop="area_name"
        >
          <el-input v-model="dialogForm.area_name" />
        </el-form-item>
        <el-form-item
          label="巡检顺序编号"
          prop="inspection_line_no"
        >
          <el-input v-model="dialogForm.inspection_line_no" />
        </el-form-item>
        <el-form-item
          label="备注说明"
          prop="desc"
        >
          <el-input
            v-model="dialogForm.desc"
            style="width:250px"
            type="textarea"
            :rows="4"
          />
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
import { debounce } from '@/utils'
import { equipAreaDefine, equipAreaDefineDown, equipAreaDefineImport, equipAreaDefineGetName } from '@/api/jqy'
export default {
  name: 'EquipmentMasterDataLocation',
  components: { page },
  props: {
    isDialog: {
      type: Boolean,
      default: false
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    // 弹框只能查看
    isDialogView: {
      type: Boolean,
      default: false
    },
    // 区域名称
    areaName: {
      type: String,
      default: ''
    },
    // 区域编号
    areaCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formInline: {},
      tableData: [],
      total: 0,
      loading: false,
      btnExportLoad: false,
      dialogVisible: false,
      use_flag: '',
      rules: {
        area_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        area_code: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      SupplierTypeList: [],
      dialogForm: {},
      btnLoading: false,
      handleData: null
    }
  },
  watch: {
    showDialog(bool) {
      if (this.isDialog) {
        if (bool) {
          this.formInline = {}
          this.getList()
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        if (this.isDialogView) {
          this.formInline.area_name = this.areaName || ''
          this.formInline.area_code = this.areaCode || ''
        }
        this.loading = true
        const data = await equipAreaDefine('get', null, { params: this.formInline })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    debounceList() {
      debounce(this, 'changeSearch')
    },
    currentChange(page, pageSize) {
      this.formInline.page = page
      this.formInline.page_size = pageSize
      this.getList()
    },
    async onSubmit() {
      this.dialogForm = { area_code: '' }
      this.dialogVisible = true
      try {
        const data = await equipAreaDefineGetName('get', null, { params: {}})
        this.dialogForm.area_code = data.results
      } catch (e) {
        // this.$message.info('获取编号失败')
      }
    },
    handleCurrentChange(val) {
      this.handleData = val
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      equipAreaDefineImport('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
        this.formInline.page = 1
        this.getList()
      })
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.formInline)
      const _api = equipAreaDefineDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '设备区域位置定义.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    showEditDialog(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    changeSearch() {
      this.formInline.page = 1
      this.getList()
    },
    handleDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.area_code + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipAreaDefine('delete', row.id, {})
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
      // this.$refs.createForm.resetFields()
      // if (done) {
      //   done()
      // }
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.dialogForm.id ? 'put' : 'post'
            if (this.dialogForm.inspection_line_no === '') {
              this.dialogForm.inspection_line_no = null
            }
            await equipAreaDefine(_api, this.dialogForm.id || null, { data: this.dialogForm })
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
.supplier-style{
  .el-input{
    width:250px;
  }
}
</style>

