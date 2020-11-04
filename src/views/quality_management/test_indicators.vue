<template>
  <div style="margin-top: 25px">
    <el-form :inline="true">
      <el-form-item style="float: right">
        <el-button
          @click="showCreateTestIndicatorsDialog"
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
        prop="name"
        label="试验指标"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showEditTestIndicatorsDialog(scope.row)"
            >编辑</el-button>
            <!-- <el-button
                  size="mini"
                  type="danger"
                  @click="handleTestIndicatorsDelete(scope.row)"
                >删除</el-button> -->
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加试验指标"
      :visible.sync="dialogCreateTestIndicatorsVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="createTestIndicatorsForm" :rules="rules" :model="TestIndicatorsForm">
        <el-form-item
          label="试验指标"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input v-model="TestIndicatorsForm.name" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogCreateTestIndicatorsVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleCreateTestIndicators()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑试验指标"
      :visible.sync="dialogEditTestIndicatorsVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="editTestIndicatorsForm" :rules="rules" :model="TestIndicatorsForm">
        <el-form-item
          label="试验指标"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input v-model="TestIndicatorsForm.name" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditTestIndicatorsVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEditTestIndicators"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTestIndicators, postTestIndicators, putTestIndicators } from '@/api/test_indicators'
// import page from '@/components/page'
import { mapGetters } from 'vuex'
export default {
  data: function() {
    return {
      formLabelWidth: 'auto',
      tableData: [],
      dialogCreateTestIndicatorsVisible: false,
      dialogEditTestIndicatorsVisible: false,
      TestIndicatorsForm: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
    this.getTestIndicatorsList()
  },
  methods: {
    getTestIndicatorsList() {
      getTestIndicators(this.getParams).then(response => {
        this.tableData = response
      })
    },
    clearTestIndicatorsForm: function() {
      this.TestIndicatorsForm = {
        name: ''
      }
    },
    showCreateTestIndicatorsDialog: function() {
      this.clearTestIndicatorsForm()
      this.dialogCreateTestIndicatorsVisible = true
      this.$nextTick(() => {
        this.$refs.createTestIndicatorsForm.clearValidate()
      })
    },
    handleCreateTestIndicators: function() {
      this.$refs.createTestIndicatorsForm.validate((valid) => {
        if (valid) {
          postTestIndicators(this.TestIndicatorsForm)
            .then(response => {
              this.dialogCreateTestIndicatorsVisible = false
              this.$message(this.TestIndicatorsForm.name + '创建成功')
              this.getTestIndicatorsList()
            })
        }
      })
    },
    showEditTestIndicatorsDialog: function(row) {
      this.clearTestIndicatorsForm()
      this.TestIndicatorsForm = Object.assign({}, row)
      this.dialogEditTestIndicatorsVisible = true
      this.$nextTick(() => {
        this.$refs.editTestIndicatorsForm.clearValidate()
      })
    },
    handleEditTestIndicators: function() {
      this.$refs.editTestIndicatorsForm.validate((valid) => {
        if (valid) {
          putTestIndicators(this.TestIndicatorsForm, this.TestIndicatorsForm.id)
            .then(response => {
              this.dialogEditTestIndicatorsVisible = false
              this.$message(this.TestIndicatorsForm.name + '修改成功')
              this.getTestIndicatorsList()
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
