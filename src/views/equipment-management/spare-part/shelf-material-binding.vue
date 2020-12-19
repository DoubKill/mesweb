<template>
  <div>
    <!-- 货架物料绑定管理 -->
    <el-form :inline="true">
      <el-form-item label="物料编码">
        <materialCodeSelect
          :is-all-obj="true"
          @changeSelect="changeMaterialCode"
        />
      </el-form-item>
      <el-form-item label="物料名称">
        <materialCodeSelect
          :is-all-obj="true"
          label-name="material_name"
          @changeSelect="changeMaterialName"
        />
      </el-form-item>
      <el-form-item label="库存位">
        <inventoryPosition @changSelect="changSelect" />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          @click="showCreateDialog"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        label="No"
        width="50"
      />
      <el-table-column
        prop="material_no"
        label="物料编码"
      />
      <el-table-column
        prop="material_name"
        label="物料名称"
      />
      <el-table-column
        prop="location_name"
        label="库存位"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            <!-- {{ scope.row.delete_flag?'停用':'启用' }} -->
            </el-button>
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
      title="添加货架物料绑定"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="createForm" :rules="rules" :model="bindingForm">
        <el-form-item label="物料编码" prop="material">
          <materialCodeSelect
            :created-is="true"
            :is-all-obj="true"
            :default-val="bindingForm.material"
            @changeSelect="dialogMaterialFun"
          />
        </el-form-item>
        <el-form-item label="物料名称" prop="b">
          <materialCodeSelect
            :created-is="true"
            :is-all-obj="true"
            :default-val="bindingForm.material"
            label-name="material_name"
            @changeSelect="dialogMaterialFun"
          />
        </el-form-item>
        <el-form-item
          label="库存位"
          :label-width="formLabelWidth"
          prop="location"
        >
          <inventoryPosition
            :created-is="true"
            :is-enable="true"
            :default-val="bindingForm.location"
            @changSelect="dialogInventoryPosition"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogCreateVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleCreate"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑货架物料绑定"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="editForm" :rules="rules" :model="bindingForm">
        <el-form-item label="物料编码" prop="material">
          <materialCodeSelect
            :created-is="true"
            :is-all-obj="true"
            :default-val="bindingForm.material"
            @changeSelect="dialogMaterialFun"
          />
        </el-form-item>
        <el-form-item label="物料名称" prop="b">
          <materialCodeSelect
            :created-is="true"
            :is-all-obj="true"
            :default-val="bindingForm.material"
            label-name="material_name"
            @changeSelect="dialogMaterialFun"
          />
        </el-form-item>
        <el-form-item
          label="库存位"
          :label-width="formLabelWidth"
          prop="location"
        >
          <inventoryPosition
            :created-is="true"
            :is-enable="true"
            :default-val="bindingForm.location"
            @changSelect="dialogInventoryPosition"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEdit"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMaterialLocationBinding, putMaterialLocationBinding, postMaterialLocationBinding, deleteMaterialLocationBinding } from '@/api/shelf-material-binding'
import inventoryPosition from '@/components/select_w/inventoryPosition'
import materialCodeSelect from '@/components/select_w/sparePartsMCodeSelect'
import page from '@/components/page'

export default {
  components: { inventoryPosition, page, materialCodeSelect },
  data: function() {
    return {
      formLabelWidth: 'auto',
      tableData: [],
      typeOptions: [],
      types: [],
      dialogCreateVisible: false,
      dialogEditVisible: false,
      bindingForm: {
      },
      rules: {
        material: [
          { required: true, message: '请输入物料编码', trigger: 'change' }
        ],
        b: [
          { required: true, message: '请输入物料名称', trigger: 'change' }
        ],
        location: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      getParams: {
        page: 1,
        type_name: [],
        name: ''
      },
      currentPage: 1,
      total: 1
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      getMaterialLocationBinding(this.getParams).then(response => {
        this.tableData = response.results
        this.total = response.count
      })
    },
    changeMaterialCode(obj) {
      if (obj) {
        this.getParams.material_no = obj.material_no
      } else { this.getParams.material_no = '' }
      this.getParams.page = 1
      this.getTableData()
    },
    changeMaterialName(obj) {
      if (obj) {
        this.getParams.material_name = obj.material_name
      } else { this.getParams.material_name = '' }
      this.getParams.page = 1
      this.getTableData()
    },
    changSelect(val) {
      if (val) {
        this.getParams.location_name = val.name
      } else { this.getParams.location_name = '' }
      this.getParams.page = 1
      this.getTableData()
    },
    showCreateDialog() {
      this.bindingForm = {
      }
      this.dialogCreateVisible = true
      this.$nextTick(() => {
        this.$refs.createForm.clearValidate()
      })
    },
    dialogMaterialFun(obj) {
      this.$set(this.bindingForm, 'b', obj ? obj.material_name : null)
      this.$set(this.bindingForm, 'material', obj ? obj.id : null)
      console.log(this.bindingForm)
    },
    dialogInventoryPosition(obj) {
      this.$set(this.bindingForm, 'location', obj ? obj.id : null)
      console.log(this.bindingForm)
    },
    handleCreate() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          postMaterialLocationBinding(this.bindingForm).then(response => {
            this.dialogCreateVisible = false
            this.$message('创建成功')
            this.getTableData()
          })
        }
      })
    },
    showEditDialog: function(row) {
      this.bindingForm = Object.assign({}, row)
      this.bindingForm.b = row.material_name
      this.dialogEditVisible = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    handleEdit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          putMaterialLocationBinding(this.bindingForm, this.bindingForm.id)
            .then(response => {
              this.dialogEditVisible = false
              this.$message('修改成功')
              this.getTableData()
              // this.currentChange(this.currentPage)
            })
        }
      })
    },
    handleDelete: function(row) {
      // var str = row.delete_flag ? '停用' : '启用'
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMaterialLocationBinding(row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getParams.page = 1
            this.getTableData()
          })
      })
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getTableData()
    }
  }
}
</script>
<style lang="scss">
</style>
