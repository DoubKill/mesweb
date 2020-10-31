<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="开始时间">
        <el-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input />
      </el-form-item>
      <el-form-item label="仓库名称">
        <el-select />
      </el-form-item>
      <el-form-item label="物料类型">
        <el-select />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button @click="normalOutboundDialogVisible=true">正常出库</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button @click="assignOutboundDialogVisible=true">指定出库</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      fit
      style="width: 100%"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="生产日期" align="center" prop="" />
      <el-table-column label="仓库名称" align="center" prop="" />
      <el-table-column label="出库类型" align="center" prop="" />
      <el-table-column label="出库单号" align="center" prop="" />
      <el-table-column label="托盘号" align="center" prop="" />
      <el-table-column label="物料编码" align="center" prop="" />
      <el-table-column label="出库原因" align="center" prop="" />
      <el-table-column label="需求数量" align="center" prop="" />
      <el-table-column label="出库数量" align="center" prop="" />
      <el-table-column label="单位" align="center" prop="" />
      <el-table-column label="需求重量" align="center" prop="" />
      <el-table-column label="实际出库重量" align="center" prop="" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}" />
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="" />
      <el-table-column label="发起人" align="center" prop="" />
      <el-table-column label="发起时间" align="center" prop="" />
      <el-table-column label="完成时间" align="center" prop="" />
    </el-table>
    <el-dialog
      title="指定出库"
      :visible.sync="assignOutboundDialogVisible"
      width="80%"
    >
      <generate-assign-outbound />
    </el-dialog>
    <el-dialog
      title="正常出库"
      :visible.sync="normalOutboundDialogVisible"
    >
      <generate-normal-outbound /></el-dialog>
  </div>
</template>

<script>
import GenerateAssignOutbound from './components/generate_assign_outbound'
import GenerateNormalOutbound from './components/generate_normal_outbound'

export default {
  components: { GenerateAssignOutbound, GenerateNormalOutbound },
  data() {
    return {
      assignOutboundDialogVisible: false,
      normalOutboundDialogVisible: false
    }
  }
}
</script>
