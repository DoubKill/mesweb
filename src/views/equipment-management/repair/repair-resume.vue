<template>
  <div class="repair-resume">
    <!-- 设备维修履历 -->
    <el-form :inline="true">
      <el-form-item label="日期:">
        <el-date-picker
          v-model="search.data"
          type="month"
          placeholder="选择月"
          value-format="yyyy-MM"
          :clearable="false"
          @change="changeMonth"
        />
      </el-form-item>
      <el-form-item label="设备类型:">
        <equipTypeSelect @equipTypeSelect="equipTypeSelect" />
      </el-form-item>
      <el-form-item label="设备编码:">
        <equip-select
          :equip_no_props.sync="search.equip_no"
          @changeSearch="changeList"
        />
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        type="index"
        label="No"
        width="40"
      />
      <el-table-column
        prop="factory_date"
        label="日期"
        min-width="12"
      />
      <el-table-column
        prop="equip_type"
        label="设备类型"
        min-width="12"
      />
      <el-table-column
        prop="equip_no"
        label="设备编码"
        min-width="12"
      />
      <el-table-column
        prop="equip_name"
        label="设备名称"
        min-width="15"
      />
      <el-table-column
        prop="first_down_reason"
        label="故障原因"
        min-width="15"
        show-overflow-tooltip
      />
      <el-table-column
        prop="created_date"
        label="申请时间"
        min-width="15"
      />
      <el-table-column
        prop="begin_time"
        label="维修开始时间"
        min-width="15"
      />
      <el-table-column
        prop="end_time"
        label="维修结束时间"
        min-width="15"
      />
      <el-table-column
        prop="affirm_time"
        label="启动时间"
        min-width="15"
      />
      <el-table-column
        prop="waiting_repair"
        label="等待维修时间/s"
        min-width="16"
      />
      <el-table-column
        prop="repair_time"
        label="维修时间/s"
        min-width="15"
      />
      <el-table-column
        prop="stop_time"
        label="停机时间/s"
        min-width="15"
      />
    </el-table>
    <!-- <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    /> -->

  </div>
</template>

<script>
import equipTypeSelect from '../components/equip-type-select'
import EquipSelect from '@/components/select_w/equip'
import { setDate } from '@/utils'
// import page from '@/components/page'
import { EquipMaintenanceOrderLog } from '@/api/base_w_two'
export default {
  components: { equipTypeSelect, EquipSelect },
  data() {
    return {
      search: {
        data: setDate(null, null, 'month'),
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        page: 1
      },
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
        const data = await EquipMaintenanceOrderLog('get', null, { params: this.search })
        this.tableData = data.results || []
        this.tableData.pop()
        this.loading = false

        const arr = []
        const obj = { equip_no: '', equip_name: '合计', waiting_repair: 0, repair_time: 0, stop_time: 0 }
        this.tableData.forEach((D, i) => {
          if (!obj.equip_no) {
            obj.equip_no = D.equip_no
          } else if (obj.equip_no !== D.equip_no) {
            obj.waiting_repair = obj.waiting_repair.toFixed(2)
            obj.repair_time = obj.repair_time.toFixed(2)
            obj.stop_time = obj.stop_time.toFixed(2)
            arr.push(JSON.parse(JSON.stringify(obj)))
            obj.waiting_repair = 0
            obj.repair_time = 0
            obj.stop_time = 0
            obj.equip_no = D.equip_no
          }
          obj.waiting_repair += Number(D.waiting_repair)
          obj.repair_time += Number(D.repair_time)
          obj.stop_time += Number(D.stop_time)
          arr.push(D)
        })
        if (this.tableData.length > 0) {
          obj.waiting_repair = obj.waiting_repair.toFixed(2)
          obj.repair_time = obj.repair_time.toFixed(2)
          obj.stop_time = obj.stop_time.toFixed(2)
          arr.push(obj)
        }

        this.tableData = arr
      } catch (e) {
        this.loading = false
      }
    },
    equipTypeSelect(obj) {
      this.search.equip_type = obj ? obj.global_name : ''
      this.changeList()
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    changeMonth(val) {
      if (!val) {
        this.search.data = setDate(null, null, 'month')
        return
      }
      console.log(val, 888)
      this.search.year = val.split('-')[0]
      this.search.month = val.split('-')[1]
      this.changeList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.equip_name === '合计') {
        console.log(555)
        return 'warning-row'
      }
      return ''
    }
    // currentChange(page, page_size) {
    //   this.search.page = page
    //   this.search.page_size = page_size
    //   this.getList()
    // }
  }
}
</script>

<style lang="scss">
.repair-resume{
.warning-row{
  background: oldlace;
}
}
</style>
