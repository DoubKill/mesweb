<template>
  <div class="fault-classify">
    <!-- 设备故障分类管理 -->
    <el-form :inline="true">
      <el-form-item label="故障大类名称">
        <el-input v-model="formInline.user" clearable placeholder="故障大类名称" />
      </el-form-item>
      <el-form-item label="故障代码">
        <el-input v-model="formInline.user" clearable placeholder="故障代码" />
      </el-form-item>
      <el-form-item label="故障名称">
        <el-input v-model="formInline.user" clearable placeholder="故障名称" />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="formInline.region" clearable placeholder="是否启用">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="onSubmit">导出Excel</el-button>
        <el-button type="primary" @click="onSubmit">导入Excel</el-button>
        <el-button type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="date"
        label="故障大类代码"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="故障大类名称"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="分类代码"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="分类名称"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="是否启用"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="录入者"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="录入时间"
        min-width="20"
      />
      <el-table-column label="操作" width="200px">
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
            >{{ scope.row.used_flag?'停用':'启用' }}
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
      :title="`${dialogForm.id?'编辑':'新建'}设备部位定义`"
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
          label="故障大类代码"
          prop="type"
        >
          <el-select v-model="dialogForm.type" placeholder="请选择">
            <el-option
              v-for="item in ['浙江','大连']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="故障大类名称"
          prop="name"
        >
          <el-input v-model="dialogForm.name" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item
          label="故障分类代码"
          prop="name"
        >
          <el-input v-model="dialogForm.name" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item
          label="故障分类名称"
          prop="name"
        >
          <el-input v-model="dialogForm.name" />
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
export default {
  name: 'EquipmentMasterDataFaultClassify',
  components: { page },
  data() {
    return {
      formInline: {},
      tableData: [{}],
      total: 0,
      loading: false,
      dialogVisible: false,
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      dialogForm: {},
      btnLoading: false
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await testIndicators('get', null, { all: 1 })
        // this.tableData = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    currentChange(page, pageSize) {
      this.formInline.page = page
      this.formInline.page_size = pageSize
      this.getList()
    },
    onSubmit() {
      this.dialogVisible = true
    },
    showEditDialog() {
      this.dialogVisible = true
    },
    handleDelete: function(row) {
      var str = row.used_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteLocation(row.id)
        //   .then(response => {
        //     this.$message({
        //       type: 'success',
        //       message: '操作成功!'
        //     })
        //     this.getList()
        //   })
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
            // const _api = this.bindingForm.id ? 'put' : 'post'
            // await equipPart(_api, this.bindingForm.id || null, { data: this.bindingForm })
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
.fault-classify{
  .el-input{
    width:160px;
  }
  .el-dialog .el-input{
    width:250px;
  }
}
</style>
