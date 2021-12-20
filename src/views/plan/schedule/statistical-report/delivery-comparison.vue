<template>
  <div>
    <!-- 胶料计划及发货对比 -->
    <el-form :inline="true">
      <el-form-item>
        <el-radio-group v-model="search.type" @change="resetTime">
          <el-radio label="day">日报</el-radio>
          <el-radio label="week">周报</el-radio>
          <el-radio label="month">月报</el-radio>
          <el-radio label="year">年报</el-radio>
        </el-radio-group>
      </el-form-item>
      <br>
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
      <el-form-item label="日/周/月/年">
        <el-date-picker
          v-if="type==='day'"
          key="1"
          v-model="search.day_time"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeList"
        />
        <el-date-picker
          v-if="type==='week'"
          key="2"
          v-model="search.day_time"
          type="week"
          :picker-options="{firstDayOfWeek:1}"
          format="yyyy第WW周"
          value-format="yyyy-MM-dd"
          placeholder="选择周"
          @change="changeList"
        />
        <el-date-picker
          v-if="type==='month'"
          key="3"
          v-model="search.day_time"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM-dd"
          placeholder="选择月"
          @change="changeList"
        />
        <el-date-picker
          v-if="type==='year'"
          key="4"
          v-model="search.day_time"
          type="year"
          format="yyyy"
          value-format="yyyy-MM-dd"
          placeholder="选择年"
          @change="changeList"
        />
      </el-form-item>
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
import { setDate } from '@/utils'
export default {
  name: 'ScheduleDeliveryComparison',
  data() {
    return {
      btnExportLoad: false,
      search: { day_time: setDate(), type: 'day' },
      loading: false,
      tableData: [],
      type: 'day'
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
    changeList() {
      this.getList()
    },
    changeSearch() {
      this.$debounce(this, 'getList')
    },
    resetTime() {
      this.search.day_time = setDate()
      this.type = this.search.type
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
