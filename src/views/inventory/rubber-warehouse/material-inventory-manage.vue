<template>
  <div v-loading="loading">
    <!-- 立库库存明细 -->
    <el-form :inline="true">
      <el-form-item label="仓库名称">
        <span v-if="warehouseNameProps">{{ warehouseNameProps }}</span>
        <el-select
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
        </el-select>
        <!-- <warehouseSelect :created-is="true" @changSelect="changeWarehouse" /> -->
      </el-form-item>
      <el-form-item label="物料编码">
        <materialCodeSelect
          :store-name="getParams.warehouse_name"
          :is-clearable="true"
          :is-allow-create="true"
          @changSelect="materialCodeFun"
        />
        <!-- <el-input v-model="getParams.material_no" @input="changeSearch" /> -->
      </el-form-item>
      <el-form-item label="托盘号">
        <el-input v-model="getParams.container_no" clearable @input="changeSearch" />
      </el-form-item>
      <el-form-item label="质检条码">
        <el-input v-model="getParams.lot_no" clearable @input="changeSearch" />
      </el-form-item>
      <!-- <el-form-item v-show="getParams.warehouse_name != '终炼胶库'" label="物料类型">
        <materielTypeSelect @changSelect="changeMaterialType" />
      </el-form-item> -->
      <!-- <el-form-item style="float:right">
        <el-button
          type="primary"
          @click="exportTable"
        >导出全部</el-button>
      </el-form-item> -->
    </el-form>
    <el-table
      border
      fit
      style="width: 100%"
      :data="tableData"
    >
      <el-table-column label="No" type="index" align="center" width="40" />
      <el-table-column label="物料类型" align="center" prop="material_type" width="80" />
      <el-table-column label="物料编码" align="center" prop="material_no" min-width="22" />
      <el-table-column label="质检条码" align="center" prop="lot_no" min-width="20" />
      <el-table-column label="货位状态" align="center" prop="location_status" min-width="16" />
      <el-table-column label="机台号" align="center" min-width="12">
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
      </el-table-column>
      <el-table-column label="托盘号" align="center" prop="container_no" min-width="18" />
      <el-table-column label="库存位" align="center" prop="location" min-width="18" />
      <el-table-column label="库存数" align="center" prop="qty" min-width="16" />
      <el-table-column label="单位" align="center" prop="unit" min-width="10" />
      <el-table-column label="单位重量" align="center" prop="unit_weight" min-width="18" />
      <el-table-column label="总重量" align="center" prop="total_weight" min-width="18" />
      <el-table-column label="品质状态" align="center" prop="quality_status" min-width="16" />
    </el-table>
    <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { getMaterialInventoryManage } from '@/api/material-inventory-manage'
// import materielTypeSelect from '@/components/select_w/materielTypeSelect'
// import warehouseSelect from '@/components/select_w/warehouseSelect'
import page from '@/components/page'
import { mapGetters } from 'vuex'
import materialCodeSelect from '@/components/select_w/materialCodeSelect'

export default {
  name: 'MaterialInventoryManage',
  components: { materialCodeSelect, page },
  props: {
    warehouseNameProps: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      getParams: {
        page: 1,
        material_type: '', // 物料类型
        material_no: '', // 物料编号
        container_no: '', // 托盘号
        warehouse_name: '混炼胶库' // 仓库名称
      },
      currentPage: 1,
      total: 0,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
    if (this.warehouseNameProps) {
      this.getParams.warehouse_name = this.warehouseNameProps
    }
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.loading = true
      this.tableData = []
      getMaterialInventoryManage(this.getParams)
        .then(response => {
          this.tableData = response.results
          this.total = response.count
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
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
    exportTable() {
      // responseType: 'blob'  get请求

      // barcodeQualityExport()
      //   .then(res => {
      //     const link = document.createElement('a')
      //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      //     link.style.display = 'none'
      //     link.href = URL.createObjectURL(blob)
      //     link.download = '车间库存统计.xlsx' // 下载的文件名
      //     document.body.appendChild(link)
      //     link.click()
      //     document.body.removeChild(link)
      //     this.btnExportLoad = false
      //   }).catch(e => {
      //     this.btnExportLoad = false
      //   })
    }
  }
}
</script>
