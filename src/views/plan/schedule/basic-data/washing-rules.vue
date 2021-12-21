<template>
  <div>
    <!-- 洗车规则及放置规则 -->
    <div style="width:100%;text-align:right;margin-bottom:15px;">
      <el-button type="primary" @click="showCreateDialog">新建</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="规则编号"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="规则名称"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="前规格"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="后规格"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="备注"
        min-width="20"
      />
      <el-table-column label="操作" width="130px">
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
    <el-dialog
      :title="`${formData.id?'编辑':'新建'}规则`"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="150px">
        <el-form-item label="规则编号" prop="value">
          <el-input v-model="formData.material_no" />
        </el-form-item>
        <el-form-item label="规则名称" prop="value">
          <el-input v-model="formData.material_no" />
        </el-form-item>
        <el-form-item label="前规格" prop="value">
          <el-select v-model="formData.value" placeholder="请选择">
            <el-option
              v-for="item in optionsFront"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="后规格" prop="value">
          <el-select v-model="formData.value" placeholder="请选择">
            <el-option
              v-for="item in optionsAfter"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="textarea">
          <el-input
            v-model="formData.textarea"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ScheduleWashingRules',
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      formData: {},
      rules: {
        value: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        textarea: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      optionsFront: [],
      optionsAfter: []
    }
  },
  methods: {
    showCreateDialog() {

    },
    handleClose(done) {
      this.dialogVisible = false
      this.formData = {}
      this.$refs.ruleForm.clearValidate()
      if (done) {
        done()
      }
    },
    showEditDialog() {},
    handleDelete(row) {
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
        //     this.getTableData()
        //   })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
