<template>
  <div>
    <!-- 处理时间分析报表 -->
    <el-form :inline="true">
      <el-form-item>
        <el-radio v-model="radio" label="1" @change="clearTime">日报</el-radio>
        <el-radio v-model="radio" label="2" @change="clearTime">周报</el-radio>
        <el-radio v-model="radio" label="3" @change="clearTime">月报</el-radio>
        <el-radio v-model="radio" label="4" @change="clearTime">年报</el-radio>
      </el-form-item>
      <br>
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
      <el-form-item label="日/周/月/年">
        <el-date-picker
          v-show="radio==='1'"
          v-model="search.day_time1"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeList"
        />
        <el-date-picker
          v-show="radio==='2'"
          v-model="search.day_time2"
          type="week"
          format="yyyy 第 WW 周"
          :picker-options="{firstDayOfWeek:1}"
          value-format="yyyy-MM-dd"
          placeholder="选择周"
          @change="changeList"
        />
        <el-date-picker
          v-show="radio==='3'"
          v-model="search.day_time3"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="changeList"
        />
        <el-date-picker
          v-show="radio==='4'"
          v-model="search.day_time4"
          type="year"
          format="yyyy"
          value-format="yyyy"
          placeholder="选择年"
          @change="changeList"
        />
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
      border
    >
      <el-table-column
        prop="order_id"
        label="时间"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="作业类别"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="工单编号"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="作业类别"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="派单时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="接单时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="维修时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="验收时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="开机时间（分钟）"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'EquipmentReportFormOrderProcessing',
  data() {
    return {
      dateValue: [],
      btnExportLoad: false,
      search: {},
      loading: false,
      tableData: [],
      radio: '1'
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
        // this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      console.log(this.search.day_time1)
      console.log(this.search.day_time2)
      console.log(this.search.day_time3)
      console.log(this.search.day_time4)
      // console.log(this.search.day_time)
      // if (this.radio === '3') {
      //   this.search.day_time3 = this.search.day_time3.split('-')[0] + '-' + this.search.day_time3.split('-')[1]
      // } else if (this.radio === '4') {
      //   this.search.day_time4 = this.search.day_time4.split('-')[0]
      // }
    },
    clearTime() {
      // if (this.search.day_time) {
      this.search.day_time3 = ''
      // }
      // console.log(this.search)
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
