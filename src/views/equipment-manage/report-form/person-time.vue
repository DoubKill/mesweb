<template>
  <div>
    <!-- 人员别处理时间报表 -->
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
      <el-form-item label="人员">
        <el-input v-model="search.no" clearable @input="debounceList" />
      </el-form-item>
      <el-form-item label="作业类型">
        <el-select
          v-model="search.equip_condition"
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
      v-loading="loading"
      :data="tableData"
      :row-class-name="tableRowClassName"
      border
    >
      <el-table-column
        prop="person"
        label="人员"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="作业类别"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="派单时间(分钟)"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="接单时间(分钟)"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="维修时间(分钟)"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="验收时间(分钟)"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="开机时间(分钟)"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'EquipmentReportFormPerson',
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
        // const data = await equipWarehouseRecord('get', null, { params: this.search })
        // this.tableData = data.results || []
        this.tableData.push({
          person: '合计',
          quantity: sum(this.tableData, 'quantity'),
          weight: sum(this.tableData, 'weight')
        })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.person === '合计') {
        return 'summary-cell-style'
      }
    },
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      this.getList()
    },
    exportTable() {
      this.btnExportLoad = true
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
  s = Math.round(s * 1000) / 1000
  return s
}
</script>

<style>

</style>
