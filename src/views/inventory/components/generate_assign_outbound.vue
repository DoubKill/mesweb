<template>
  <div v-loading="loading" class="app-container">
    <el-form :inline="true">
      <el-form-item label="仓库名称">
        {{ warehouseName }}
        <!-- <warehouseSelect @changSelect="warehouseSelect" /> -->
      </el-form-item>
      <el-form-item label="仓库位置">
        <stationInfoWarehouse @changSelect="changSelectStation" />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input v-model="getParams.material_no" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="品质状态">
        <el-select
          v-model="getParams.quality_status"
          placeholder="请选择"
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
        width="55"
        :reserve-selection="true"
      />
      <!-- <el-table-column label="No" type="index" align="center" /> -->
      <el-table-column label="物料类型" align="center" prop="material_type" />
      <el-table-column label="物料编码" align="center" prop="material_no" />
      <el-table-column label="lot" align="center" prop="lot_no" />
      <el-table-column label="托盘号" align="center" prop="container_no" />
      <el-table-column label="库存位" align="center" prop="location" />
      <el-table-column
        v-if="warehouseName === '终炼胶库'"
        label="车次"
        align="center"
        prop=""
      >
        <template slot-scope="{row}">
          {{ row.qty }}
        </template>
      </el-table-column>
      <el-table-column label="总重量" align="center" prop="total_weight" />
      <el-table-column label="品质状态" align="center" prop="quality_status" />
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
  </div>
</template>

<script>
// import warehouseSelect from '@/components/select_w/warehouseSelect'
import { getMaterialInventoryManage } from '@/api/material-inventory-manage'
// import materielTypeSelect from '@/components/select_w/materielTypeSelect'
import page from '@/components/page'
import stationInfoWarehouse from '@/components/select_w/warehouseSelectPosition'
import { mapGetters } from 'vuex'
export default {
  components: { page, stationInfoWarehouse },
  props: {
    warehouseName: {
      type: String,
      default: ''
    },
    warehouseInfo: {
      type: Number,
      default: null
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
        warehouse_name: '终炼胶库' // 仓库名称
      },
      currentPage: 1,
      total: 0,
      options: ['一等品', '三等品'],
      loading: false,
      multipleSelection: [],
      loadingBtn: false
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    // this.getParams.quality_status = this.options[0]
    this.permissionObj = this.permission
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.loading = true
      getMaterialInventoryManage(this.getParams)
        .then(response => {
          this.tableData = response.results
          this.total = response.count
          this.loading = false
        }).catch(() => {
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
    },
    visibleMethod(bool) {
      if (bool) {
        this.creadVal()
        this.$emit('visibleMethod')
      } else {
        if (!this.getParams.location) {
          this.$message.info('请选择仓库位置！')
          return
        }
        if (this.multipleSelection.length === 0) {
          return
        }
        this.loadingBtn = true
        const arr = []
        this.multipleSelection.forEach(D => {
          arr.push({
            location: this.getParams.location,
            order_no: 'order_no',
            pallet_no: D.container_no,
            need_qty: D.qty,
            need_weight: D.total_weight,
            material_no: D.material_no,
            inventory_type: '指定出库',
            inventory_reason: D.inventory_reason,
            unit: D.unit,
            status: 4,
            warehouse_info: this.warehouseInfo,
            // quality_status: D.quality_status
            quality_status: '一等品'
          })
        })

        this.$emit('visibleMethodSubmit', arr)
      }
    },
    changSelectStation(obj) {
      this.getParams.location = obj ? obj.name : ''
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.multipleSelection = val
      }
    },
    getRowKeys(row) {
      return row.id
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
