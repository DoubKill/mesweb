<template>
  <div>
    <!-- 胶料计划及发货对比 -->
    <el-form :inline="true">
      <el-form-item label="分厂">
        <el-select
          v-model="search.product_no"
          style="width:250px"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in ['建德分厂']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="规格">
        <el-input
          v-model="search.product_no"
          @input="changeSearch"
        />
      </el-form-item>
      <!-- <el-form-item label="日/周/月/年">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="time"
        label="时间"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="分厂"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="规格"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="申报计划(吨)"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="实际使用(吨)"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="符合率(实际/计划)"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ScheduleDeliveryComparison',
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
        if (this.tableData.length > 0) {
          this.tableData.push({
            time: '合计'
          })
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeSearch() {
      this.$debounce(this, 'getList')
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
</script>

<style>

</style>
