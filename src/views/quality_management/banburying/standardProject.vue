<template>
  <div>
    <!-- 公差标准项目关键字 -->
    <el-form :inline="true">
      <el-form-item style="float:right">
        <el-button type="primary" @click="showCreateDialog">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="component_type_code"
        label="项目关键字编号"
      />
      <el-table-column
        prop="component_type_name"
        label="项目关键字名称"
      />
      <el-table-column
        prop="created_username"
        label="指定规格"
      />
      <el-table-column
        prop="created_date"
        label="备注"
      />
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            plain
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新建项目关键字"
      width="30%"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="createForm" :rules="rules" :model="dialogForm" label-width="150px">
        <el-form-item
          label="项目关键字编号"
          prop="component_type_code"
        >
          <el-input v-model="dialogForm.component_type_code" style="width:250px" disabled />
        </el-form-item>
        <el-form-item
          label="项目关键字名称"
          prop="component_type_name"
        >
          <el-input v-model="dialogForm.component_type_name" style="width:250px" />
        </el-form-item>
        <el-form-item label="指定规格" prop="submission_department">
          <el-input v-model="dialogForm.component_type_name" style="width:250px" />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="component_type_name"
        >
          <el-input v-model="dialogForm.component_type_name" style="width:250px" />
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
  </div>
</template>

<script>
import { equipComponentType } from '@/api/jqy'

export default {
  name: 'BanburyingStandardProject',
  data: function() {
    return {
      tableData: [],
      dialogCreateVisible: false,
      dialogEditVisible: false,
      btnExportLoad: false,
      dialogForm: {
        no: '',
        name: ''
      },
      loading: false,
      rules: {
        component_type_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        component_type_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipComponentType('get', null, { params: {}})
        this.tableData = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changSelect() {
      this.getList()
    },
    showCreateDialog() {
      this.dialogForm = {
        component_type_code: '',
        component_type_name: ''
      }
      this.dialogCreateVisible = true
    },
    handleCreate() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          equipComponentType('post', null, { data: this.dialogForm }).then(response => {
            this.dialogCreateVisible = false
            this.$message.success('创建成功')
            this.getList()
          }).catch(e => {
            // errorRepeat(this, e)
          })
        }
      })
    },
    handleDelete: function(row) {
      this.$confirm('此操作将删除' + row.component_type_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipComponentType('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    }
  }
}
</script>
<style lang="scss">
</style>
