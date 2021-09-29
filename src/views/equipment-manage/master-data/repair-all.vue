<template>
  <div class="repair-all-style">
    <!-- 维修包干定义 -->
    <el-container style="height:580px;">
      <el-aside width="400px" class="border-style aside-style">
        <h3>人员组织架构</h3>
        <el-tree :data="data" default-expand-all :props="defaultProps" @node-click="handleNodeClick" />
      </el-aside>
      <el-main v-loading="loading" class="border-style">
        <h3>维修包干设置</h3>
        <el-form :inline="true" label-width="100px">
          <el-form-item label="节点编号">
            <el-input v-model="formInline.user" disabled placeholder="规则名称" />
          </el-form-item><br>
          <el-form-item label="姓名">
            <el-input v-model="formInline.user" clearable placeholder="规则名称" />
          </el-form-item>
          <el-form-item label="职务">
            <el-input v-model="formInline.user" clearable placeholder="规则名称" />
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
        <h4>维修区域设定</h4>
        <el-button style="float:right;margin-right:20px" size="small" type="primary" @click="addFun">添加</el-button>
        <el-table
          :data="tableData"
          style="width: 90%"
          border
        >
          <el-table-column
            prop="date"
            label="机台"
            min-width="20"
          />
          <el-table-column
            prop="name"
            label="部位名称"
            min-width="20"
          />
          <el-table-column
            prop="address"
            label="区域"
            min-width="20"
          />
          <el-table-column
            label="操作"
            width="130"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleUserDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog
      :title="'添加包干区域'"
      width="400px"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <el-form ref="dialogForm" label-width="100px" :model="dialogForm" :rules="rules">
        <el-form-item label="机台:" prop="property_no">
          //
        </el-form-item>
        <el-form-item label="部位名称:" prop="type">
          <el-select v-model="dialogForm.type" placeholder="请选择">
            <el-option
              v-for="item in ['浙江','大连']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="区域:" prop="type">
          <el-select v-model="dialogForm.type" placeholder="请选择">
            <el-option
              v-for="item in ['浙江','大连']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
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
export default {
  name: 'EquipmentMasterDataRepairAll',
  data() {
    return {
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [{}],
      formInline: {},
      loading: false,
      dialogForm: {},
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      dialogVisible: false,
      btnLoading: false
    }
  },
  methods: {
    handleNodeClick() {

    },
    onSubmit() {},
    addFun() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs.dialogForm.resetFields()
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.dialogForm.validate(async(valid) => {
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
    },
    handleUserDelete() {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // propertyTypeNode('delete', data.id)
        //   .then(response => {
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功!'
        //     })
        //     this.handleClose(false)
        //     this.getTypeNode()
        //   }).catch(e => {
        //     this.$message.error('删除失败')
        //   })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.repair-all-style{
  ::-webkit-scrollbar {
    width: 1px;
  }
  ::-webkit-scrollbar-thumb {
      background: #eee
  }
  .el-main{
    padding:0;
  }
  .border-style{
    border:1px solid #eee;
    padding-left:10px;
  }
  .aside-style{
    // padding: 20px;
    margin-right:10px;
  }
  .el-input{
    width:250px;
  }
}
</style>
