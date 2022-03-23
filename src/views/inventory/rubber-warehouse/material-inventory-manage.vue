<template>
  <div v-loading="loading">
    <!-- 立库库存明细 -->
    <el-form :inline="true">
      <el-form-item label="仓库名称">
        <span v-if="warehouseNameProps">{{ warehouseNameProps }}</span>
        <!-- <el-select
          v-else
          v-model="getParams.warehouse_name"
          placeholder="请选择"
          clearable
          @change="changeWarehouse"
        >
          <el-option
            v-for="item in ['混炼胶库','终炼胶库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select> -->
        <!-- <warehouseSelect :created-is="true" @changSelect="changeWarehouse" /> -->
      </el-form-item>
      <el-form-item label="物料编码">
        <span v-if="materialNo">{{ materialNo }}</span>
        <materialCodeSelect
          v-else
          :store-name="getParams.warehouse_name"
          :is-clearable="true"
          :is-allow-create="true"
          @changSelect="materialCodeFun"
        />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-select
          v-model="getParams.e_material_name"
          style="width:250px"
          placeholder="请选择物料名称"
          filterable
          clearable
          @visible-change="getProduct"
          @change="changeList"
        >
          <el-option
            v-for="(item,i) in options"
            :key="i"
            :label="item.material_name"
            :value="item.material_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="品质状态">
        <el-select
          v-model="getParams.quality_status"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in [{value:1,label:'合格'},{value:2,label:'抽检中'},{value:3,label:'不合格'},{value:4,label:'过期'},{value:5,label:'待检'}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="是否进烘房">
        <el-select
          v-model="getParams.is_entering"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in ['Y','N']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="批次号">
        <el-input v-model="getParams.l_batch_no" clearable @input="getDebounce" />
      </el-form-item>
      <el-form-item v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="供应商">
        <el-input v-model="getParams.supplier_name" clearable @input="getDebounce" />
      </el-form-item>
      <el-form-item v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="核酸管控">
        <el-select
          v-model="getParams.in_charged_tag"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in ['未管控','已锁定','已解锁']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="托盘号">
        <span v-if="containerNo">{{ containerNo }}</span>
        <el-input v-else v-model="getParams.container_no" clearable @input="getDebounce" />
      </el-form-item>
      <!-- <el-form-item label="质检条码">
        <span v-if="lotNo">{{ lotNo }}</span>
        <el-input v-else v-model="getParams.lot_no" clearable @input="changeSearch" />
      </el-form-item> -->
      <!-- <el-form-item v-show="getParams.warehouse_name != '终炼胶库'" label="物料类型">
        <materielTypeSelect @changSelect="changeMaterialType" />
      </el-form-item> -->
      <el-form-item style="float:right">
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable(1)"
        >导出当前页面</el-button>
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable(2)"
        >导出全部</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      fit
      style="width: 100%"
      :row-class-name="tableRowClassName"
      :data="tableData"
    >
      <el-table-column label="No" type="index" align="center" width="40" />
      <el-table-column label="物料名称" align="center" prop="material_name" min-width="35" />
      <el-table-column label="物料编码" align="center" prop="material_no" min-width="35" />
      <el-table-column label="质检条码" align="center" prop="lot_no" min-width="35" />
      <el-table-column v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="批次号" align="center" prop="batch_no" min-width="16" />
      <el-table-column v-if="getParams.warehouse_name === '帘布库'" label="货位状态" align="center" prop="location_status" min-width="16" />
      <!-- <el-table-column label="机台号" align="center" min-width="12">
        <template v-if="row.product_info" slot-scope="{row}">
          {{ row.product_info.equip_no }}
        </template>
      </el-table-column>
      <el-table-column label="生产时间" align="center" width="90">
        <template v-if="row.product_info" slot-scope="{row}">
          {{ row.product_info.product_time }}
        </template>
      </el-table-column>
      <el-table-column label="班次" align="center" min-width="12">
        <template v-if="row.product_info" slot-scope="{row}">
          {{ row.product_info.classes }}
        </template>
      </el-table-column> -->
      <el-table-column label="托盘号" align="center" prop="container_no" min-width="18" />
      <el-table-column v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="是否进烘房" align="center" prop="is_entering" min-width="16" />
      <el-table-column v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="供应商" align="center" prop="supplier_name" min-width="16" />
      <el-table-column label="库存位" align="center" prop="location" min-width="18" />
      <el-table-column label="库存数" align="center" prop="qty" min-width="16" />
      <el-table-column label="单位" align="center" prop="unit" min-width="20" />
      <el-table-column label="单位重量" align="center" prop="unit_weight" min-width="16" />
      <el-table-column label="总重量" align="center" prop="total_weight" min-width="16" />
      <el-table-column v-if="warehouseNameProps==='原材料库'||warehouseNameProps==='炭黑库'" label="核酸管控" align="center" prop="in_charged_tag" min-width="16" />
      <el-table-column label="品质状态" align="center" prop="quality_status" min-width="15" />
      <el-table-column v-if="['炭黑库', '原材料库'].includes(warehouseNameProps)" label="入库时间" align="center" prop="in_storage_time" min-width="15" />
      <!-- <el-table-column v-if="['炭黑库', '原材料库'].includes(warehouseNameProps)" label="件数" align="center" prop="sl" min-width="15" />
      <el-table-column v-if="['炭黑库', '原材料库'].includes(warehouseNameProps)" label="唛头重量" align="center" prop="zl" min-width="15" /> -->
      <!-- <el-table-column label="操作" align="center" min-width="20">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="viewFun(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />

    <!-- <el-dialog
      title="胶料快检详细信息"
      :visible.sync="dialogVisible"
      width="90%"
      append-to-body
    >
      <detailsDialog
        :is-props="true"
        :equip-no="equipNo"
        :product-no="productNo"
        :classes-no="classesNo"
        :is-qualified="qualityStatus"
        :show="dialogVisible"
      />
    </el-dialog> -->
  </div>
</template>

<script>
import { bzFinalInventory, wmsStorage, thStorage,
  bzFinalInventoryDown, wmsStorageDown, thStorageDown } from '@/api/material-inventory-manage'
// import { getMaterialInventoryManage } from '@/api/material-inventory-manage'
// import materielTypeSelect from '@/components/select_w/materielTypeSelect'
// import warehouseSelect from '@/components/select_w/warehouseSelect'
import page from '@/components/page'
import { mapGetters } from 'vuex'
import { materialCount } from '@/api/base_w'
import { debounce } from '@/utils/index'
import materialCodeSelect from '@/components/select_w/materialCodeSelect'
// import detailsDialog from '@/views/quality_management/details.vue'
export default {
  name: 'MaterialInventoryManage',
  components: { materialCodeSelect, page },
  props: {
    warehouseNameProps: {
      type: String,
      default: ''
    },
    materialNo: {
      type: String,
      default: ''
    },
    containerNo: {
      type: String,
      default: ''
    },
    lotNo: {
      type: String,
      default: ''
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
        material_type: '', // 物料类型
        material_no: this.materialNo, // 物料编号
        container_no: this.containerNo, // 托盘号
        lot_no: this.lotNo,
        warehouse_name: '混炼胶库' // 仓库名称
      },
      currentPage: 1,
      total: 0,
      options: [],
      loading: false,
      dialogVisible: false,
      equipNo: '',
      productNo: '',
      classesNo: '',
      qualityStatus: '',
      btnExportLoad: false
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  watch: {
    show(bool) {
      if (bool) {
        this.getParams = {
          page: 1,
          material_type: '', // 物料类型
          material_no: this.materialNo, // 物料编号
          container_no: this.containerNo, // 托盘号
          lot_no: this.lotNo,
          warehouse_name: this.warehouseNameProps // 仓库名称
        }
        this.getTableData()
      }
    }
  },
  created() {
    this.permissionObj = this.permission
    if (this.warehouseNameProps) {
      this.getParams.warehouse_name = this.warehouseNameProps
    }
    this.getTableData()
  },
  methods: {
    async getProduct(val) {
      if (val) {
        try {
          const data = await materialCount('get', null, { params: { store_name: this.warehouseNameProps }})
          this.options = data || []
        } catch (e) {
        //
        }
      }
    },
    changeList() {
      this.getParams.page = 1
      this.getTableData()
    },
    getTableData() {
      this.loading = true
      this.tableData = []
      const obj = Object.assign({ store_name: '帘布库' }, this.getParams)
      let _api = bzFinalInventory

      if (['原材料库', '炭黑库'].includes(this.getParams.warehouse_name)) {
        delete obj.store_name
        _api = this.getParams.warehouse_name === '原材料库' ? wmsStorage : thStorage
      }
      _api(obj)
        .then(response => {
          this.tableData = response.results
          this.total = response.count
          this.loading = false
          this.tableData.push({
            all: 2,
            material_name: '单页合计',
            qty: sum(this.tableData, 'qty'),
            total_weight: sum(this.tableData, 'total_weight')
          }, {
            all: 1,
            material_name: '汇总',
            qty: response.total_trains,
            total_weight: response.total_weight
          })
        }).catch(e => {
          this.loading = false
        })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.material_name === '单页合计' || row.material_name === '汇总') {
        return 'summary-cell-style'
      }
    },
    getDebounce() {
      debounce(this, 'changeSearch')
    },
    currentChange(page) {
      this.currentPage = page
      this.getParams.page = page
      this.getTableData()
    },
    changeSearch() {
      this.getParams.pallet_no = this.getParams.container_no
      this.getParams.page = 1
      this.getTableData()
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
    changeWarehouse() {
      // this.getParams.warehouse_name = data ? data.name : ''
      this.getParams.page = 1
      this.getTableData()
    },
    viewFun(row) {
      // this.equipNo = row.product_info.equip_no
      // this.productNo = row.material_no
      // this.classesNo = row.product_info.classes
      // this.qualityStatus = row.quality_status
      // this.lotNo = row.lot_no
      this.dialogVisible = true
    },
    exportTable(val) {
      this.btnExportLoad = true
      const obj = Object.assign({ store_name: '帘布库', export: val }, this.getParams)
      let _api = bzFinalInventoryDown
      if (['原材料库', '炭黑库'].includes(this.getParams.warehouse_name)) {
        delete obj.store_name
        _api = this.getParams.warehouse_name === '原材料库' ? wmsStorageDown : thStorageDown
      }
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = this.getParams.warehouse_name + '-库存明细.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    }
  }
}
function sum(arr, params) {
  var s = 0

  arr.forEach(function(val, idx, arr) {
    const a = val[params] ? Number(val[params]) : 0
    s += a
  }, 0)
  s = Math.round(s * 1000) / 1000
  return s
}
</script>
