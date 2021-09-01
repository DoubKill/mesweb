<template>
  <div v-loading="loading" class="app-container">
    <!-- 指定出库 混炼终练使用-->
    <el-form :inline="true">
      <el-form-item label="仓库名称">
        {{ warehouseName }}
      </el-form-item>
      <el-form-item label="库存位">
        <el-input v-model="getParams.location" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="托盘号">
        <el-input v-model="getParams.container_no" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="巷道">
        <el-input v-model="getParams.tunnel" @input="changeSearchTunnel" />
      </el-form-item>
      <el-form-item label="lot_no有无">
        <el-select
          v-model="getParams.lot_existed"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="(item,key) in [{name:'有',id:1},{name:'无',id:0}]"
            :key="key"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <br>
      <el-form-item label="出库口(必填)">
        <stationInfoWarehouse
          :warehouse-name="warehouseName"
          :start-using="true"
          :assign-type="true"
          :created-is="true"
          :options-list="optionsList"
          :raw-material="rawMaterial"
          :druss-delivery="drussDelivery"
          :default-val="station_no"
          @changSelect="selectStation"
        />
      </el-form-item>
      <el-form-item label="品质状态">
        <el-select
          v-model="getParams.quality_status"
          placeholder="请选择"
          clearable
          @change="quality_statusSearch"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="['帘布库出库计划'].includes($route.meta.title)" label="物料名称">
        <materialCodeSelect
          :store-name="warehouseName"
          :is-clearable="true"
          label-show="material_name"
          :default-val="getParams.material_no"
          @changSelect="materialCodeFun"
        />
      </el-form-item>
      <el-form-item v-else label="物料编码(必填)">
        <materialCodeSelect
          :store-name="warehouseName"
          :is-clearable="true"
          :station="getParams.station"
          :status="getParams.quality_status"
          :default-val="getParams.material_no"
          :ex-warehouse="true"
          @changSelect="materialCodeFun($event,true)"
        />
      </el-form-item>
      <el-form-item v-if="$route.meta.title==='混炼胶出库计划'" label="机台号">
        <EquipSelect equip-type="密炼设备" :default-val="equipArr" :is-multiple="true" @equipSelected="equipSelected" />
      </el-form-item>
      <el-form-item v-if="$route.meta.title==='终炼胶出库计划'" label="发货计划选择">
        <span v-for="handleSelectionItem in handleSelection" :key="handleSelectionItem.id">
          {{ handleSelectionItem.order_no }};
        </span>
        <el-button size="mini" type="primary" @click="deliverClick">添加发货计划</el-button>
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
      <el-table-column :key="1" label="物料类型" align="center" prop="material_type" />
      <el-table-column :key="2" label="物料编码" align="center" prop="material_no" />
      <el-table-column v-if="['帘布库出库计划'].includes($route.meta.title)" :key="3" label="物料名称" align="center" prop="material_name" />
      <el-table-column :key="4" label="lot" align="center" prop="lot_no" />
      <el-table-column :key="5" label="托盘号" align="center" prop="container_no" />
      <el-table-column :key="6" label="库存位" align="center" prop="location" />
      <el-table-column
        v-if="warehouseName === '终炼胶库'"
        :key="7"
        width="60"
        label="车数"
        align="center"
        prop=""
      >
        <template slot-scope="{row}">
          {{ row.qty }}
        </template>
      </el-table-column>
      <el-table-column :key="17" label="总重量" align="center" prop="total_weight" />
      <el-table-column
        :key="8"
        label="品质状态"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="['帘布库出库计划'].includes($route.meta.title)">{{ row.quality_status }}</span>
          <span v-else>{{ row.quality_level }}</span>
        </template>
      </el-table-column>
      <el-table-column :key="9" label="入库时间" align="center" prop="in_storage_time" />
      <el-table-column :key="10" label="机台号" width="50" align="center" prop="equip_no" />
      <el-table-column
        v-if="['混炼胶出库计划','终炼胶出库计划'].includes($route.meta.title)"
        :key="18"
        label="计划车数"
        align="center"
        :formatter="(row)=>{
          if(!row.qty){
            return
          }
          let a = Number(row.qty)
          return a.toFixed(0)
        }"
      />
      <el-table-column
        v-if="['终炼胶出库计划'].includes($route.meta.title)"
        :key="12"
        label="车次"
        align="center"
        prop="memo"
        :formatter="(row)=>{
          if(!row.memo){
            return
          }
          return row.memo.replace(',','-')
        }"
      />
      <el-table-column v-else :key="11" label="车号" align="center" prop="memo" />
      <el-table-column :key="13" label="货位状态" align="center" prop="location_status" />
      <!-- <el-table-column :key="14" label="出库口选择" align="center">
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
      </el-table-column> -->
      <!-- <el-table-column v-if="$route.meta.title==='终炼胶出库计划'" :key="15" label="关联发货计划" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.deliveryPlan }}
          <el-button size="mini" type="primary" @click="deliverClick(scope.row,scope.$index)">添加发货计划</el-button>
        </template>
      </el-table-column> -->
      <!-- <el-table-column v-if="$route.meta.title==='混炼胶出库计划'" :key="16" label="机台号" align="center" min-width="100">
        <template slot-scope="scope">
          <EquipSelect equip-type="密炼设备" :is-multiple="true" @equipSelected="equipSelected($event,scope.$index)" />
        </template>
      </el-table-column> -->
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
        :material-no="getParams.material_no"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureDeliveryPlan">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { bzMixinInventory, bzFinalInventory } from '@/api/material-inventory-manage'
import page from '@/components/page'
import stationInfoWarehouse from '@/components/select_w/warehouseSelectPosition'
import receiveList from '../material-outgoing/receive-list.vue'
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
    rawMaterial: { // 是不是原材料出库
      type: Boolean,
      default: false
    },
    drussDelivery: { // 是不是炭黑出库
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
        station_no: '', // 出库口
        warehouse_name: this.warehouseName // 仓库名称
      },
      currentPage: 1,
      total: 0,
      options: ['一等品', '三等品', '待检品'],
      loading: false,
      multipleSelection: [],
      loadingBtn: false,
      dialogVisible: false,
      material_no_current: '',
      currentIndex: null,
      handleSelection: [],
      optionsList: [],
      equipArr: '',
      station: '',
      station_no: '',
      dispatch: ''
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
      const _api = this.warehouseName === '混炼胶库' ? bzMixinInventory : bzFinalInventory
      _api(this.getParams)
        .then(response => {
          this.tableData = response.results
          this.total = response.count
          this.tableData.forEach(D => {
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
    quality_statusSearch() {
      this.getParams.material_no = ''
      this.getParams.page = 1
      this.getTableData()
    },
    changeSearchTunnel() {
      debounce(this, 'changeSearch')
    },
    materialCodeFun(val, bool) {
      if (bool) {
        this.$refs.multipleTable.clearSelection()
        this.multipleSelection = []
        this.handleSelection = []
      }
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
      this.handleSelection = []
      this.tableData.forEach(D => {
        D.equipNoArr = null
        D.station = null
        D.station_no = null
      })
      this.equipArr = []
      this.station_no = ''
      this.station = ''
      this.getParams = {
        page: 1,
        location_status: '有货货位',
        material_type: '',
        material_no: '',
        container_no: '',
        station_no: '',
        warehouse_name: this.warehouseName
      }
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
        if (!this.station) {
          this.$message.info('请选择出库口！')
          return
        }
        if (!this.getParams.material_no) {
          this.$message.info('请选择物料编码！')
          return
        }
        // const bool = false
        const arr = []
        this.multipleSelection.forEach((D) => {
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
            lot_no: D.lot_no,
            memo: D.memo,
            status: 4,
            warehouse_info: this.warehouseInfo,
            quality_status: ['帘布库出库计划', '原材料出库计划', '炭黑出库计划'].includes(this.$route.meta.title) ? D.quality_status : D.quality_level,
            dispatch: this.dispatch || [],
            equip: this.equipArr || [],
            location: D.location,
            station: this.station,
            station_no: this.station_no
          })
        })
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
      this.handleSelection = this.$refs.receiveList.handleSelection || []

      const arr = []
      this.handleSelection.forEach(D => {
        arr.push(D.id)
      })
      this.dispatch = arr || []
    },
    deliverClick(row, index) {
      if (!this.getParams.material_no) {
        this.$message.info('请选择物料编码')
        return
      }
      this.dialogVisible = true
    },
    equipSelected(arr, index) {
      this.equipArr = arr
    },
    selectStation(obj, index) {
      if (this.rawMaterial || this.drussDelivery) {
        // this.$set(this.tableData[index], 'station', obj ? obj.station : '')
        // this.$set(this.tableData[index], 'station_no', obj ? obj.station_no : '')
      } else {
        this.getParams.station = obj ? obj.name : ''
        this.station = obj ? obj.name : ''
        this.station_no = obj ? obj.id : ''

        if (this.warehouseName === '混炼胶库') {
          // 过滤列表
          this.changeSearch()
          this.$refs.multipleTable.clearSelection()
          this.multipleSelection = []
          this.handleSelection = []
        }
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
