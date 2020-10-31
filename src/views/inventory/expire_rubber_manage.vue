<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="生产日期选择">
        <el-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select />
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-input />
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      border
      fit
      style="width: 100%"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="生产日期" align="center" prop="" />
      <el-table-column label="lot追踪号" align="center" prop="" />
      <el-table-column label="班次" align="center" prop="" />
      <el-table-column label="机台" align="center" prop="" />
      <el-table-column label="胶料编码" align="center" prop="" />
      <el-table-column label="检测结果" align="center" prop="" />
      <el-table-column label="等级" align="center" prop="" />
      <el-table-column label="过期时间" align="center" prop="" />
      <el-table-column label="超时时间" align="center" prop="" />
      <el-table-column label="状态" align="center" prop="" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button @click="dialogFormVisible=true">处理</el-button>
        </template>
      </el-table-column>
      <el-table-column label="处理结果" align="center" prop="" />
      <el-table-column label="处理人" align="center" prop="" />
    </el-table>
    <el-dialog
      title="处理弹框"
      :visible.sync="dialogFormVisible"
    >
      <el-form>
        <el-form-item label="处理">
          <el-select />
        </el-form-item>
        <el-form-item label="出库">
          <el-checkbox />
        </el-form-item>
        <el-form-item>
          <el-button>新建处理意见</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [{}],
      dialogFormVisible: false
    }
  }
}
</script>