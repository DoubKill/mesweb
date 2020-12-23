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
        <el-form-item label="物料类型:">
          <materialTypeSelect
            @changeSelect="changeMaterialType"
          />
        </el-form-item>
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
      <el-form-item v-if="currentRoute === 1" label="状态:">
        <!-- // 1出库 2入库 3盘点 -->
        <el-select
          v-model="search.status"
          placeholder="请选择"
          clearable
          @change="changeStatus"
        >
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
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
        prop="spare_type"
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
        prop="location"
        label="库存位"
      />
      <el-table-column
        prop="unit_count"
        label="单价（元）"
      />
      <el-table-column
        prop="cost"
        label="总价（元）"
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
        label="数量"
        width="80"
      />
      <el-table-column
        v-if="currentRoute !== 3"
        prop="dst_qty"
        label="剩余数量"
        width="100"
      />
      <el-table-column
        v-if="currentRoute === 3"
        prop="src_qty"
        label="变更前数量"
      />
      <el-table-column
        v-if="currentRoute === 3"
        prop="dst_qty"
        label="变更后数量"
      />
      <el-table-column
        prop="unit"
        label="单位"
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
        show-overflow-tooltip
      />
      <el-table-column
        v-if="currentRoute === 3"
        prop="created_username"
        label="操作人"
      />
      <el-table-column
        v-if="currentRoute === 1"
        prop="created_username"
        label="状态"
      >
        <template slot-scope="{row}">
          {{ row.status===1?'完成':'注销' }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="currentRoute === 1"
        label="操作"
        width="80"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.status===1" size="mini" @click="revokeFun(scope.row,scope.$index)">撤销</el-button>
        </template>
      </el-table-column>
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
import materialTypeSelect from '@/components/select_w/sparePartsMTypeSelect'
import materialCodeSelect from '@/components/select_w/sparePartsMCodeSelect'
import page from '@/components/page'
import { setDate, exportExcel } from '@/utils/index'
import { spareInventoryLog, revocationLog } from '@/api/base_w_two'
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
        page_size: 10,
        type: 1
      },
      dataValue: [setDate(), setDate()],
      tableData: [],
      total: 0,
      loading: false,
      statusList: [{ id: 1, name: '完成' }, { id: 2, name: '注销' }]
    }
  },
  watch: {
    show(val) {
      if (val) {
        if (this.isDialog) {
          const obj = {
            spare_no: this.dialogObj.spare_no,
            location_no: this.dialogObj.location_no
          }
          Object.assign(this.search, obj)
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
      const obj = {
        spare_no: this.dialogObj.spare_no,
        location_no: this.dialogObj.location_no
      }
      Object.assign(this.search, obj)
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
    changeMaterialType(obj) {
      this.search.type_name = obj ? obj.name : null
      this.search.page = 1
      this.getList()
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
      this.search.spare_no = obj ? obj.no : null
      this.search.page = 1
      this.getList()
    },
    changeMaterialName(obj) {
      this.search.spare_name = obj ? obj.name : null
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
    },
    changeStatus(val) {
      this.search.page = 1
      this.getList()
    },
    revokeFun(row, index) {
      this.$confirm(
        '确定撤销?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        await revocationLog('patch', row.id)
        this.$message.success('撤销成功')
        this.search.page = 1
        this.getList()
      })
    }
  }
}
</script>

<style>

</style>
