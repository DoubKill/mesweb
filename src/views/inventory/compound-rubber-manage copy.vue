<template>
  <div v-loading="loading" class="app-container outbound_manage">
    <!-- 混炼胶出库计划 -->
    <el-form :inline="true" label-width="80px">
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="dateSearch"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
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
      <el-form-item label="出库位置">
        <stationInfoWarehouse
          ref="stationInfoWarehouse"
          :warehouse-name="warehouseName"
          :is-clear="true"
          :created-is="true"
          @changSelect="selectStation"
        />
      </el-form-item>
      <el-form-item label="仓库名称">
        {{ warehouseName }}
        <!-- <warehouseSelect @changSelect="warehouseSelect" /> -->
      </el-form-item>
      <!-- <el-form-item label="物料类型">
        <materielTypeSelect />
      </el-form-item> -->
    </el-form>
    <el-button v-permission="['compoundRubber_plan','norman']" class="button-right" @click="normalOutbound">正常出库</el-button>
    <el-button v-permission="['compoundRubber_plan','assign']" class="button-right" @click="assignOutbound">指定出库</el-button>
    <!-- <el-button
      v-permission="['compoundRubber_plan','manual']"
      class="button-right"
      @click="manualDeliveryBatch"
    >批量人工出库</el-button> -->
    <el-button class="button-right" @click="getList">刷新</el-button>

    <el-table
      border
      :data="tableData"
      size="mini"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="No" type="index" align="center" width="30" />
      <el-table-column type="selection" width="40" />
      <el-table-column label="仓库名称" align="center" prop="name" min-width="10" />
      <el-table-column label="出库类型" align="center" prop="inventory_type" min-width="10" />
      <el-table-column label="出库单号" align="center" prop="order_no" min-width="10" />
      <el-table-column label="托盘号" align="center" prop="pallet_no" min-width="10" />
      <el-table-column label="物料编码" align="center" prop="material_no" min-width="10" />
      <el-table-column label="出库原因" align="center" prop="inventory_reason" min-width="10" />
      <el-table-column label="需求数量" align="center" prop="need_qty" min-width="10" />
      <el-table-column label="库位信息" align="center" prop="location" min-width="10" />
      <el-table-column label="出库数量" align="center" prop="actual.actual_qty" min-width="10" />
      <el-table-column label="实际出库重量" align="center" prop="actual.actual_wegit" min-width="10" />
      <el-table-column label="单位" align="center" prop="unit" min-width="10" />
      <el-table-column label="需求重量" align="center" prop="need_weight" min-width="10" />
      <el-table-column label="出库位置" align="center" prop="station" min-width="10" />
      <el-table-column label="目的地" align="center" prop="destination" min-width="10" />
      <el-table-column label="操作" align="center" width="210">
        <template v-if="scope.row.status === 4" slot-scope="scope">
          <el-button-group>
            <el-button v-permission="['compoundRubber_plan','manual']" size="mini" type="primary" @click="manualDelivery(scope.row)">人工出库</el-button>
            <!-- <el-button v-permission="['compoundRubber_plan','change']" size="mini" type="warning" @click="demandQuantity(scope.$index,scope.row)">编辑</el-button> -->
            <el-button v-permission="['compoundRubber_plan','close']" size="mini" type="info" @click="closePlan(scope.$index,scope.row)">关闭</el-button>
          </el-button-group>
          <!-- <el-button-group style="margin-top:5px">
            <el-button size="mini" @click="viewPlan(scope.$index,scope.row)">查看</el-button>
            <el-button size="mini" type="danger" @click="forcedEndPlan(scope.$index,scope.row)">强制结束</el-button>
          </el-button-group> -->
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="" min-width="10">
        <template slot-scope="{row}">
          {{ setOperation(row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="发起人" align="center" prop="created_user" min-width="10" />
      <el-table-column label="发起时间" align="center" prop="created_date" min-width="10" />
      <el-table-column label="完成时间" align="center" prop="finish_time" min-width="10" />
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
      width="90%"
    >
      <generate-assign-outbound
        ref="assignOutbound"
        :warehouse-name="warehouseName"
        :warehouse-info="warehouseInfo"
        :show="assignOutboundDialogVisible"
        @visibleMethod="visibleMethodNormal"
        @visibleMethodSubmit="visibleMethodAssignSubmit"
      />
    </el-dialog>
    <el-dialog
      title="正常出库"
      :visible.sync="normalOutboundDialogVisible"
      :before-close="handleCloseNormal"
      width="90%"
    >
      <generate-normal-outbound
        ref="normalOutbound"
        :warehouse-name="warehouseName"
        :warehouse-info="warehouseInfo"
        :show="normalOutboundDialogVisible"
        @visibleMethod="visibleMethodNormal"
        @visibleMethodSubmit="visibleMethodSubmit"
        @refresList="refresList"
      /></el-dialog>

    <el-dialog
      title="出库单据"
      :visible.sync="dialogVisibleView"
      width="50%"
      :before-close="handleCloseView"
    >
      <el-form :inline="true">
        <el-form-item label="仓库名称">
          {{}}
        </el-form-item>
        <el-form-item label="出库单号">
          {{}}
        </el-form-item>
        <el-form-item label="出库位置">
          {{}}
        </el-form-item>
      </el-form>
      <el-table
        :data="tableDataView"
        border
      >
        <el-table-column
          prop="date"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="Lot_No"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="托盘号"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="车次"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="库位编号"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="状态"
          min-width="20"
        />
      </el-table>
      <page
        :old-page="false"
        :total="totalView"
        :current-page="searchView.page"
        @currentChange="currentChangeView"
      />
    </el-dialog>
  </div>
</template>

<script>
import GenerateAssignOutbound from './components-zl-hl/generate_assign_outbound'
import GenerateNormalOutbound from './components-zl-hl/generate_normal_outbound'
import { putPlanManagement } from '@/api/base_w'
import { warehouseInfo } from '@/api/warehouse'
import page from '@/components/page'
import commitVal from '@/utils/common'
import { setDate } from '@/utils/index'
import stationInfoWarehouse from '@/components/select_w/warehouseSelectPosition'
import myMixin from './components-zl-hl/mixin-zl-hl'

export default {
  name: 'CompoundManage',
  components: { page, GenerateAssignOutbound, GenerateNormalOutbound, stationInfoWarehouse },
  mixins: [myMixin],
  data() {
    return {
      loading: false,
      search: {
        page: 1
      },
      dateSearch: [],
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
      warehouseName: '混炼胶库',
      // 仓库id
      warehouseInfo: null,
      handleSelection: []
    }
  },
  created() {
    const start = new Date()
    const oneDate = start.getTime() + 3600 * 1000 * 24
    this.search.st = setDate()
    this.search.et = setDate(oneDate)
    this.dateSearch = [this.search.st + ' 00:00:00', this.search.et + ' 23:59:59']

    this.getListWrehouseInfo()
    // this.getList()
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
      this.changeList()
    },
    refresList() {
      const a = localStorage.getItem('hl-station')
      const b = a ? JSON.parse(a) : ''
      if (b.name === this.search.station) {
        return
      }
      this.search.station = b.name
      this.$refs.stationInfoWarehouse.value = b.id
      this.changeList()
    },
    selectStation(val) {
      this.search.station = val ? val.name : ''
      if (this.search.station) {
        const obj = { name: val.name, id: val.id }
        localStorage.setItem('hl-station', JSON.stringify(obj))
      }
      this.changeList()
    },
    visibleMethodNormal() {
      this.normalOutboundDialogVisible = false
      this.assignOutboundDialogVisible = false
    },
    async visibleMethodSubmit(val) {
      try {
        await putPlanManagement('post', null, { data: val })
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
    handleSelectionChange(val) {
      this.handleSelection = val
    },
    manualDeliveryBatch() {
      if (this.handleSelection.length === 0) {
        return
      }
      const arr = this.handleSelection.filter(D => D.status !== 4)
      if (arr.length !== 0) {
        this.$message.info('选中的有出过库的')
        return
      }
      let _i = 0
      this.handleSelection.forEach(async(row, i) => {
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
        try {
          await putPlanManagement('put', row.id, { data: obj })
          _i++
          if (_i === this.handleSelection.length) {
            this.getList()
          }
        } catch (e) {
          this.getList()
        }
      })
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
