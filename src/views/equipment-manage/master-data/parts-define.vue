<template>
  <div class="parts-define">
    <!-- 设备部件定义 -->
    <el-form :inline="true" class="search-form-style">
      <el-form-item label="所属主设备种类">
        <el-select v-model="formInline.equip_type" placeholder="请选择" clearable @change="changeSearch">
          <el-option
            v-for="item in options"
            :key="item.category_name"
            :label="item.category_name"
            :value="item.category_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属设备部位">
        <el-select v-model="formInline.equip_part" :disabled="isMultiple===true" placeholder="请选择" clearable @change="changeSearch">
          <el-option
            v-for="item in options1"
            :key="item.part_name"
            :label="item.part_name"
            :value="item.part_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部件分类">
        <el-select v-model="formInline.equip_component_type" clearable placeholder="部件分类" @change="changeSearch">
          <el-option
            v-for="item in options2"
            :key="item.component_type_name"
            :label="item.component_type_name"
            :value="item.component_type_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部件名称">
        <el-input v-model="formInline.component_name" clearable placeholder="部件名称" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="是否已绑定备件">
        <el-select v-model="formInline.is_binding" clearable placeholder="是否绑定" @change="changeSearch">
          <el-option
            v-for="item in [{label:'Y',value:1},{label:'N',value:0}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
      <el-form-item v-if="isMultiple===false" style="float:right">
        <el-button type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
      <el-form-item v-if="isMultiple===false" style="float:right">
        <el-upload
          style="margin-right:8px"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="isMultiple===false" style="float:right">
        <el-button type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
      highlight-current-row
      @current-change="handleSelectionChange1"
    >
      <el-table-column
        prop="equip_type_name"
        label="所属主设备种类"
        min-width="20"
      />
      <el-table-column
        prop="equip_part_name"
        label="所属设备部位"
        min-width="20"
      />
      <el-table-column
        prop="equip_component_type_name"
        label="部件分类"
        min-width="20"
      />
      <el-table-column
        prop="component_code"
        label="部件代码"
        min-width="20"
      />
      <el-table-column
        prop="component_name"
        label="部件名称"
        min-width="20"
      />
      <el-table-column
        prop="is_binding"
        label="是否已绑定备件(Y/N)"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.is_binding===true">Y</span>
          <span v-if="scope.row.is_binding===false">N</span>
        </template>
      </el-table-column>
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
      <el-table-column v-if="isMultiple===false" label="操作" width="250px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="showSpareDialog(scope.row)"
          >绑定备件</el-button>
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
      :title="`${dialogForm.id?'编辑':'新建'}设备部件定义`"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="150px"
        :model="dialogForm"
      >
        <el-form-item
          label="所属主设备种类"
          prop="equip_type"
        >
          <el-select v-model="dialogForm.equip_type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.category_name"
              :label="item.category_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属主设备部位"
          prop="equip_part"
        >
          <el-select v-model="dialogForm.equip_part" placeholder="请选择">
            <el-option
              v-for="item in options1"
              :key="item.part_name"
              :label="item.part_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="部件分类"
          prop="equip_component_type"
        >
          <el-select v-model="dialogForm.equip_component_type" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.component_type_name"
              :label="item.component_type_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="部件代码"
          prop="component_code"
        >
          <el-input v-model="dialogForm.component_code" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item
          label="部件名称"
          prop="component_name"
        >
          <el-input v-model="dialogForm.component_name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="`绑定设备部件与备件的对应关系`"
      :visible.sync="dialogVisible1"
      width="90%"
      :before-close="handleClose1"
    >
      <el-form inline>
        <el-form-item
          label="所属设备部位"
        >
          <el-input v-model="dialogForm1.equip_part_name" disabled />
        </el-form-item>
        <el-form-item
          label="部件分类"
        >
          <el-input v-model="dialogForm1.equip_component_type_name" disabled />
        </el-form-item>
        <el-form-item
          label="部件代码"
        >
          <el-input v-model="dialogForm1.component_code" disabled />
        </el-form-item>
        <el-form-item
          label="部件名称"
        >
          <el-input v-model="dialogForm1.component_name" disabled />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="addDialogForm1"
          >添加</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading1"
        :data="tableData1"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="equip_component_type_name"
          label="备件分类"
          min-width="20"
        />
        <el-table-column
          prop="spare_code"
          label="备件编码"
          min-width="20"
        />
        <el-table-column
          prop="spare_name"
          label="备件名称"
          min-width="20"
        />
        <el-table-column
          prop="supplier_name"
          label="供应商名称"
          min-width="20"
        />
        <el-table-column
          prop="reuse_flag"
          label="是否全新"
          min-width="20"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.reuse_flag===true">是</span>
            <span v-if="scope.row.reuse_flag===false">否</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="delSpareDialog(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose1(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading1" @click="submitFun1">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="`备件物料选择`"
      :visible.sync="dialogVisible2"
      width="90%"
      :before-close="handleClose2"
    >
      <el-form inline>
        <el-form-item
          label="备件分类"
        >
          <el-input v-model="dialogForm2.equip_component_type" disabled />
        </el-form-item>
        <el-form-item
          label="备件供应商"
        >
          <el-input v-model="dialogForm2.supplier_name" @input="addDialogForm1" />
        </el-form-item>
        <el-form-item
          label="备件物料编码"
        >
          <el-input v-model="dialogForm2.spare_code" @input="addDialogForm1" />
        </el-form-item>
        <el-form-item
          label="备件物料名称"
        >
          <el-input v-model="dialogForm2.spare_name" @input="addDialogForm1" />
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="tableData2"
        style="width: 100%"
        row-key="id"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          :reserve-selection="true"
          :selectable="()=>{return true}"
        />
        <el-table-column
          prop="equip_component_type_name"
          label="备件分类"
          min-width="20"
        />
        <el-table-column
          prop="spare_code"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="spare_name"
          label="物料名称"
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
        :total="total2"
        :current-page="dialogForm2.page"
        @currentChange="currentChange2"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose2(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading2" @click="submitFun2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { equipComponent, equipsCategory, equipComponentType, equipPartNew, erpSpareComponentRelation, equipSpareErp } from '@/api/jqy'
export default {
  name: 'EquipmentMasterDataPartsDefine',
  components: { page },
  props: {
    isMultiple: {
      type: Boolean,
      default: false
    },
    equipType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      formInline: {},
      loading: false,
      tableData: [],
      multipleSelection: [],
      multipleSelection1: [],
      dialogVisible: false,
      id: '',
      options: [],
      options1: [],
      options2: [],
      total: 0,
      dialogForm: {},
      btnLoading: false,
      dialogForm1: {},
      dialogVisible1: false,
      loading1: false,
      btnLoading1: false,
      tableData1: [],
      dialogVisible2: false,
      dialogForm2: {},
      tableData2: [],
      total2: 0,
      btnLoading2: false,
      rules: {
        equip_type: [{ required: true, message: '不能为空', trigger: 'change' }],
        equip_part: [{ required: true, message: '不能为空', trigger: 'change' }],
        equip_component_type: [{ required: true, message: '不能为空', trigger: 'change' }],
        component_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        component_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    console.log(this.equipType)
    if (this.equipType) {
      this.formInline.equip_part = this.equipType
    }
    this.getTypeNode()
    this.getList()
    this.getEquipComponentType()
    this.getEquipPart()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipComponent('get', null, { params: this.formInline })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getEquipComponentType() {
      try {
        const data = await equipComponentType('get', null, { params: { all: 1 }})
        this.options2 = data.result || []
      } catch (error) {
        this.options2 = []
      }
    },
    async getTypeNode() {
      try {
        const data = await equipsCategory('get')
        this.options = data.results || []
      } catch (e) {
        //
      }
    },
    async getEquipPart() {
      try {
        const data = await equipPartNew('get', null, { params: { all: 1 }})
        this.options1 = data.result || []
      } catch (e) {
        //
      }
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
    currentChange2(page, pageSize) {
      this.dialogForm2.page = page
      this.dialogForm2.page_size = pageSize
      this.addDialogForm1()
    },
    onSubmit() {
      this.dialogForm = {}
      this.dialogVisible = true
    },
    async showSpareDialog(row) {
      try {
        this.dialogForm1 = JSON.parse(JSON.stringify(row))
        this.dialogVisible1 = true
        const data = await erpSpareComponentRelation('get', null, { params: { equip_component_id: row.id }})
        this.id = row.id
        this.tableData1 = data.results || []
      } catch (e) {
        //
      }
    },
    async addDialogForm1() {
      this.dialogForm2.equip_component_type = this.dialogForm1.equip_component_type_name
      this.dialogVisible2 = true
      const data = await equipSpareErp('get', null, { params: this.dialogForm2 })
      this.tableData2 = data.results || []
      this.total2 = data.count
      // this.$refs.multipleTable.toggleRowSelection(row)
    },
    async submitFun1() {
      const obj = []
      this.tableData1.forEach(item => {
        if (!item.reuse_flag) {
          obj.push({ equip_component: this.id, equip_spare_erp: item.id })
        }
      })
      if (obj.length >= 1) {
        try {
          await erpSpareComponentRelation('post', null, { data: obj })
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.dialogVisible1 = false
          this.getList()
        } catch (e) {
        //
        }
      } else {
        this.dialogVisible1 = false
      }
    },
    submitFun2() {
      for (let index = 0; index < this.multipleSelection.length; index++) {
        if (this.tableData1.length >= 1) {
          this.tableData1.forEach(item => {
            if (this.multipleSelection[index].id !== (item.equip_spare_erp ? item.equip_spare_erp : item.id)) {
              this.tableData1.push(this.multipleSelection[index])
            } else {
              this.$message.info('已有相同备件')
            }
          })
        } else {
          this.dialogVisible2 = false
          this.tableData1.push(this.multipleSelection[index])
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSelectionChange1(val) {
      this.multipleSelection1 = val
    },
    delSpareDialog(row) {
      this.$confirm('此操作将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.reuse_flag) {
          erpSpareComponentRelation('delete', row.id, {})
            .then(response => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              const data = erpSpareComponentRelation('get', null, { params: { equip_component_id: this.id }})
              this.tableData1 = data.results || []
              this.getList()
            })
        } else {
          this.tableData1.forEach((item, index) => {
            if (row.id === item.id) {
              this.tableData1.splice(index, 1)
            }
          })
        }
      })
    },
    showEditDialog(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleDelete: function(row) {
      var str = row.used_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.component_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipComponent('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    Upload(param) {
      // const formData = new FormData()
      // formData.append('file', param.file)
      // equipPartNewImport('post', null, { data: formData }).then(response => {
      //   this.$message({
      //     type: 'success',
      //     message: '导入成功!'
      //   })
      //   this.formInline.page = 1
      //   this.getList()
      // })
    },
    exportTable() {
      // this.btnExportLoad = true
      // const obj = Object.assign({ export: 1 }, this.formInline)
      // const _api = equipPartNewDown
      // _api(obj)
      //   .then(res => {
      //     const link = document.createElement('a')
      //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      //     link.style.display = 'none'
      //     link.href = URL.createObjectURL(blob)
      //     link.download = '设备部位定义.xlsx' // 下载的文件名
      //     document.body.appendChild(link)
      //     link.click()
      //     document.body.removeChild(link)
      //     this.btnExportLoad = false
      //   }).catch(e => {
      //     this.btnExportLoad = false
      //   })
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
      if (done) {
        done()
      }
    },
    handleClose2(done) {
      this.dialogVisible2 = false
      this.$refs.multipleTable.clearSelection()
      if (done) {
        done()
      }
    },
    getVal() {
      return this.multipleSelection1
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.dialogForm.id ? 'put' : 'post'
            await equipComponent(_api, this.dialogForm.id || null, { data: this.dialogForm })
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
.parts-define{
  .search-form-style{
    .el-input{
      width:140px;
    }
  }
  .el-dialog__wrapper .el-input{
    width:230px;
  }
  .el-input-number .el-input{
    width:auto;
  }
}
</style>
