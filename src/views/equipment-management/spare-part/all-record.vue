<template>
  <div v-loading="loading">
    <el-form :inline="true">
      <el-form-item label="时间:">
        <el-date-picker
          v-model="dataValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :clearable="true"
          @change="setDataValue"
        />
      </el-form-item>
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
        <el-form-item>
          <!-- // 1出库 2入库 3盘点 -->
          <el-button v-if="currentRoute === 1" @click="exportTable('备品备件出库履历')">导出表格</el-button>
          <el-button v-if="currentRoute === 2" @click="exportTable('备品备件入库履历')">导出表格</el-button>
          <el-button v-if="currentRoute === 3" @click="exportTable('备品备件盘点履历')">导出表格</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      id="out-table"
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
        prop="fin_time"
        label="时间"
        width="90"
      />
      <el-table-column
        prop="type"
        label="类型"
        width="80"
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
        prop="location"
        label="库存位"
      />
      <el-table-column
        v-if="currentRoute === 1"
        prop="purpose"
        label="用途"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="currentRoute === 1"
        prop="reason"
        label="出库原因"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="currentRoute !== 3"
        prop="qty"
        label="数量(件)"
        width="80"
      />
      <el-table-column
        v-if="currentRoute !== 3"
        prop="dst_qty"
        label="剩余数量(件)"
        width="100"
      />
      <el-table-column
        v-if="currentRoute === 3"
        prop="src_qty"
        label="变更前数量(件)"
      />
      <el-table-column
        v-if="currentRoute === 3"
        prop="dst_qty"
        label="变更后数量(件)"
      />
      <el-table-column
        v-if="currentRoute === 1"
        prop="created_username"
        label="出库员"
      />
      <el-table-column
        v-if="currentRoute === 1"
        prop="receive_user"
        label="领用人"
      />
      <el-table-column
        v-if="currentRoute === 2"
        prop="created_username"
        label="入库员"
      />
      <el-table-column
        v-if="currentRoute === 3"
        prop="reason"
        label="备注"
      />
      <el-table-column
        v-if="currentRoute === 3"
        prop="created_username"
        label="操作人"
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
// import materialCodeSelect from '@/components/materialCodeSelect/index'
import materialCodeSelect from '@/components/select_w/sparePartsMCodeSelect'
import page from '@/components/page'
import { setDate, exportExcel } from '@/utils/index'
import { spareInventoryLog } from '@/api/base_w_two'
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
        page_size: 10,
        type: 1
      },
      dataValue: [setDate(), setDate()],
      tableData: [],
      total: 0,
      loading: false
    }
  },
  watch: {
    show(val) {
      if (val) {
        if (this.isDialog) {
          Object.assign(this.search, this.dialogObj)
        }
        this.dataValue = [setDate(), setDate()]
        this.search.begin_time = setDate()
        this.search.end_time = setDate()
        this.getList()
      }
    }
  },
  created() {
    this.search.begin_time = setDate()
    this.search.end_time = setDate()
    if (['备品备件出库履历', '备品备件出库管理'].includes(this.$route.meta.title)) {
      // // 1出库 2入库 3盘点
      this.currentRoute = 1
      this.search.type = '出库'
    } else if (['备品备件入库履历', '备品备件入库管理'].includes(this.$route.meta.title)) {
      this.currentRoute = 2
      this.search.type = '入库'
    } else {
      this.currentRoute = 3
      this.search.type = '数量变更'
    }
    if (this.isDialog) {
      Object.assign(this.search, this.dialogObj)
    }
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await spareInventoryLog('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeInventoryPosition(obj) {
      this.search.location_name = obj ? obj.name : null
      this.search.page = 1
      this.getList()
    },
    setDataValue(arr) {
      this.search.begin_time = arr ? arr[0] : ''
      this.search.end_time = arr ? arr[1] : ''
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
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    },
    exportTable(val) {
      exportExcel(val)
    }
  }
}
</script>

<style>

</style>
