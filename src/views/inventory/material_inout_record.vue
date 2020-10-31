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
      <el-form-item label="类型">
        <el-select />
      </el-form-item>
      <el-form-item label="库存位置">
        <el-select />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input />
      </el-form-item>
    </el-form>
    <el-table
      border
      fit
      style="width: 100%"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="类型" align="center" prop="" />
      <el-table-column label="出入库单号" align="center" prop="" />
      <el-table-column label="仓库类型" align="center" prop="" />
      <el-table-column label="托盘号" align="center" prop="" />
      <el-table-column label="物料编码" align="center" prop="" />
      <el-table-column label="出入库原因" align="center" prop="" />
      <el-table-column label="出入库类型" align="center" prop="" />
      <el-table-column label="出入库数" align="center" prop="" />
      <el-table-column label="单位" align="center" prop="" />
      <el-table-column label="重量" align="center" prop="" />
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