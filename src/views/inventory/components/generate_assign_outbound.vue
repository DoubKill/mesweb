<template>
  <div v-loading="loading" class="app-container">
    <!-- 指定出库 -->
    <el-form :inline="true">
      <el-form-item label="仓库名称">
        {{ warehouseName }}
        <!-- <warehouseSelect @changSelect="warehouseSelect" /> -->
      </el-form-item>
      <el-form-item v-if="['帘布库出库计划','炭黑出库计划','原材料出库计划'].includes($route.meta.title)" label="物料名称">
        <materialCodeSelect
          :store-name="warehouseName"
          :is-clearable="true"
          label-show="material_name"
          @changSelect="materialCodeFun"
        />
      </el-form-item>
      <el-form-item v-else label="物料编码">
        <materialCodeSelect
          :store-name="warehouseName"
          :is-clearable="true"
          @changSelect="materialCodeFun"
        />
      </el-form-item>
      <el-form-item label="库存位">
        <el-input v-model="getParams.location" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="托盘号">
        <el-input v-model="getParams.container_no" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="品质状态">
        <el-select
          v-model="getParams.quality_status"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="巷道">
        <el-input v-model="getParams.tunnel" @input="changeSearchTunnel" />
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      border
      style="width: 100%"
      :data="tableData"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
      />
      <!-- <el-table-column label="No" type="index" align="center" /> -->
      <el-table-column label="物料类型" align="center" prop="material_type" />
      <el-table-column label="物料编码" align="center" prop="material_no" />
      <el-table-column v-if="['帘布库出库计划','炭黑出库计划','原材料出库计划'].includes($route.meta.title)" label="物料名称" align="center" prop="material_name" />
      <el-table-column label="lot" align="center" prop="lot_no" />
      <el-table-column label="托盘号" align="center" prop="container_no" />
      <el-table-column label="库存位" align="center" prop="location" />
      <el-table-column
        v-if="warehouseName === '终炼胶库'"
        width="60"
        label="车数"
        align="center"
        prop=""
      >
        <template slot-scope="{row}">
          {{ row.qty }}
        </template>
      </el-table-column>
      <el-table-column label="总重量" align="center" prop="total_weight" />
      <el-table-column
        label="品质状态"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="['帘布库出库计划','原材料出库计划','炭黑出库计划'].includes($route.meta.title)">{{ row.quality_status }}</span>
          <span v-else>{{ row.quality_level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库时间" align="center" prop="in_storage_time" />
      <el-table-column v-if="!['原材料出库计划'].includes($route.meta.title)" label="机台号" width="50" align="center" prop="equip_no" />
      <el-table-column v-if="!['原材料出库计划','终炼胶出库计划'].includes($route.meta.title)" label="车号" align="center" prop="memo" />
      <el-table-column v-if="['终炼胶出库计划'].includes($route.meta.title)" label="车次" align="center" prop="memo" />
      <el-table-column label="货位状态" align="center" prop="location_status" />
      <el-table-column label="出库口选择" align="center">
        <template slot-scope="scope">
          <stationInfoWarehouse
            :warehouse-name="warehouseName"
            :start-using="true"
            :default-val="scope.row.station_no"
            :assign-type="true"
            :created-is="true"
            :options-list="optionsList"
            :raw-material="rawMaterial"
            :druss-delivery="drussDelivery"
            @changSelect="selectStation($event,scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="$route.meta.title==='终炼胶出库计划'" label="关联发货计划" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.deliveryPlan }}
          <el-button size="mini" type="primary" @click="deliverClick(scope.row,scope.$index)">添加发货计划</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="$route.meta.title==='混炼胶出库计划'" label="机台号" align="center" min-width="100">
        <template slot-scope="scope">
          <EquipSelect equip-type="密炼设备" :is-multiple="true" @equipSelected="equipSelected($event,scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="visibleMethod(true)">取 消</el-button>
      <el-button type="primary" :loading="loadingBtn" @click="visibleMethod(false)">确 定</el-button>
    </div>

    <el-dialog
      title="发货计划管理"
      :visible.sync="dialogVisible"
      width="90%"
      append-to-body
    >
      <receiveList
        ref="receiveList"
        :show="dialogVisible"
        :is-dialog="true"
        :defalut-val="handleSelection"
        :material-no="material_no_current"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureDeliveryPlan">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import warehouseSelect from '@/components/select_w/warehouseSelect'
import { getMaterialInventoryManage } from '@/api/material-inventory-manage'
// import materielTypeSelect from '@/components/select_w/materielTypeSelect'
import page from '@/components/page'
import stationInfoWarehouse from '@/components/select_w/warehouseSelectPosition'
import receiveList from '../receive-good-manage/receive-list.vue'
import EquipSelect from '@/components/EquipSelect'
import materialCodeSelect from '@/components/select_w/materialCodeSelect'
import { debounce } from '@/utils'
import { stationInfo, stationInfoRawMaterial, drussPlanManagementStations } from '@/api/warehouse'
export default {
  components: { materialCodeSelect, EquipSelect, page, stationInfoWarehouse, receiveList },
  props: {
    warehouseName: {
      type: String,
      default: ''
    },
    warehouseInfo: {
      type: Number,
      default: null
    },
    rawMaterial: {
      type: Boolean,
      default: false
    },
    drussDelivery: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [],
      getParams: {
        page: 1,
        location_status: '有货货位',
        material_type: '', // 物料类型
        material_no: '', // 物料编号
        container_no: '', // 托盘号
        warehouse_name: this.warehouseName // 仓库名称
      },
      currentPage: 1,
      total: 0,
      options: ['终炼胶库', '混炼胶库'].includes(this.warehouseName) ? ['一等品', '三等品'] : ['合格品', '不合格品'],
      loading: false,
      multipleSelection: [],
      loadingBtn: false,
      dialogVisible: false,
      material_no_current: '',
      currentIndex: null,
      handleSelection: [],
      optionsList: []
    }
  },
  computed: {
  },
  watch: {
    show(bool) {
      if (bool) {
        this.getParams = {
          location_status: '有货货位',
          warehouse_name: this.warehouseName
        }
        this.tableData = []
        this.getTableData()
      }
    }
  },
  created() {
    this.getTableData()
    this.getWarehouseSelectPosition()
  },
  methods: {
    getTableData() {
      this.loading = true
      getMaterialInventoryManage(this.getParams)
        .then(response => {
          this.tableData = response.results
          this.total = response.count
          this.tableData.forEach(D => {
            // _DeliveryPlan 放发货计划
            this.$set(D, '_DeliveryPlan', [])
            let arr
            if (this.multipleSelection.length > 0) {
              arr = this.multipleSelection.filter(d =>
                (this.rawMaterial || this.drussDelivery) ? d.sn === D.sn : d.id === D.id)
            }

            if (arr.length > 0) {
              this.$nextTick(() => {
                this.$set(D, 'station', arr[0].station)
                this.$set(D, 'station_no', arr[0].station_no)
              })
            }
          })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    },
    async getWarehouseSelectPosition() {
      try {
        if (!this.warehouseName) {
          this.optionsList = []
          return
        }
        let _api
        if (this.rawMaterial) {
          _api = stationInfoRawMaterial
        } else if (this.drussDelivery) {
          _api = drussPlanManagementStations
        } else {
          _api = stationInfo
        }
        const data = await _api({ all: 1, warehouse_name: this.warehouseName })
        this.optionsList = data || []
      } catch (e) {
        //
      }
    },
    currentChange(page) {
      this.currentPage = page
      this.getParams.page = page
      this.getTableData()
    },
    changeSearch() {
      this.getParams.page = 1
      this.getTableData()
    },
    changeSearchTunnel() {
      debounce(this, 'changeSearch')
    },
    materialCodeFun(val) {
      this.getParams.material_no = val ? val.material_no : ''
      this.changeSearch()
    },
    changeMaterialType(data) {
      this.getParams.material_type = data
      this.getParams.page = 1
      this.getTableData()
    },
    warehouseSelect(val) {
      this.getParams.page = 1
      this.getParams.warehouse_name = val
      this.getTableData()
    },
    creadVal() {
      this.$refs.multipleTable.clearSelection()
      this.loadingBtn = false
      this.multipleSelection = []
      this.tableData.forEach(D => {
        D.equipNoArr = null
        D._DeliveryPlan = null
        D.deliveryPlan = null
        D.station = null
        D.station_no = null
      })
    },
    visibleMethod(bool) {
      if (bool) {
        this.creadVal()
        this.$emit('visibleMethod')
      } else {
        if (this.multipleSelection.length === 0) {
          this.$message.info('请选择物料！')
          return
        }
        let bool = false
        const arr = []
        this.multipleSelection.forEach((D) => {
          if (!D.station) {
            bool = true
            return
          }
          arr.push({
            order_no: 'order_no',
            pallet_no: D.container_no,
            need_qty: D.qty,
            need_weight: D.total_weight,
            material_no: D.material_no,
            material_name: D.material_name,
            inventory_type: '指定出库',
            inventory_reason: D.inventory_reason,
            unit: D.unit,
            status: 4,
            warehouse_info: this.warehouseInfo,
            quality_status: ['帘布库出库计划', '原材料出库计划', '炭黑出库计划'].includes(this.$route.meta.title) ? D.quality_status : D.quality_level,
            dispatch: D.dispatch || [],
            equip: D.equip || [],
            location: D.location,
            station: D.station,
            station_no: D.station_no
          })
        })
        if (bool) {
          this.$message.info('出库口必填')
          return
        }
        this.loadingBtn = true
        this.$emit('visibleMethodSubmit', arr)
      }
    },
    changSelectStation(obj) {
      // this.getParams.location = obj ? obj.name : ''
      this.getParams.station = obj ? obj.name : ''
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getRowKeys(row) {
      if (this.rawMaterial || this.drussDelivery) {
        return row.sn
      } else {
        return row.id
      }
    },
    sureDeliveryPlan() {
      this.dialogVisible = false
      this.tableData[this.currentIndex]._DeliveryPlan = this.$refs.receiveList.handleSelection
      this.handleSelection = this.tableData[this.currentIndex]._DeliveryPlan
      let str = ''
      const arr = []
      this.$refs.receiveList.handleSelection.forEach(D => {
        str += D.order_no + ';'
        this.$set(this.tableData[this.currentIndex], 'deliveryPlan', str)
        arr.push(D.id)
      })
      this.tableData[this.currentIndex].dispatch = arr || []

      if (!this.handleSelection || this.handleSelection.length === 0) {
        this.$set(this.tableData[this.currentIndex], 'deliveryPlan', '')
      }
    },
    deliverClick(row, index) {
      this.material_no_current = row.material_no
      this.currentIndex = index
      this.handleSelection = this.tableData[this.currentIndex]._DeliveryPlan
      this.dialogVisible = true
    },
    equipSelected(arr, index) {
      this.$set(this.tableData[index], 'equip', arr)
    },
    selectStation(obj, index) {
      if (this.rawMaterial || this.drussDelivery) {
        this.$set(this.tableData[index], 'station', obj ? obj.station : '')
        this.$set(this.tableData[index], 'station_no', obj ? obj.station_no : '')
      } else {
        this.$set(this.tableData[index], 'station', obj ? obj.name : '')
        this.$set(this.tableData[index], 'station_no', obj ? obj.id : '')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .dialog-footer{
    width:100%;
    text-align: right;
  }
</style>
