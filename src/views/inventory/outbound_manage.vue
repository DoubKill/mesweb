<template>
  <div v-loading="loading" class="app-container outbound_manage">
    <el-form :inline="true">
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="search.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select
          v-model="search.status"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in options1"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input v-model="search.material_no" @input="changeList" />
      </el-form-item>
      <el-form-item label="仓库名称">
        <warehouseSelect @changSelect="warehouseSelect" />
      </el-form-item>
      <!-- <el-form-item label="物料类型">
        <materielTypeSelect />
      </el-form-item> -->
      <el-form-item style="float: right">
        <el-button @click="normalOutbound">正常出库</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button @click="assignOutbound">指定出库</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      fit
      style="width: 100%"
      :data="tableData"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="仓库名称" align="center" prop="name" />
      <el-table-column label="出库类型" align="center" prop="inventory_type" />
      <el-table-column label="出库单号" align="center" prop="order_no" />
      <el-table-column label="托盘号" align="center" prop="pallet_no" />
      <el-table-column label="物料编码" align="center" prop="material_no" />
      <el-table-column label="出库原因" align="center" prop="inventory_reason" />
      <el-table-column label="需求数量" align="center" prop="need_qty" />
      <el-table-column label="出库数量" align="center" prop="actual.actual_qty" />
      <el-table-column label="实际出库重量" align="center" prop="actual.actual_wegit" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="需求重量" align="center" prop="need_weight" />
      <el-table-column label="操作" align="center" width="220">
        <template v-if="scope.row.status === 1" slot-scope="scope">
          <!-- 记得改成4 新建的 才能操作 -->
          <el-button-group>
            <el-button size="mini" type="primary" @click="manualDelivery">人工出库</el-button>
            <el-button size="mini" type="warning" @click="demandQuantity(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" type="info" @click="closePlan">关闭</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="">
        <template slot-scope="{row}">
          {{ setOperation(row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="发起人" align="center" prop="created_user" />
      <el-table-column label="发起时间" align="center" prop="created_date" />
      <el-table-column label="完成时间" align="center" prop="last_updated_date" />
    </el-table>
    <page
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :inline="true">
        <el-form-item label="需求数量">
          <el-input v-model="demandQuantityVal" placeholder="需求数量" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitDemandQuantity">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="指定出库"
      :visible.sync="assignOutboundDialogVisible"
      width="80%"
    >
      <generate-assign-outbound @visibleMethod="visibleMethodNormal" />
    </el-dialog>
    <el-dialog
      title="正常出库"
      :visible.sync="normalOutboundDialogVisible"
      :before-close="handleCloseNormal"
    >
      <generate-normal-outbound ref="normalOutbound" :warehouseval="search.name" @visibleMethod="visibleMethodNormal" /></el-dialog>
  </div>
</template>

<script>
import GenerateAssignOutbound from './components/generate_assign_outbound'
import GenerateNormalOutbound from './components/generate_normal_outbound'
// import materielTypeSelect from '@/components/select_w/materielTypeSelect'
import warehouseSelect from '@/components/select_w/warehouseSelect'
import { putPlanManagement } from '@/api/base_w'
import page from '@/components/page'
import commitVal from '@/utils/common'
export default {
  components: { page, GenerateAssignOutbound, GenerateNormalOutbound, warehouseSelect },
  data() {
    return {
      loading: false,
      search: {
        page: 1
      },
      dialogVisible: false,
      total: 0,
      options1: commitVal.statusList,
      tableData: [],
      assignOutboundDialogVisible: false,
      normalOutboundDialogVisible: false,
      currentIndex: null,
      demandQuantityVal: '',
      loadingBtn: false,
      rowVal: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await putPlanManagement('get', null, { params: this.search })
        this.total = data.count
        this.tableData = data.results
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    warehouseSelect(val) {
      this.search.page = 1
      this.search.name = val
      this.getList()
    },
    handleCloseNormal(done) {
      if (this.$refs.normalOutbound) {
        this.$refs.normalOutbound.creadVal()
      }
      done()
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    changeDate(date) {
      this.search.st = date ? date[0] : ''
      this.search.et = date ? date[1] : ''
      this.getList()
      this.search.page = 1
    },
    visibleMethodNormal() {
      this.normalOutboundDialogVisible = false
      this.assignOutboundDialogVisible = false
    },
    handleClose(done) {
      done()
    },
    normalOutbound() {
      if (!commitVal.normalOutboundSwitch) {
        this.$message.info('该功能wms暂时无法使用')
        return
      }
      this.normalOutboundDialogVisible = true
    },
    assignOutbound() {
      this.assignOutboundDialogVisible = true
    },
    async submitDemandQuantity() {
      try {
        this.loadingBtn = true
        // const data = await putPlanManagement('get', null, { params: this.search })
        this.dialogVisible = false
        this.getList()
      } catch (error) {
        this.loadingBtn = false
      }
    },
    manualDelivery() {
      this.$confirm(
        '确定出库?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        // await matTestMethods('delete', row.id)
        this.$message.success('操作成功')
        this.getList()
      }).catch(() => {
        //
      })
    },
    demandQuantity(index, row) {
      this.currentIndex = index
      this.dialogVisible = true
      this.demandQuantityVal = row.need_qty || ''
    },
    closePlan() {
      this.$confirm(
        '确定关闭?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        // await matTestMethods('delete', row.id)
        this.$message.success('操作成功')
        this.getList()
      }).catch(() => {
        //
      })
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
<style lang="scss">
  .outbound_manage{
    .el-dialog{
      min-width: 500px !important;
    }
  }
</style>
