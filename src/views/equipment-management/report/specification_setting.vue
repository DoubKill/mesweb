<template>
  <div class="specificationSetting">
    <!-- 丁基胶 规格设定 -->
    <el-form :inline="true">
      <el-form-item label="胶料名称">
        <el-input v-model="search.product_name" clearable placeholder="胶料名称" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-input v-model="search.product_no" clearable placeholder="胶料编码" @input="changeSearch" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['equip_part', 'add']" type="primary" @click="onSubmit">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="product_name"
        label="胶料名称"
        min-width="20"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="创建人员"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="创建时间"
        min-width="20"
      />
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['equip_part', 'change']"
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['equip_part', 'delete']"
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`${dialogForm.id?'编辑':'新建'}丁基胶 详情`"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="120px"
        :model="dialogForm"
      >
        <el-form-item
          label="胶料名称"
          prop="product_name"
        >
          <el-input v-model="dialogForm.product_name" />
        </el-form-item>
        <el-form-item
          label="胶料编码"
          prop="product_no"
        >
          <el-input v-model="dialogForm.product_no" />
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
import { productInfoDj } from '@/api/jqy'
export default {
  name: 'SpecificationSetting',
  components: { page },
  data() {
    return {
      search: {},
      tableData: [],
      total: 0,
      loading: false,
      dialogVisible: false,
      rules: {
        product_no: [{ required: true, message: '不能为空', trigger: 'blur' }],
        product_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
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
        const data = await productInfoDj('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeSearch() {
      this.search.page = 1
      this.$debounce(this, 'getList')
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    },
    onSubmit() {
      this.dialogForm = {}
      this.dialogVisible = true
    },
    showEditDialog(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleDelete: function(row) {
      this.$confirm('此操作将删除' + row.product_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        productInfoDj('delete', row.id, {})
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
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.dialogForm.id ? 'put' : 'post'
            await productInfoDj(_api, this.dialogForm.id || null, { data: this.dialogForm })
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
.specificationSetting{
  .el-input{
    width:160px;
  }
  .el-dialog .el-input{
    width:250px;
  }
}
</style>
