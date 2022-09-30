<template>
  <div>
    <!-- 设备故障统计列表 -->
    <el-form :inline="true">
      <el-form-item label="机台">
        <equip-select
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="search.time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="getList"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="id"
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="order_id"
        label="日期"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="班次"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="设备班组"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="区域"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="位置"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="问题描述"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="故障原因说明"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="维修起始时间"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="维修结束时间"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="间隔时间"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="分钟"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="维修人员"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="维修结果"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="设备次数"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="细分区域"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'EquipmentReportFormOrderReceiving',
  components: { EquipSelect },
  data() {
    return {
      search: {},
      loading: false,
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const obj = {}
        Object.assign(obj, this.search)
        // const data = await equipWarehouseRecord('get', null, { params: obj })
        // this.tableData = data.results || []
        // this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.getList()
    },
    exportTable() {

    }
  }
}
</script>

<style>

</style>
