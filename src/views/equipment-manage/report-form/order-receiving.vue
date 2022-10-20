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
          v-model="search.created_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
          <!-- @change="getList" -->
      </el-form-item>
      <el-form-item>
        <el-button :loading="btnExportLoad" type="primary" v-permission="['equip_fault_statistic','export']" @click="exportTable">导出Excel</el-button>
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
        prop="created_date"
        label="日期"
        min-width="20"
      />
      <el-table-column
        prop="equip_classes"
        label="班次"
        width="60"
      />
      <el-table-column
        prop="equip_group"
        label="设备班组"
        width="80"
      />
      <el-table-column
        prop="equip_no"
        label="机台"
        width="60"
      />
      <el-table-column
        prop="area_name"
        label="区域"
        min-width="20"
      />
      <el-table-column
        prop="part"
        label="位置"
        min-width="20"
      />
      <el-table-column
        prop="fault_desc"
        label="问题描述"
        min-width="20"
      />
      <el-table-column
        prop="fault_detail"
        label="故障原因说明"
        min-width="20"
      />
      <el-table-column
        prop="repair_start_datetime"
        label="维修起始时间"
        min-width="20"
      />
      <el-table-column
        prop="repair_end_datetime"
        label="维修结束时间"
        min-width="20"
      />
      <el-table-column
        prop="interval_time"
        label="间隔时间"
        min-width="20"
      />
      <el-table-column
        prop="minutes"
        label="分钟"
        width="60"
      />
      <el-table-column
        prop="repair_user"
        label="维修人员"
        min-width="20"
      />
      <el-table-column
        prop="result_repair_final_result"
        label="维修结果"
        width="70"
      />
      <el-table-column
        prop="equip_times"
        label="设备次数"
        width="70"
      />
      <el-table-column
        prop="area_detail"
        label="细分区域"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import EquipSelect from '@/components/EquipSelect/index'
import { equipFaultStatistic } from '@/api/base_w_two'
export default {
  name: 'EquipmentReportFormOrderReceiving',
  components: { EquipSelect },
  data() {
    return {
      search: {},
      loading: false,
      tableData: [],
      btnExportLoad: false
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
        const data = await equipFaultStatistic('get', null, { params: obj })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      // this.getList()
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      equipFaultStatistic('get', null, { responseType: 'blob', params: obj })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '设备故障统计列表.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    }
  }
}
</script>

<style>

</style>
