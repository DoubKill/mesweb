<template>
  <div v-loading="loading" class="app-container outbound_manage">
    <el-form :inline="true" label-width="80px">
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="dateSearch"
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
        {{ warehouseName }}
        <!-- <warehouseSelect @changSelect="warehouseSelect" /> -->
      </el-form-item>
      <!-- <el-form-item label="物料类型">
        <materielTypeSelect />
      </el-form-item> -->
      <el-form-item v-permission="['inventory_plan','norman']" style="float: right">
        <el-button @click="normalOutbound">正常出库</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button v-permission="['inventory_plan','assign']" @click="assignOutbound">指定出库</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      :data="tableData"
    >
      <el-table-column label="No" type="index" align="center" width="40" />
      <el-table-column label="仓库名称" align="center" prop="name" />
      <el-table-column label="出库类型" align="center" prop="inventory_type" width="80" />
      <el-table-column label="出库单号" align="center" prop="order_no" />
      <el-table-column label="托盘号" align="center" prop="pallet_no" />
      <el-table-column label="物料编码" align="center" prop="material_no" />
      <el-table-column label="出库原因" align="center" prop="inventory_reason" width="80" />
      <el-table-column label="需求数量" align="center" prop="need_qty" width="60" />
      <el-table-column label="出库数量" align="center" prop="actual.actual_qty" />
      <el-table-column label="实际出库重量" align="center" prop="actual.actual_wegit" />
      <el-table-column label="单位" align="center" prop="unit" width="60" />
      <el-table-column label="需求重量" align="center" prop="need_weight" />
      <el-table-column label="出库位置" align="center" prop="location" />
      <el-table-column label="操作" align="center" width="220">
        <template v-if="scope.row.status === 4" slot-scope="scope">
          <el-button-group>
            <el-button v-permission="['inventory_plan','manual']" size="mini" type="primary" @click="manualDelivery(scope.row)">人工出库</el-button>
            <el-button v-permission="['inventory_plan','change']" size="mini" type="warning" @click="demandQuantity(scope.$index,scope.row)">编辑</el-button>
            <el-button v-permission="['inventory_plan','close']" size="mini" type="info" @click="closePlan(scope.$index,scope.row)">关闭</el-button>
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
      <el-table-column label="完成时间" align="center" prop="finish_time" />
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
      :before-close="handleCloseNormal"
      width="80%"
    >
      <generate-assign-outbound
        ref="assignOutbound"
        :warehouse-name="warehouseName"
        :warehouse-info="warehouseInfo"
        @visibleMethod="visibleMethodNormal"
        @visibleMethodSubmit="visibleMethodAssignSubmit"
      />
    </el-dialog>
    <el-dialog
      title="正常出库"
      :visible.sync="normalOutboundDialogVisible"
      :before-close="handleCloseNormal"
    >
      <generate-normal-outbound
        ref="normalOutbound"
        :warehouse-name="warehouseName"
        :warehouse-info="warehouseInfo"
        @visibleMethod="visibleMethodNormal"
        @visibleMethodSubmit="visibleMethodSubmit"
      /></el-dialog>
  </div>
</template>

<script>
import GenerateAssignOutbound from './components/generate_assign_outbound'
import GenerateNormalOutbound from './components/generate_normal_outbound'
// import materielTypeSelect from '@/components/select_w/materielTypeSelect'
// import warehouseSelect from '@/components/select_w/warehouseSelect'
import { putPlanManagement } from '@/api/base_w'
import { warehouseInfo } from '@/api/warehouse'
import page from '@/components/page'
import commitVal from '@/utils/common'
import { setDate } from '@/utils/index'

export default {
  components: { page, GenerateAssignOutbound, GenerateNormalOutbound },
  data() {
    return {
      loading: false,
      search: {
        page: 1
      },
      dateSearch: [setDate(), setDate()],
      dialogVisible: false,
      total: 0,
      options1: commitVal.statusList,
      tableData: [],
      assignOutboundDialogVisible: false,
      normalOutboundDialogVisible: false,
      currentIndex: null,
      demandQuantityVal: '',
      loadingBtn: false,
      rowVal: {},
      warehouseName: '终炼胶库',
      // 仓库id
      warehouseInfo: null
    }
  },
  created() {
    this.search.st = setDate()
    this.search.et = setDate()
    this.getListWrehouseInfo()
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        this.tableData = []
        const data = await putPlanManagement('get', null, { params: this.search })
        this.total = data.count
        this.tableData = data.results
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    async getListWrehouseInfo() {
      try {
        const data = await warehouseInfo({ all: 1, name: this.warehouseName })
        this.warehouseInfo = data[0].id
      } catch (error) {
        //
      }
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    warehouseSelect(val) {
    //   this.search.page = 1
    //   this.search.name = this.warehouseName
    //   this.getList()
    },
    handleCloseNormal(done) {
      if (this.$refs.normalOutbound) {
        this.$refs.normalOutbound.creadVal()
      }
      if (this.$refs.assignOutbound) {
        this.$refs.assignOutbound.creadVal()
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
    async visibleMethodSubmit(val) {
      try {
        await putPlanManagement('post', null, { data: [val] })
        this.$message.success('操作成功')
        this.normalOutboundDialogVisible = false
        this.getList()
        this.$refs.normalOutbound.loadingBtn = false
        this.$refs.normalOutbound.creadVal()
      } catch (error) {
        this.$refs.normalOutbound.loadingBtn = false
      }
    },
    async visibleMethodAssignSubmit(val) {
      try {
        await putPlanManagement('post', null, { data: val })
        this.$message.success('操作成功')
        this.assignOutboundDialogVisible = false
        this.$refs.assignOutbound.creadVal()
        this.getList()
      } catch (error) {
        this.$refs.assignOutbound.loadingBtn = false
      }
    },
    handleClose(done) {
      done()
    },
    normalOutbound() {
      this.normalOutboundDialogVisible = true
    },
    assignOutbound() {
      this.assignOutboundDialogVisible = true
    },
    async submitDemandQuantity() {
      try {
        const row = this.tableData[this.currentIndex]
        if (!this.demandQuantityVal && this.demandQuantityVal !== 0) {
          this.$message.info('需求数量不可为空')
          return
        }
        const obj = {
          inventory_type: 3333,
          need_qty: this.demandQuantityVal,
          order_no: 'order_no',
          warehouse_info: row.warehouse_info
        }
        this.loadingBtn = true
        await putPlanManagement('put', row.id, { data: obj })
        this.dialogVisible = false
        this.loadingBtn = false
        this.getList()
      } catch (error) {
        this.loadingBtn = false
      }
    },
    manualDelivery(row) {
      this.$confirm(
        '确定出库?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        const obj = {
          warehouse_info: row.warehouse_info,
          inventory_type: row.inventory_type,
          order_no: row.order_no,
          material_no: row.material_no,
          wegit: row.need_weight || '',
          created_date: row.created_date,
          pallet_no: row.pallet_no || '',
          inventory_reason: row.inventory_reason || ''
        }
        this.loading = true
        await putPlanManagement('put', row.id, { data: obj })
        this.$message.success('操作成功')
        this.getList()
      }).catch(() => {
        this.loading = false
      })
    },
    demandQuantity(index, row) {
      this.currentIndex = index
      this.dialogVisible = true
      this.demandQuantityVal = row.need_qty || ''
    },
    closePlan(index, row) {
      this.$confirm(
        '确定关闭?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        const obj = {
          status: 5,
          order_no: 'order_no',
          warehouse_info: this.warehouseInfo
        }
        this.loading = true
        await putPlanManagement('put', row.id, { data: obj })
        this.$message.success('操作成功')
        this.getList()
      }).catch(() => {
        this.loading = false
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
