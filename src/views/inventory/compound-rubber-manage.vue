<template>
  <div v-loading="loading" class="app-container outbound_manage">
    <!-- 混炼胶出库计划 -->
    <el-form :inline="true">
      <el-form-item label="出库单据号">
        <el-input v-model="search.order_no" clearable placeholder="请输入内容" @input="getDebounce" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="search.status" clearable placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in optionsState"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button v-permission="['compoundRubber_plan','norman']" class="button-right" @click="normalOutbound">正常出库</el-button>
    <el-button v-permission="['compoundRubber_plan','assign']" class="button-right" @click="assignOutbound">指定出库</el-button>
    <el-button class="button-right" @click="getList">刷新</el-button>

    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        prop="id"
        label="序号"
        type="index"
        min-width="20"
      />
      <el-table-column
        prop="order_no"
        label="出库单据号"
        min-width="20"
      />
      <el-table-column
        prop="order_type"
        label="单据类型"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="创建时间"
        min-width="20"
      />
      <el-table-column
        label="状态"
        min-width="20"
        :formatter="(row)=>{
          let obj = optionsState.find(d=>d.id === row.status)
          return obj.name
        }"
      />
      <el-table-column
        prop="created_username"
        label="创建人"
        min-width="20"
      />
      <el-table-column
        label="操作"
        width="230"
      >
        <template slot-scope="{row,$index}">
          <el-button
            size="mini"
            @click="showEditDialog(row)"
          >查看</el-button>
          <div v-if="row.status === 1" style="display:inline-block">
            <el-button v-permission="['compoundRubber_plan','manual']" size="mini" type="primary" @click="manualDelivery(row,$index)">人工出库</el-button>
            <el-button v-permission="['compoundRubber_plan','close']" size="mini" type="info" @click="closePlan($index,row)">关闭</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

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
          {{ warehouseName }}
        </el-form-item>
        <el-form-item label="出库单号">
          {{ tableDataView[0]?tableDataView[0].order_no:'' }}
        </el-form-item>
        <el-form-item label="出库位置">
          {{ tableDataView[0]?tableDataView[0].station:'' }}
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loadingView"
        :data="tableDataView"
        border
      >
        <el-table-column
          prop="material_no"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="lot_no"
          label="Lot_No"
          min-width="20"
        />
        <el-table-column
          prop="pallet_no"
          label="托盘号"
          min-width="20"
        />
        <el-table-column
          prop="memo"
          label="车次"
          min-width="20"
        />
        <el-table-column
          prop="location"
          label="库位编号"
          min-width="20"
        />
        <el-table-column
          prop="status"
          label="状态"
          min-width="20"
          :formatter="(row)=>{
            let obj = optionsState1.find(d=>d.id === row.status)
            return obj.name
          }"
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
import { putPlanManagement, mixinRubberyOutboundOrder } from '@/api/base_w'
import { warehouseInfo } from '@/api/warehouse'
import page from '@/components/page'
import commitVal from '@/utils/common'
import { debounce } from '@/utils/index'
import myMixin from './components-zl-hl/mixin-zl-hl'

export default {
  name: 'CompoundManage',
  components: { page, GenerateAssignOutbound, GenerateNormalOutbound },
  mixins: [myMixin],
  data() {
    return {
      loading: false,
      search: {
        page: 1
      },
      dateSearch: [],
      total: 0,
      options1: commitVal.statusList,
      tableData: [],
      assignOutboundDialogVisible: false,
      normalOutboundDialogVisible: false,
      currentIndex: null,
      loadingBtn: false,
      rowVal: {},
      warehouseName: '混炼胶库',
      // 仓库id
      warehouseInfo: null,
      handleSelection: [],
      optionsState: [
        { name: '已创建', id: 1 },
        { name: '等待出库', id: 2 },
        { name: '已出库', id: 3 },
        { name: '关闭', id: 4 },
        { name: '失败', id: 5 }
      ],
      optionsState1: [
        { name: '完成', id: 1 },
        { name: '执行中', id: 2 },
        { name: '失败', id: 3 },
        { name: '新建', id: 4 },
        { name: '关闭', id: 5 }
      ]
    }
  },
  created() {
    this.getListWrehouseInfo()
    // this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        this.tableData = []
        const data = await mixinRubberyOutboundOrder('get', null, { params: this.search })
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
        this.getList()
      } catch (error) {
        //
      }
    },
    getDebounce() {
      debounce(this, 'changeList')
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
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
    refresList() {
      // const a = localStorage.getItem('hl-station')
      // const b = a ? JSON.parse(a) : ''
      // if (b.name === this.search.station) {
      //   return
      // }
      // this.search.station = b.name
      // this.$refs.stationInfoWarehouse.value = b.id
      // this.changeList()
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
        this.loading = true
        await mixinRubberyOutboundOrder('put', row.id, { data: { status: 2 }})
        this.$message.success('操作成功')
        this.getList()
      }).catch((error) => {
        if (error && error instanceof Array && error[0] === '出库失败') {
          this.getList()
        }
        this.loading = false
      })
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
        this.loading = true
        await mixinRubberyOutboundOrder('put', row.id, { data: { status: 4 }})
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
