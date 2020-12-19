<template>
  <div class="location-manage">
    <!-- 备品备件库位管理 -->
    <el-form :inline="true">
      <div v-if="!isDialog">
        <el-form-item label="物料编码:">
          <materialCodeSelect
            :is-all-obj="true"
            label-name="no"
            @changeSelect="changeMaterialCode"
          />
        </el-form-item>
        <el-form-item label="物料名称:">
          <materialCodeSelect
            :is-all-obj="true"
            @changeSelect="changeMaterialName"
          />
        </el-form-item>
        <el-form-item label="库存位:">
          <inventoryPosition @changSelect="changeInventoryPosition" />
        </el-form-item>
      </div>
    </el-form>
    <el-table
      :data="tableData"
      border
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
        prop="material_no"
        label="物料编码"
      />
      <el-table-column
        prop="material_name"
        label="物料名称"
      />
      <el-table-column
        prop="location_name"
        label="库存位"
      />
      <el-table-column
        prop="qty"
        label="数量（件）"
      />
      <el-table-column
        prop="unit_count"
        label="单价"
      />
      <el-table-column
        prop="total_count"
        label="总价"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import inventoryPosition from '@/components/select_w/inventoryPosition'
import materialCodeSelect from '@/components/materialCodeSelect/index'
import page from '@/components/page'
import { spareInventory } from '@/api/base_w_two'

export default {
  components: { page, inventoryPosition, materialCodeSelect },
  props: {
    isDialog: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    dialogObj: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      tableData: [],
      total: 0
    }
  },
  watch: {
    show(val) {
      if (val) {
        if (this.isDialog) {
          this.search.material_no = this.dialogObj.material__material_no
        }
        this.getList()
      }
    }
  },
  created() {
    if (this.isDialog) {
      this.search.material_no = this.dialogObj.material__material_no
    }
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await spareInventory('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
      } catch (e) {
        //
      }
    },
    changeInventoryPosition(obj) {
      this.search.location_name = obj ? obj.name : null
      this.search.page = 1
      this.getList()
    },
    changeMaterialCode(obj) {
      this.search.material_no = obj ? obj.no : null
      this.search.page = 1
      this.getList()
    },
    changeMaterialName(obj) {
      this.search.material_name = obj ? obj.name : null
      this.search.page = 1
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.bound === '-') {
        return 'warning-row'
      }
      return ''
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.location-manage{
  .warning-row{
    color:red;
  }
  .max-warning-row{
    color:green;
  }
}
</style>
