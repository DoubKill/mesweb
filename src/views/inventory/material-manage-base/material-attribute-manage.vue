<template>
  <div class="app-container">
    <!-- 物料基础信息管理 -->
    <el-form :inline="true">
      <el-form-item label="物料类型">
        <materielTypeSelect :params-type="false" @changSelect="changeMaterialType" />
        <!-- <el-input v-model="getParams.material_type" @input="changeSearch" /> -->
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input v-model="getParams.material_no" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="getParams.only_storage_flag" :label="1" @change="changeSearch">仅显示未设定有效期的物料</el-checkbox>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="getParams.only_safety_flag" @change="changeSearch">仅显示未设定安全库存标准的物料</el-checkbox>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="showDialog">批量设置有效期及安全库存标准</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      border
      fit
      style="width: 100%"
      :data="tableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="物料类型" align="center" prop="material_type_name" width="80px" />
      <el-table-column label="物料编码" align="center" prop="material_no" />
      <el-table-column label="物料名称" align="center" prop="material_name" />
      <el-table-column label="库存期限(小时)" align="center" prop="storage_time" />
      <el-table-column label="有效期(天)" align="center" prop="period_of_validity" />
      <el-table-column label="安全库存标准(车)" align="center" prop="safety_inventory" />
      <el-table-column label="产地管理" align="center" width="300px">
        <template slot-scope="scope">
          <div style="display:flex">
            <div style="flex:1">{{ scope.row.suppliers }}</div>
            <el-button-group style="width:60px">
              <el-button
                v-permission="['material_attr', 'view']"
                size="mini"
                @click="showBarCodeManageDialog(scope.row)"
              >管理</el-button>
            </el-button-group>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="90px">
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
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <el-dialog
      title="产地管理"
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
        <el-table-column label="产地" align="center" prop="provenance" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-permission="['material_attr', 'delete']"
              size="mini"
              type="danger"
              plain
              @click="handleData(scope.row)"
            >{{ scope.row.use_flag ? '停用' : '启用' }}
            </el-button>
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
      :title="isBatch?'批量设置有效期及安全库存标准':'编辑物料属性'"
      :visible.sync="attributeEditDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="attributeForm" :rules="rules" label-width="130px" :model="attributeForm" inline>
        <el-form-item
          v-if="!isBatch"
          label="物料类型"
        >{{ attributeForm.material_type_name }}
          <!-- <el-input v-model="attributeForm.material_type" :disabled="true" /> -->
        </el-form-item><br v-if="!isBatch">
        <el-form-item
          v-if="!isBatch"
          label="物料编码"
        >{{ attributeForm.material_no }}
          <!-- <el-input v-model="attributeForm.material_no" :disabled="true" /> -->
        </el-form-item><br v-if="!isBatch">
        <el-form-item
          v-if="!isBatch"
          label="物料名称"
        >{{ attributeForm.material_name }}
          <!-- <el-input v-model="attributeForm.material_name" :disabled="true" /> -->
        </el-form-item><br v-if="!isBatch">
        <el-form-item
          label="库存期限(小时)"
          prop="storage_time"
        >
          <el-input v-model="attributeForm.storage_time" />
        </el-form-item>
        <el-form-item
          label="有效期(天)"
          prop="period_of_validity"
        >
          <el-input v-model.number="attributeForm.period_of_validity" type="age" />
        </el-form-item><br>
        <el-form-item
          label="安全库存标准(车)"
          prop="safety_inventory"
        >
          <el-input v-model.number="attributeForm.safety_inventory" type="age" />
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
      title="新增物料产地"
      :visible.sync="barCodeCreateDialogVisible"
    >
      <el-form ref="barCodeForm" :rules="rules" label-width="80px" :model="barCodeForm">
        <el-form-item
          label="物料类型"
        >
          {{ barCodeForm.material_type_name }}
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
          label="产地"
          prop="provenance"
        >
          <el-input v-model="barCodeForm.provenance" />
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
import { getMaterialsAttribute, postMaterialsAttribute, getBarCode, postBatchSet, postBarCode, deleteBarCode } from '@/api/material-attribute-manage'
import materielTypeSelect from '@/components/select_w/materielTypeSelect'
import page from '@/components/page'
import { mapGetters } from 'vuex'
export default {
  name: 'MaterialAttributeManage',
  components: { page, materielTypeSelect },
  data() {
    return {
      tableData: [],
      getParams: {
        material_type_id: '',
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
      barCodeForm: { provenance: null },
      totalBarCode: 0,
      rules: {
        period_of_validity: [{ required: false, message: '不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur' }],
        storage_time: [{ required: false, message: '不能为空', trigger: 'blur' },
          { pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正数', trigger: 'blur' }],
        safety_inventory: [{ required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur' }]
      },
      barCodeManageDialogVisible: false,
      barCodeCreateDialogVisible: false,
      attributeEditDialogVisible: false,
      currentArr: [],
      isBatch: false
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
      const obj = Object.assign({}, this.getParams)
      obj.only_storage_flag = obj.only_storage_flag ? 1 : null
      obj.only_safety_flag = obj.only_safety_flag ? 1 : null
      getMaterialsAttribute(obj)
        .then(response => {
          this.tableData = response.results
          this.total = response.count
        })
    },
    showAttributeEditDialog(row) {
      this.isBatch = false
      this.attributeForm = Object.assign({}, row)
      this.attributeForm.material = row.id
      this.attributeForm.validity_unit = '天'
      this.attributeEditDialogVisible = true
      this.$nextTick(() => {
        this.$refs.attributeForm.clearValidate()
      })
    },
    handleAttributeEdit() {
      if (this.attributeForm.storage_time && !this.attributeForm.period_of_validity) {
        this.$message.info('请填写有效期')
        return
      }
      if (!this.attributeForm.storage_time) {
        this.attributeForm.storage_time = null
      }
      if (!this.attributeForm.period_of_validity) {
        this.attributeForm.period_of_validity = null
      }
      this.$refs.attributeForm.validate((valid) => {
        if (valid) {
          if (this.isBatch) {
            const arr = []
            this.currentArr.forEach(d => {
              arr.push(d.id)
            })
            this.attributeForm.materials = arr
            postBatchSet(this.attributeForm)
              .then(response => {
                this.attributeEditDialogVisible = false
                this.$message.success('批量修改成功')
                this.getMaterialsAttributeList()
              })
            return
          }
          postMaterialsAttribute(this.attributeForm)
            .then(response => {
              this.attributeEditDialogVisible = false
              this.$message.success(this.attributeForm.material_name + '编辑成功')
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
      this.getParams.material_type_id = data
      this.getParams.page = 1
      this.getMaterialsAttributeList()
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
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
      this.getParamsBarCode.material = row.id
      this.barCodeManageDialogVisible = true
      this.barCodeForm = {
        material: row.id,
        material_type_name: row.material_type_name,
        material_no: row.material_no,
        material_name: row.material_name,
        provenance: ''
      }
      this.getBarCodelist()
    },
    showBarCodeCreateDialog() {
      this.barCodeForm.provenance = ''
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
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.material_name + '产地：' + row.provenance + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBarCode(row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getParamsBarCode.page = 1
            this.getBarCodelist()
          }).catch(function() {

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
    },
    showDialog() {
      if (!this.currentArr.length) {
        this.$message('请选择物料')
        return
      }
      this.isBatch = true
      this.attributeEditDialogVisible = true
      this.$nextTick(() => {
        this.$refs.attributeForm.clearValidate()
      })
    },
    handleSelectionChange(arr) {
      this.currentArr = arr
    }
  }
}

</script>
