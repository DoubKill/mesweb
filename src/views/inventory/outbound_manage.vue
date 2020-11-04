<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="search.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="search.a" placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input v-model="search.b" />
      </el-form-item>
      <el-form-item label="仓库名称">
        <warehouseSelect />
      </el-form-item>
      <el-form-item label="物料类型">
        <materielTypeSelect />
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
        <template slot-scope="{row}">
          <el-button>{{ row }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="">
        <template slot-scope="{row}">
          {{ setOperation(row.state) }}
        </template>
      </el-table-column>
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
      <generate-normal-outbound @visibleMethod="visibleMethodNormal" /></el-dialog>
  </div>
</template>

<script>
import GenerateAssignOutbound from './components/generate_assign_outbound'
import GenerateNormalOutbound from './components/generate_normal_outbound'
import materielTypeSelect from '@/components/select_w/materielTypeSelect'
import warehouseSelect from '@/components/select_w/warehouseSelect'
export default {
  components: { GenerateAssignOutbound, GenerateNormalOutbound, materielTypeSelect, warehouseSelect },
  data() {
    return {
      search: {},
      options1: [],
      assignOutboundDialogVisible: false,
      normalOutboundDialogVisible: false
    }
  },
  methods: {
    changeDate(date) {},
    visibleMethodNormal() {
      this.normalOutboundDialogVisible = false
    },
    setOperation(val) {
      switch (val) {
        case 1:
          return '完成'
        case 2:
          return '执行中'
        case 3:
          return '失败'
        case 4:
          return '新建'
        case 5:
          return '关闭'
      }
    }
  }
}
</script>
