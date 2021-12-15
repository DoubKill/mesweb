<template>
  <div>
    <!-- 机台别处理时间报表 -->
    <el-form :inline="true">
      <el-form-item label="起止日时">
        <el-date-picker
          v-model="dateValue"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日时"
          end-placeholder="结束日时"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          equip-type="密炼设备"
          style="width:100px"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="作业类型">
        <el-select
          v-model="search.work_type"
          placeholder="请选择"
          clearable
          @change="getList"
        >
          <el-option
            v-for="item in ['巡检','保养','维修','润滑','标定']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      :row-class-name="tableRowClassName"
      border
    >
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="work_type"
        label="作业类别"
        min-width="20"
      />
      <el-table-column
        prop="派单时间"
        label="派单时间(分钟)"
        min-width="20"
      />
      <el-table-column
        prop="接单时间"
        label="接单时间(分钟)"
        min-width="20"
      />
      <el-table-column
        prop="维修时间"
        label="维修时间(分钟)"
        min-width="20"
      />
      <el-table-column
        prop="验收时间"
        label="验收时间(分钟)"
        min-width="20"
      />
      <el-table-column
        prop="开机时间"
        label="开机时间(分钟)"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import { equipStatement } from '@/api/jqy'
import { exportExcel } from '@/utils/index'
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'EquipmentReportFormEquip',
  components: { EquipSelect },
  data() {
    return {
      dateValue: [],
      btnExportLoad: false,
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
        const data = await equipStatement('get', null, { params: this.search })
        this.tableData = data
        if (this.tableData.length > 0) {
          this.tableData.push({
            equip_no: '合计',
            派单时间: sum(this.tableData, '派单时间'),
            接单时间: sum(this.tableData, '接单时间'),
            维修时间: sum(this.tableData, '维修时间'),
            验收时间: sum(this.tableData, '验收时间'),
            开机时间: sum(this.tableData, '开机时间')
          })
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.equip_no === '合计') {
        return 'summary-cell-style'
      }
    },
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      this.getList()
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.getList()
    },
    exportTable() {
      exportExcel('机台别处理时间报表')
      // this.btnExportLoad = true
      // const obj = Object.assign({ export: 1 }, this.search)
      // const _api = equipWarehouseRecord
      // _api('get', null, { params: obj, responseType: 'blob' })
      //   .then(res => {
      //     const link = document.createElement('a')
      //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      //     link.style.display = 'none'
      //     link.href = URL.createObjectURL(blob)
      //     link.download = '备件出入库履历.xlsx' // 下载的文件名
      //     document.body.appendChild(link)
      //     link.click()
      //     document.body.removeChild(link)
      //     this.btnExportLoad = false
      //   }).catch(e => {
      //     this.btnExportLoad = false
      //   })
    }
  }
}
function sum(arr, params) {
  var s = 0
  arr.forEach(function(val, idx, arr) {
    const a = val[params] ? Number(val[params]) : 0
    s += a
  }, 0)
  s = Math.round(s * 100) / 100
  return s
}
</script>

<style>

</style>
