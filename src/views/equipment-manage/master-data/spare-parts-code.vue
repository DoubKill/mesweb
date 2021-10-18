<template>
  <div class="location-area-style">
    <!-- 备件代码定义 -->
    <el-form :inline="true" class="search-form-style">
      <el-form-item label="备件分类">
        <el-select v-model="formInline.equip_component_type" clearable placeholder="备件分类" @change="changeSearch">
          <el-option
            v-for="item in options"
            :key="item.equip_component_type__component_type_name"
            :label="item.equip_component_type__component_type_name"
            :value="item.equip_component_type__component_type_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备件名称">
        <el-input v-model="formInline.spare_name" clearable placeholder="备件名称" @input="debounceList" />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input v-model="formInline.specification" clearable placeholder="规格型号" @input="debounceList" />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="formInline.use_flag" clearable placeholder="是否启用" @change="changeSearch">
          <el-option
            v-for="item in [{label:'Y',value:1},{label:'N',value:0}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-upload
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="spare_code"
        label="备件代码"
        min-width="20"
      />
      <el-table-column
        prop="spare_name"
        label="备件名称"
        width="100"
      />
      <el-table-column
        prop="equip_component_type_name"
        label="备件分类"
        min-width="20"
      />
      <el-table-column
        prop="specification"
        label="规格型号"
        min-width="20"
      />
      <el-table-column
        prop="technical_params"
        label="技术参数"
        min-width="20"
      />
      <el-table-column
        prop="unit"
        label="标准单位"
        min-width="20"
      />
      <el-table-column
        prop="key_parts_flag"
        label="关键部件"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.key_parts_flag===true">是</span>
          <span v-if="scope.row.key_parts_flag===false">否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lower_stock"
        label="库存下限"
        min-width="20"
      />
      <el-table-column
        prop="upper_stock"
        label="库存上限"
        min-width="20"
      />
      <el-table-column
        prop="cost"
        label="计划价格"
        min-width="20"
      />
      <el-table-column
        prop="texture_material"
        label="材质"
        min-width="20"
      />
      <el-table-column
        prop="period_validity"
        label="有效期(天)"
        min-width="20"
      />
      <el-table-column
        prop="supplier_name"
        label="供应商名称"
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
        label="录入人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
        width="180"
      />
      <el-table-column label="操作" width="140px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showEditDialog(scope.row,'编辑')"
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
      :title="`${type!=='新建'?'编辑':'新建'}备件代码定义`"
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="150px"
        :model="dialogForm"
        :inline="true"
      >
        <el-form-item
          label="备件分类"
          prop="equip_component_type"
        >
          <el-select v-model="dialogForm.equip_component_type" placeholder="请选择">
            <el-option
              v-for="item in options1"
              :key="item.component_type_name"
              :label="item.component_type_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="供应商名称"
          prop="supplier_name"
        >
          <el-input v-model="dialogForm.supplier_name" />
        </el-form-item>
        <el-form-item
          label="备件代码"
          prop="spare_code"
        >
          <el-input v-model="dialogForm.spare_code" :disabled="type!=='新建'">
            <el-button slot="append" :disabled="type!=='新建'" icon="el-icon-search" @click="showERP" />
          </el-input>
        </el-form-item>
        <el-form-item
          label="库存下限"
          prop="lower_stock"
        >
          <el-input-number v-model="dialogForm.lower_stock" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item
          label="备件名称"
          prop="spare_name"
        >
          <el-input v-model="dialogForm.spare_name" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item
          label="库存上限"
          prop="upper_stock"
        >
          <el-input-number v-model="dialogForm.upper_stock" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item
          label="规格型号"
          prop="specification"
        >
          <el-input v-model="dialogForm.specification" />
        </el-form-item>
        <el-form-item
          label="计划价格"
          prop="cost"
        >
          <el-input-number v-model="dialogForm.cost" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item
          label="技术参数"
          prop="technical_params"
        >
          <el-input v-model="dialogForm.technical_params" />
        </el-form-item>
        <el-form-item
          label="有效期（天）"
          prop="period_validity"
        >
          <el-input-number v-model="dialogForm.period_validity" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item
          label="标准单位"
          prop="unit"
        >
          <el-input v-model="dialogForm.unit" />
        </el-form-item>
        <el-form-item
          label="材质"
          prop="texture_material"
        >
          <el-input v-model="dialogForm.texture_material" />
        </el-form-item>
        <el-form-item label="是否关键部件" prop="key_parts_flag">
          <el-select v-model="dialogForm.key_parts_flag" clearable placeholder="是否关键部件">
            <el-option
              v-for="item in [{label:'是',value:true},{label:'否',value:false}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`ERP备件选择`"
      :visible.sync="dialogVisible1"
      width="90%"
      :before-close="handleClose1"
    >
      <el-form :inline="true">
        <el-form-item
          label="ERP备件编码"
        >
          <el-input v-model="dialogForm1.spare_code" @input="addDialogForm1" />
        </el-form-item>
        <el-form-item
          label="ERP备件名称"
        >
          <el-input v-model="dialogForm1.spare_name" @input="addDialogForm1" />
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        highlight-current-row
        :data="tableData1"
        style="width: 100%"
        border
        @current-change="handleCurrentChange"
      >
        <el-table-column
          prop="spare_code"
          label="备件代码"
          min-width="20"
        />
        <el-table-column
          prop="spare_name"
          label="备件名称"
          min-width="20"
        />
        <el-table-column
          prop="equip_component_type_name"
          label="备件分类"
          min-width="20"
        />
        <el-table-column
          prop="specification"
          label="规格型号"
          min-width="20"
        />
        <el-table-column
          prop="technical_params"
          label="技术参数"
          min-width="20"
        />
        <el-table-column
          prop="unit"
          label="标准单位"
          min-width="20"
        />
        <el-table-column
          prop="key_parts_flag"
          label="关键部件"
          min-width="20"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.key_parts_flag===true">是</span>
            <span v-if="scope.row.key_parts_flag===false">否</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="texture_material"
          label="材质"
          min-width="20"
        />
        <el-table-column
          prop="supplier_name"
          label="供应商名称"
          min-width="20"
        />
      </el-table>
      <page
        :old-page="false"
        :total="total1"
        :current-page="dialogForm1.page"
        @currentChange="currentChange1"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose1(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading1" @click="submitFun1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { equipSpareErp, equipSpareErpDown, equipSpareErpImport } from '@/api/jqy'
import { debounce } from '@/utils'
export default {
  name: 'EquipmentMasterDataSparePartsCode',
  components: { page },
  data() {
    return {
      formInline: {},
      tableData: [{}],
      tableData1: [],
      total: 0,
      total1: 0,
      loading: false,
      btnExportLoad: false,
      dialogVisible: false,
      dialogVisible1: false,
      rules: {
        equip_component_type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        spare_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        spare_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      type: '',
      dialogForm: {
        equip_component_type: '',
        supplier_name: '',
        spare_code: '',
        spare_name: '',
        specification: '',
        technical_params: '',
        unit: '',
        texture_material: '', key_parts_flag: '' },
      dialogForm1: {},
      btnLoading: false,
      btnLoading1: false,
      options: [],
      options1: [],
      multipleSelection: []
    }
  },
  created() {
    this.getList()
    this.getList1()
    this.getList3()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipSpareErp('get', null, { params: this.formInline })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getList1() {
      try {
        const data = await equipSpareErp('get', null, { params: { all: 0 }})
        this.options = data.results || []
      } catch (e) {
        //
      }
    },
    async getList2() {
      try {
        const data = await equipSpareErp('get', null, { params: this.dialogForm1 })
        this.tableData1 = data.results || []
        this.total1 = data.count
      } catch (e) {
        // this.loading = false
      }
    },
    async getList3() {
      try {
        const data = await equipSpareErp('get', null, { params: { all: 1 }})
        this.options1 = data.results || []
      } catch (e) {
        //
      }
    },
    debounceList() {
      debounce(this, 'changeSearch')
    },
    addDialogForm1() {
      this.getList2()
    },
    handleCurrentChange(val) {
      this.multipleSelection = val
    },
    changeSearch() {
      this.formInline.page = 1
      this.getList()
    },
    currentChange(page, pageSize) {
      this.formInline.page = page
      this.formInline.page_size = pageSize
      this.getList()
    },
    currentChange1(page, pageSize) {
      this.dialogForm1.page = page
      this.dialogForm1.page_size = pageSize
      this.getList2()
    },
    onSubmit() {
      this.dialogVisible = true
      this.type = '新建'
      this.dialogForm = {
        equip_component_type: '',
        supplier_name: '',
        spare_code: '',
        spare_name: '',
        specification: '',
        technical_params: '',
        unit: '',
        texture_material: '',
        key_parts_flag: '' }
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      equipSpareErpImport('post', null, { data: formData }).then(response => {
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
      const _api = equipSpareErpDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '备件代码定义.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    showEditDialog(row) {
      this.type = ''
      this.dialogForm = JSON.parse(JSON.stringify(row))
      if (this.dialogForm.lower_stock === null) {
        this.dialogForm.lower_stock = undefined
      }
      if (this.dialogForm.upper_stock === null) {
        this.dialogForm.upper_stock = undefined
      }
      if (this.dialogForm.cost === null) {
        this.dialogForm.cost = undefined
      }
      if (this.dialogForm.period_validity === null) {
        this.dialogForm.period_validity = undefined
      }
      this.dialogVisible = true
    },
    showERP() {
      this.dialogVisible1 = true
      this.getList2()
    },
    handleDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.spare_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipSpareErp('delete', row.id, {})
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
      this.$refs.createForm.resetFields()
      if (done) {
        done()
      }
    },
    handleClose1(done) {
      this.dialogVisible1 = false
      // this.$refs.createForm.resetFields()
      // if (done) {
      //   done()
      // }
    },
    submitFun1() {
      this.dialogForm.equip_component_type = this.multipleSelection.equip_component_type
      this.dialogForm.supplier_name = this.multipleSelection.supplier_name
      this.dialogForm.spare_code = this.multipleSelection.spare_code
      this.dialogForm.lower_stock = this.multipleSelection.lower_stock
      this.dialogForm.spare_name = this.multipleSelection.spare_name
      this.dialogForm.upper_stock = this.multipleSelection.upper_stock
      this.dialogForm.specification = this.multipleSelection.specification
      this.dialogForm.cost = this.multipleSelection.cost
      this.dialogForm.technical_params = this.multipleSelection.technical_params
      this.dialogForm.period_validity = this.multipleSelection.period_validity
      this.dialogForm.unit = this.multipleSelection.unit
      this.dialogForm.texture_material = this.multipleSelection.texture_material
      this.dialogForm.key_parts_flag = this.multipleSelection.key_parts_flag
      this.dialogVisible1 = false
    },
    submitFun() {
      const dialogForm1 = JSON.parse(JSON.stringify(this.dialogForm))
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.type === '新建' ? 'post' : 'put'
            if (dialogForm1.lower_stock === undefined) {
              dialogForm1.lower_stock = null
            }
            if (dialogForm1.upper_stock === undefined) {
              dialogForm1.upper_stock = null
            }
            if (dialogForm1.cost === undefined) {
              dialogForm1.cost = null
            }
            if (dialogForm1.period_validity === undefined) {
              dialogForm1.period_validity = null
            }
            await equipSpareErp(_api, this.dialogForm.id || null, { data: dialogForm1 })
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
