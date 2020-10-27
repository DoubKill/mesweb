<template>
  <div class="app-container">
    <h3>静态界面</h3>
    <el-row>
      <el-col :span="12">
        <el-button style="float: right" @click="handleNewType">新增</el-button>
        <el-table
          border
        >
          <el-table-column type="index" label="No" align="center" />
          <el-table-column label="处理类型" />
          <el-table-column label="操作">
            <template />
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-button style="float: right" @click="handleNewOpinion">新增</el-button>
        <el-table
          border
        >
          <el-table-column type="index" label="No" align="center" />
          <el-table-column label="处理意见" />
          <el-table-column label="操作">
            <template />
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      title="新建处理类型"
      :visible.sync="dialogDisposeTypeVisible"
    >
      <el-form ref="disposeTypeForm">
        <el-form-item label="处理类型" label-width="110px">
          <el-input />
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="新建处理意见"
      :visible.sync="dialogOpinionVisible"
    >
      <el-form ref="disposeOpinionorm">
        <el-form-item label="处理意见" label-width="110px">
          <el-input />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogDisposeTypeVisible: false,
      dialogOpinionVisible: false
    }
  },
  methods: {
    handleNewType() {
      this.dialogDisposeTypeVisible = true
    },
    handleNewOpinion() {
      this.dialogOpinionVisible = true
    }
  }
}
</script>
