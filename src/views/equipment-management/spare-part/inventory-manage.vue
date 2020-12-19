<template>
  <div class="inventory-manage">
    <!-- 备品备件库存管理 -->
    <el-form :inline="true">

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
        prop="spare__no"
        label="物料编码"
      />
      <el-table-column
        prop="spare__name"
        label="物料名称"
      />
      <el-table-column
        prop="sum_qty"
        label="数量（件）"
      >
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="view(scope.row)">{{ scope.row.sum_qty }}</el-link>
        </template>
      </el-table-column>
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
    <el-dialog
      title="备品备件库位库存"
      :visible.sync="dialogVisibleResume"
      width="90%"
    >
      <locationManage :is-dialog="true" :show="dialogVisibleResume" :dialog-obj="dialogObj" />
    </el-dialog>
  </div>
</template>

<script>
import materialCodeSelect from '@/components/select_w/sparePartsMCodeSelect'
import page from '@/components/page'
import { getCountSpareInventory } from '@/api/inventory-manage'
import locationManage from './location-manage.vue'

export default {
  components: { page, materialCodeSelect, locationManage },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      tableData: [],
      dialogVisibleResume: false,
      dialogObj: {},
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await getCountSpareInventory(this.search)
        this.tableData = data.results
        this.total = data.count
      } catch (e) {
        //
      }
    },
    changeMaterialCode(obj) {
      console.log(obj)
      this.search.spare_no = obj ? obj.no : null
      this.search.page = 1
      console.log(this.search)
      this.getList()
    },
    changeMaterialName(obj) {
      this.search.spare_name = obj ? obj.name : null
      this.search.page = 1
      console.log(this.search)
      this.getList()
    },
    view(row) {
      this.dialogVisibleResume = true
      this.dialogObj = row
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
.inventory-manage{
  .warning-row{
    color:red;
  }
  .max-warning-row{
    color:green;
  }
}
</style>
