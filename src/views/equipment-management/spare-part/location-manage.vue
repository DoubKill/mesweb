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
        <el-form-item label="物料类型:">
          <materialTypeSelect
            @changeSelect="changeMaterialType"
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
        prop="type_name"
        label="物料类型"
      />
      <el-table-column
        prop="spare_no"
        label="物料编码"
      />
      <el-table-column
        prop="spare_name"
        label="物料名称"
      />
      <el-table-column
        prop="location_name"
        label="库存位"
      />
      <el-table-column
        prop="qty"
        label="数量"
      />
      <el-table-column
        prop="unit"
        label="单位"
      />
      <el-table-column
        prop="cost"
        label="单价（元）"
      />
      <el-table-column
        prop="total_count"
        label="总价（元）"
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
import materialCodeSelect from '@/components/select_w/sparePartsMCodeSelect'
import page from '@/components/page'
import { spareInventory } from '@/api/base_w_two'
import materialTypeSelect from '@/components/select_w/sparePartsMTypeSelect'

export default {
  components: { page, inventoryPosition, materialCodeSelect, materialTypeSelect },
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
          this.search.spare_no = this.dialogObj.spare__no
        }
        this.getList()
      }
    }
  },
  created() {
    if (this.isDialog) {
      this.search.spare_no = this.dialogObj.spare__no
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
      this.search.spare_no = obj ? obj.no : null
      this.search.page = 1
      this.getList()
    },
    changeMaterialName(obj) {
      this.search.spare_name = obj ? obj.name : null
      this.search.page = 1
      this.getList()
    },
    changeMaterialType(obj) {
      this.search.type_name = obj ? obj.name : null
      this.search.page = 1
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.bound === '-') {
        return 'warning-row'
      } else if (row.bound === '+') {
        return 'max-warning-row'
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
    color:#e6a23c;
  }
}
</style>
