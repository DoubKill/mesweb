<template>
  <div v-loading="loading">
    <el-form :inline="true">
      <el-form-item label="仓库名称">
        <warehouseSelect :created-is="true" @changSelect="changeWarehouse" />
      </el-form-item>
      <el-form-item label="物料编码">
        <materialCodeSelect
          :store-name="getParams.warehouse_name"
          :is-clearable="true"
          @changSelect="materialCodeFun"
        />
        <!-- <el-input v-model="getParams.material_no" @input="changeSearch" /> -->
      </el-form-item>
      <el-form-item label="托盘号">
        <el-input v-model="getParams.container_no" @input="changeSearch" />
      </el-form-item>
      <!-- <el-form-item v-show="getParams.warehouse_name != '终炼胶库'" label="物料类型">
        <materielTypeSelect @changSelect="changeMaterialType" />
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
      <el-table-column label="物料编码" align="center" prop="material_no" />
      <el-table-column label="lot" align="center" prop="lot_no" />
      <el-table-column label="货位状态" align="center" prop="location_status" />
      <el-table-column label="机台号" align="center" width="50">
        <template v-if="row.product_info" slot-scope="{row}">
          {{ row.product_info.equip_no }}
        </template>
      </el-table-column>
      <el-table-column label="生产时间" align="center">
        <template v-if="row.product_info" slot-scope="{row}">
          {{ row.product_info.product_time }}
        </template>
      </el-table-column>
      <el-table-column label="班次" align="center">
        <template v-if="row.product_info" slot-scope="{row}">
          {{ row.product_info.classes }}
        </template>
      </el-table-column>
      <el-table-column label="托盘号" align="center" prop="container_no" />
      <el-table-column label="库存位" align="center" prop="location" width="100" />
      <el-table-column label="库存数" align="center" prop="qty" width="100" />
      <el-table-column label="单位" align="center" prop="unit" width="40" />
      <el-table-column label="单位重量" align="center" prop="unit_weight" />
      <el-table-column label="总重量" align="center" prop="total_weight" />
      <el-table-column label="品质状态" align="center" prop="quality_status" width="60" />
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
import warehouseSelect from '@/components/select_w/warehouseSelect'
import page from '@/components/page'
import { mapGetters } from 'vuex'
import materialCodeSelect from '@/components/select_w/materialCodeSelect'

export default {
  components: { materialCodeSelect, page, warehouseSelect },
  data() {
    return {
      tableData: [],
      getParams: {
        page: 1,
        material_type: '', // 物料类型
        material_no: '', // 物料编号
        container_no: '', // 托盘号
        warehouse_name: '' // 仓库名称
      },
      warehouseNameOptions: ['线边库', '终炼胶库', '原材料库'],
      currentPage: 1,
      total: 0,
      loading: true
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
    // this.getTableData()
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
    changeWarehouse(data) {
      this.getParams.warehouse_name = data ? data.name : ''
      this.getParams.page = 1
      this.getTableData()
    }
  }
}
</script>
