<template>
  <div>
    <!-- 库存位管理 备品备件里面的-->
    <el-form :inline="true">
      <el-form-item label="类型">
        <el-select
          v-model="getParams.type_name"
          multiple
          placeholder="请选择"
          @change="getTableData"
          @visible-change="visibleChange"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.global_name"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库存位">
        <inventoryPosition @changSelect="changSelect" />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-permission="['spare_location', 'add']"
          @click="showCreateDialog"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        label="No"
        width="50"
      />
      <el-table-column
        prop="type_name"
        label="类型"
      />
      <el-table-column
        prop="name"
        label="库存位"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['spare_location', 'change']"
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['spare_location', 'delete']"
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >{{ scope.row.used_flag?'停用':'启用' }}
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
      title="添加位置点"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        :model="locationForm"
        label-width="100px"
      >
        <el-form-item
          label="类型"
          prop="type"
        >
          <el-select v-model="locationForm.type" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.global_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="位置点"
          prop="name"
        >
          <el-input v-model="locationForm.name" />
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
      title="编辑位置点"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editForm"
        :rules="rules"
        :model="locationForm"
        label-width="100px"
      >
        <el-form-item
          label="类型"
          prop="type"
        >
          <el-select v-model="locationForm.type" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.global_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="位置点"
          prop="name"
        >
          <el-input v-model="locationForm.name" />
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
import { getSpareLocation, putSpareLocation, postSpareLocation, deleteSpareLocation } from '@/api/spare-location'
import inventoryPosition from '@/components/select_w/inventoryPosition'
import page from '@/components/page'
import { getGlobalCodes } from '@/api/global-codes-manage'
// import { errorRepeat } from '@/utils'

export default {
  name: 'SpareLocation',
  components: { inventoryPosition, page },
  data: function() {
    return {
      formLabelWidth: 'auto',
      tableData: [],
      typeOptions: [],
      types: [],
      dialogCreateVisible: false,
      dialogEditVisible: false,
      locationForm: {
        type: '',
        name: ''
      },
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'change' }]
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
      getSpareLocation(this.getParams).then(response => {
        this.tableData = response.results
        this.total = response.count
      })
    },
    changSelect(val) {
      if (val) {
        this.getParams.name = val.name
      } else { this.getParams.name = '' }
      this.getParams.page = 1
      this.getTableData()
    },
    getTypeOptions() {
      getGlobalCodes({ all: 1, class_name: '备品备件类型' }).then(response => {
        this.typeOptions = response.results
      })
    },
    visibleChange(visible) {
      if (visible) {
        this.getTypeOptions()
      }
    },
    showCreateDialog() {
      this.getTypeOptions()
      this.locationForm = {
        type: '',
        name: ''
      }
      this.dialogCreateVisible = true
      // this.getTypeOptions()
      this.$nextTick(() => {
        this.$refs.createForm.clearValidate()
      })
    },
    handleCreate() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          postSpareLocation(this.locationForm).then(response => {
            this.dialogCreateVisible = false
            this.$message(this.locationForm.name + '创建成功')
            this.getTableData()
          }).catch(e => {
            // errorRepeat(this, e)
          })
        }
      })
    },
    showEditDialog: function(row) {
      this.getTypeOptions()
      this.locationForm = Object.assign({}, row)
      // this.getTypeOptions()
      this.dialogEditVisible = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    handleEdit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          putSpareLocation(this.locationForm, this.locationForm.id)
            .then(response => {
              this.dialogEditVisible = false
              this.$message(this.locationForm.name + '修改成功')
              this.getTableData()
              // this.currentChange(this.currentPage)
            })
        }
      })
    },
    handleDelete: function(row) {
      var str = row.used_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSpareLocation(row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
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
