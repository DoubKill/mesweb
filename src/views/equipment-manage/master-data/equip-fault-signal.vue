<template>
  <div class="equip-fault-signal">
    <!-- 设备故障信号定义 -->
    <el-form :inline="true" class="search-form-style">
      <el-form-item label="设备编号">
        <el-select v-model="formInline.region" clearable placeholder="备件分类">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input v-model="formInline.user" clearable placeholder="设备名称" />
      </el-form-item>
      <el-form-item label="信号名称">
        <el-input v-model="formInline.user" clearable placeholder="信号名称" />
      </el-form-item>
      <el-form-item label="信号类别">
        <el-select v-model="formInline.region" clearable placeholder="信号类别">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="报警是否停机">
        <el-select v-model="formInline.region" clearable placeholder="信号类别">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="故障是否停机">
        <el-select v-model="formInline.region" clearable placeholder="信号类别">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="formInline.region" clearable placeholder="信号类别">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
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
        label="信号编号"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="信号名称"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="机台编号"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="机台名称"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="设备部位"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="设备部件"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="信号变量名"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="信号数据类型"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="报警下限值"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="报警上限值"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="报警持续时间（秒）"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="报警是否停机"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="报警停机描述"
        min-width="30"
      />
      <el-table-column
        prop="address"
        label="故障下限值"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="故障上限值"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="故障持续时间（秒）"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="故障是否停机"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="故障停机描述"
        min-width="30"
      />
      <el-table-column
        prop="address"
        label="是否启用"
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
      :title="`${dialogForm.id?'编辑':'新建'}设备故障信号定义`"
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
          label="信号编号"
          prop="name"
        >
          <el-input v-model="dialogForm.name" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item
          label="报警下限值"
          prop="name"
        >
          <el-input-number v-model="dialogForm.num" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item
          label="设备编号"
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
          label="报警上限值"
          prop="name"
        >
          <el-input-number v-model="dialogForm.num" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item
          label="设备名称"
          prop="name"
        >
          <el-input v-model="dialogForm.name" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item
          label="报警是否停机"
          prop="type"
        >
          <el-select v-model="dialogForm.type" placeholder="请选择">
            <el-option
              v-for="item in ['是','否']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="设备部位"
          prop="name"
        >
          <el-input v-model="dialogForm.name" disabled placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item
          label="报警停机描述"
          prop="name"
        >
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item
          label="设备部件"
          prop="name"
        >
          <el-input v-model="dialogForm.name" disabled placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item
          label="故障下限值"
          prop="name"
        >
          <el-input-number v-model="dialogForm.num" controls-position="right" :min="1" :max="10" />
        </el-form-item>
        <el-form-item
          label="信号名称"
          prop="name"
        >
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item
          label="故障上限值"
          prop="name"
        >
          <el-input-number v-model="dialogForm.num" controls-position="right" :min="1" :max="10" />
        </el-form-item>
        <el-form-item
          label="信号变量名"
          prop="name"
        >
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item
          label="报警是否停机"
          prop="type"
        >
          <el-select v-model="dialogForm.type" placeholder="请选择">
            <el-option
              v-for="item in ['是','否']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="信号数据类型"
          prop="name"
        >
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item
          label="故障停机描述"
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
  name: 'EquipmentMasterDataFaultSignal',
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
.equip-fault-signal{
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
