<template>
  <div class="location-area-style">
    <!-- 备件代码定义 -->
    <el-form :inline="true" class="search-form-style">
      <el-form-item label="备件分类">
        <el-select v-model="formInline.region" clearable placeholder="备件分类">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备件名称">
        <el-input v-model="formInline.user" clearable placeholder="备件名称" />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input v-model="formInline.user" clearable placeholder="规格型号" />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="formInline.region" clearable placeholder="是否启用">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button size="small" type="primary" @click="onSubmit">导出Excel</el-button>
        <el-button size="small" type="primary" @click="onSubmit">导入Excel</el-button>
        <el-button size="small" type="primary" @click="onSubmit">新建</el-button>
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
        label="备件代码"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="备件名称"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="备件分类"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="规格型号"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="技术参数"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="标准单位"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="关键部件"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="库存下限"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="库存上限"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="计划价格"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="材质"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="有效期（天）"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="是否启用"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="录入人"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="录入时间"
        min-width="20"
      />
      <el-table-column label="操作" width="140px">
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
      :title="`${dialogForm.id?'编辑':'新建'}备件代码定义`"
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
          label="关键部件"
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
          label="备件代码"
          prop="name"
        >
          <el-input v-model="dialogForm.name" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item
          label="库存下限"
          prop="name"
        >
          <el-input-number v-model="dialogForm.num" controls-position="right" :min="1" :max="10" />
        </el-form-item>
        <el-form-item
          label="备件名称"
          prop="name"
        >
          <el-input v-model="dialogForm.input3" placeholder="请输入内容" disabled>
            <el-button slot="append" icon="el-icon-search" @click="showERP" />
          </el-input>
        </el-form-item>
        <el-form-item
          label="库存上限"
          prop="name"
        >
          <el-input-number v-model="dialogForm.num" controls-position="right" :min="1" :max="10" />
        </el-form-item>
        <el-form-item
          label="规格型号"
          prop="name"
        >
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item
          label="计划价格"
          prop="name"
        >
          <el-input-number v-model="dialogForm.num" controls-position="right" :min="1" :max="10" />
        </el-form-item>
        <el-form-item
          label="技术参数"
          prop="name"
        >
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item
          label="有效期（天）"
          prop="name"
        >
          <el-input-number v-model="dialogForm.num" controls-position="right" :min="1" :max="10" />
        </el-form-item>
        <el-form-item
          label="标准单位"
          prop="name"
        >
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item
          label="材质"
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
  name: 'EquipmentMasterDataSparePartsCode',
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
    showERP() {

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
