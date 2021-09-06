<template>
  <div v-loading="loading" class="app-container">
    <!-- 库位列表 混炼终练使用-->
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
      <el-form-item v-if="warehouseName ==='混炼胶库'" label="出库口">
        <stationInfoWarehouse
          :warehouse-name="warehouseName"
          :assign-type="true"
          :created-is="false"
          :options-list="optionsList"
          :is-clear="true"
          :default-val="station_no"
          @changSelect="selectStation"
        />
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      border
      style="width: 100%"
      :data="tableData"
    >
      <el-table-column :key="1" label="物料类型" align="center" prop="material_type" min-width="40" />
      <el-table-column :key="2" label="物料编码" align="center" prop="material_no" />
      <el-table-column :key="4" label="lot" align="center" prop="lot_no" />
      <el-table-column :key="5" label="托盘号" align="center" prop="container_no" min-width="50" />
      <el-table-column :key="6" label="库存位" align="center" prop="location" min-width="50" />
      <el-table-column
        v-if="warehouseName === '终炼胶库'"
        :key="7"
        min-width="40"
        label="车数"
        align="center"
        prop=""
      >
        <template slot-scope="{row}">
          {{ row.qty }}
        </template>
      </el-table-column>
      <el-table-column :key="17" label="总重量" align="center" prop="total_weight" min-width="50" />
      <el-table-column
        :key="8"
        label="品质状态"
        align="center"
        min-width="50"
      >
        <template slot-scope="{row}">
          <span>{{ row.quality_level }}</span>
        </template>
      </el-table-column>
      <el-table-column :key="9" label="入库时间" align="center" prop="in_storage_time" />
      <el-table-column :key="10" label="机台号" width="60" align="center" prop="equip_no" />
      <el-table-column
        :key="18"
        min-width="40"
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
        min-width="40"
        align="center"
        prop="memo"
        :formatter="(row)=>{
          if(!row.memo){
            return
          }
          return row.memo.replace(',','-')
        }"
      />
      <el-table-column v-else :key="11" label="车号" align="center" prop="memo" min-width="40" />
      <el-table-column :key="13" label="货位状态" align="center" prop="location_status" min-width="40" />
      <el-table-column :key="14" label="操作" align="center" min-width="40">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="viewFun(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="立库库存明细"
      :visible.sync="dialogVisible"
      width="90%"
      append-to-body
    >
      <materialInventoryManage
        :warehouse-name-props="warehouseName"
        :material-no="materialNo"
        :container-no="containerNo"
        :lot-no="lotNo"
        :show="dialogVisible"
      />
    </el-dialog>
  </div>
</template>

<script>
import { bzMixinInventory, bzFinalInventory } from '@/api/material-inventory-manage'
import page from '@/components/page'
import stationInfoWarehouse from '@/components/select_w/warehouseSelectPosition'
// import receiveList from '../material-outgoing/receive-list.vue'
// import EquipSelect from '@/components/EquipSelect'
// import materialCodeSelect from '@/components/select_w/materialCodeSelect'
import { debounce } from '@/utils'
import { stationInfo } from '@/api/warehouse'
import materialInventoryManage from '@/views/inventory/rubber-warehouse/material-inventory-manage.vue'
export default {
  name: 'GenerateAssignOutbound1',
  components: { page, stationInfoWarehouse, materialInventoryManage },
  props: {
    warehouseName: {
      type: String,
      default: ''
    },
    warehouseInfo: {
      type: Number,
      default: null
    },
    qualityStatus: {
      type: String,
      default: null
    },
    materialNo: {
      type: String,
      default: null
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
        // location_status: '',
        container_no: '', // 托盘号
        station_no: '', // 出库口
        quality_status: this.qualityStatus,
        material_no: this.materialNo,
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
      dispatch: '',
      containerNo: '',
      lotNo: ''
    }
  },
  computed: {
  },
  watch: {
    show(bool) {
      if (bool) {
        this.tableData = []
        this.getTableData()
      }
    }
  },
  created() {
    this.getTableData()
    // this.getWarehouseSelectPosition()
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
                d.id === D.id)
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
        const _api = stationInfo
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
        material_type: '',
        material_no: '',
        container_no: '',
        station_no: '',
        warehouse_name: this.warehouseName
      }
    },
    viewFun(row) {
      this.dialogVisible = true
      this.containerNo = row.container_no
      this.lotNo = row.lot_no
    },
    selectStation(obj, index) {
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
</script>
<style lang="scss" scoped>
  .dialog-footer{
    width:100%;
    text-align: right;
  }
</style>
