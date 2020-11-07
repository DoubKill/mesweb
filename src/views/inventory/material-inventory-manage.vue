<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="物料类型">
        <materielTypeSelect @changSelect="changeMaterialType" />
        <!-- <el-input v-model="getParams.material_type" @input="changeSearch" /> -->
      </el-form-item>
      <el-form-item label="仓库名称">
        <el-select
          v-model="getParams.warehouse_name"
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in warehouseNameOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input v-model="getParams.material_no" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="托盘号">
        <el-input v-model="getParams.container_no" @input="changeSearch" />
      </el-form-item>
    </el-form>
    <el-table
      border
      fit
      style="width: 100%"
      :data="tableData"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="物料类型" align="center" prop="material_type" />
      <el-table-column label="物料编码" align="center" prop="material_no" />
      <el-table-column label="lot" align="center" prop="lot_no" />
      <el-table-column label="托盘号" align="center" prop="container_no" />
      <el-table-column label="库存位" align="center" prop="location" />
      <el-table-column label="库存数" align="center" prop="qty" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="单位重量" align="center" prop="unit_weight" />
      <el-table-column label="总重量" align="center" prop="total_weight" />
      <el-table-column label="品质状态" align="center" prop="quality_status" />
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
import materielTypeSelect from '@/components/select_w/materielTypeSelect'
import page from '@/components/page'
import { mapGetters } from 'vuex'
export default {
  components: { page, materielTypeSelect },
  data() {
    return {
      tableData: [],
      getParams: {
        page: 1,
        material_type: '', // 物料类型
        material_no: '', // 物料编号
        container_no: '', // 托盘号
        warehouse_name: '终炼胶库' // 仓库名称
      },
      warehouseNameOptions: ['线边库', '终炼胶库', '原材料库'],
      currentPage: 1,
      total: 0
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
    this.getTableData()
  },
  methods: {
    getTableData() {
      getMaterialInventoryManage(this.getParams)
        .then(response => {
          this.tableData = response.results
          this.total = response.count
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
    changeMaterialType(data) {
      this.getParams.material_type = data
      this.getParams.page = 1
      this.getTableData()
    }
  }
}
</script>
