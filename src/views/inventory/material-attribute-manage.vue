<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="物料类型">
        <materielTypeSelect @changSelect="changeMaterialType" />
        <!-- <el-input v-model="getParams.material_type" @input="changeSearch" /> -->
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input v-model="getParams.material_no" @input="changeSearch" />
      </el-form-item>
    </el-form>
    <el-table
      border
      fit
      style="width: 100%"
      :data="tableData"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="物料类型" align="center" prop="material_type" />
      <el-table-column label="物料编码" align="center" prop="material_no" />
      <el-table-column label="物料名称" align="center" prop="material_name" />
      <el-table-column label="有效期" align="center" prop="period_of_validity" />
      <el-table-column label="安全库存标准" align="center" prop="safety_inventory" />
      <el-table-column label="有效期单位" align="center" prop="validity_unit" />
      <el-table-column label="条码管理" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['material_attr', 'view']"
              size="mini"
              @click="showBarCodeManageDialog(scope.row)"
            >管理</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['material_attr', 'change']"
              size="mini"
              @click="showAttributeEditDialog(scope.row)"
            >编辑</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <el-dialog
      title="条码管理"
      :visible.sync="barCodeManageDialogVisible"
    >
      <el-form :inline="true">
        <el-form-item style="float: right">
          <el-button
            v-permission="['material_attr', 'add']"
            @click="showBarCodeCreateDialog"
          >新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="barCodeData"
        border
        fit
        style="width: 100%"
      >
        <el-table-column label="No" type="index" align="center" />
        <el-table-column label="物料类型" align="center" prop="material_type" />
        <el-table-column label="物料编码" align="center" prop="material_no" />
        <el-table-column label="物料名称" align="center" prop="material_name" />
        <el-table-column label="条码" align="center" prop="supplier_no" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                v-permission="['material_attr', 'delete']"
                size="mini"
                type="danger"
                @click="handleData(scope.row)"
              >删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <page
        :total="totalBarCode"
        :current-page="getParamsBarCode.page"
        @currentChange="currentChangeBarCode"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="barCodeManageDialogVisible = false">关闭</el-button>
        <!-- <el-button
          type="primary"
          @click="handleCreateGlobalCode"
        >确 定</el-button> -->
      </div>
    </el-dialog>
    <el-dialog
      title="编辑物料属性"
      :visible.sync="attributeEditDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="attributeForm" :rules="rules" label-width="120px" :model="attributeForm">
        <el-form-item
          label="物料类型"
        >{{ attributeForm.material_type }}
          <!-- <el-input v-model="attributeForm.material_type" :disabled="true" /> -->
        </el-form-item>
        <el-form-item
          label="物料编码"
        >{{ attributeForm.material_no }}
          <!-- <el-input v-model="attributeForm.material_no" :disabled="true" /> -->
        </el-form-item>
        <el-form-item
          label="物料名称"
        >{{ attributeForm.material_name }}
          <!-- <el-input v-model="attributeForm.material_name" :disabled="true" /> -->
        </el-form-item>
        <el-form-item
          label="有效期"
          prop="period_of_validity"
        >
          <el-input v-model.number="attributeForm.period_of_validity" type="age" />
        </el-form-item>
        <el-form-item
          label="安全库存标准"
          prop="safety_inventory"
        >
          <el-input v-model.number="attributeForm.safety_inventory" type="age" />
        </el-form-item>
        <el-form-item
          label="有效期单位"
          prop="validity_unit"
        >
          <el-input v-model="attributeForm.validity_unit" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="attributeEditDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAttributeEdit()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="新增物料条码"
      :visible.sync="barCodeCreateDialogVisible"
    >
      <el-form ref="barCodeForm" :rules="rules" label-width="80px" :model="barCodeForm">
        <el-form-item
          label="物料类型"
        >
          {{ barCodeForm.material_type }}
        </el-form-item>
        <el-form-item
          label="物料编码"
        >
          {{ barCodeForm.material_no }}
        </el-form-item>
        <el-form-item
          label="物料名称"
        >
          {{ barCodeForm.material_name }}
        </el-form-item>
        <el-form-item
          label="条码"
          prop="supplier_no"
        >
          <el-input v-model="barCodeForm.supplier_no" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="barCodeCreateDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleBarCodeCreate()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMaterialsAttribute, putMaterialsAttribute, getBarCode, postBarCode, deleteBarCode } from '@/api/material-attribute-manage'
import materielTypeSelect from '@/components/select_w/materielTypeSelect'
import page from '@/components/page'
import { mapGetters } from 'vuex'
export default {
  components: { page, materielTypeSelect },
  data() {
    return {
      tableData: [],
      getParams: {
        material_type: '',
        material_no: '',
        page: 1
      },
      attributeForm: {},
      total: 0,
      barCodeData: [],
      getParamsBarCode: {
        material: '',
        page: 1
      },
      barCodeForm: { supplier_no: null },
      totalBarCode: 0,
      rules: {
        period_of_validity: [{ required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', message: '请输入合法整数', trigger: 'blur' }],
        safety_inventory: [{ required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', message: '请输入合法整数', trigger: 'blur' }],
        validity_unit: [{ required: true, message: '不能为空', trigger: 'blur' }],
        supplier_no: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      barCodeManageDialogVisible: false,
      barCodeCreateDialogVisible: false,
      attributeEditDialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
    this.getMaterialsAttributeList()
  },
  methods: {
    getMaterialsAttributeList() {
      getMaterialsAttribute(this.getParams)
        .then(response => {
          this.tableData = response.results
          this.total = response.count
        })
    },
    showAttributeEditDialog(row) {
      this.attributeForm = Object.assign({}, row)
      this.attributeEditDialogVisible = true
      this.$nextTick(() => {
        this.$refs.attributeForm.clearValidate()
      })
    },
    handleAttributeEdit() {
      this.$refs.attributeForm.validate((valid) => {
        if (valid) {
          putMaterialsAttribute(this.attributeForm, this.attributeForm.id)
            .then(response => {
              this.attributeEditDialogVisible = false
              this.$message(this.attributeForm.material_name + '修改成功')
              this.getMaterialsAttributeList()
            })
        }
      })
    },
    changeSearch() {
      this.getParams.page = 1
      this.getMaterialsAttributeList()
    },
    changeMaterialType(data) {
      this.getParams.material_type = data
      this.getParams.page = 1
      this.getMaterialsAttributeList()
    },
    currentChange(page) {
      this.getParams.page = page
      this.getMaterialsAttributeList()
    },
    getBarCodelist() {
      getBarCode(this.getParamsBarCode)
        .then(response => {
          this.barCodeData = response.results
          this.totalBarCode = response.count
        })
    },
    showBarCodeManageDialog(row) {
      this.getParamsBarCode.material = row.material
      this.barCodeManageDialogVisible = true
      this.barCodeForm = {
        material: row.material,
        material_type: row.material_type,
        material_no: row.material_no,
        material_name: row.material_name,
        supplier_no: ''
      }
      this.getBarCodelist()
    },
    showBarCodeCreateDialog() {
      this.barCodeForm.supplier_no = ''
      this.barCodeCreateDialogVisible = true
      this.$nextTick(() => {
        this.$refs.barCodeForm.clearValidate()
      })
    },
    handleBarCodeCreate() {
      this.$refs.barCodeForm.validate((valid) => {
        if (valid) {
          postBarCode(this.barCodeForm)
            .then(response => {
              this.barCodeCreateDialogVisible = false
              this.$message('创建成功')
              this.getBarCodelist()
            })
        }
      })
    },
    handleData(row) {
      this.$confirm('此操作将永久删除' + row.material_name + '条码：' + row.supplier_no + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBarCode(row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getParamsBarCode.page = 1
            this.getBarCodelist()
          }).catch(error => {
            this.$message.error(error)
          })
      })
    },
    changeSearchBarCode() {
      this.getParamsBarCode.page = 1
      this.getBarCodeList()
    },
    currentChangeBarCode(page) {
      this.getParamsBarCode.page = page
      this.getBarCodelist()
    }
  }
}

</script>
