<template>
  <div v-loading="loading">
    <el-form :inline="true">
      <el-form-item
        label="日期"
      >
        <el-date-picker
          v-model="getParams.day_time"
          style="width: 100%"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="getParamsChanged"
        />
      </el-form-item>
      <el-form-item label="倒班名称">
        <el-input
          v-model="getParams.work_schedule__schedule_name"
          @input="getParamsChanged"
        />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        label="No"
        width="50"
      />
      <el-table-column
        prop="day_time"
        label="日期"
      />
      <!-- <el-table-column
        prop="work_schedule"
        label="倒班id"
        width="80"
      /> -->
      <el-table-column
        prop="work_schedule_name"
        label="倒班名"
      />
      <el-table-column label="早班">
        <el-table-column
          prop="work_schedule_plan[0].group_name"
          label="班组"
        />
        <el-table-column
          prop="work_schedule_plan[0].start_time"
          label="开始"
        />
        <el-table-column
          prop="work_schedule_plan[0].end_time"
          label="结束"
        />
      </el-table-column>
      <el-table-column label="中班">
        <el-table-column
          prop="work_schedule_plan[1].group_name"
          label="班组"
        />
        <el-table-column
          prop="work_schedule_plan[1].start_time"
          label="开始"
        />
        <el-table-column
          prop="work_schedule_plan[1].end_time"
          label="结束"
        />
      </el-table-column>
      <el-table-column label="夜班">
        <el-table-column
          prop="work_schedule_plan[2].group_name"
          label="班组"
        />
        <el-table-column
          prop="work_schedule_plan[2].start_time"
          label="开始"
        />
        <el-table-column
          prop="work_schedule_plan[2].end_time"
          label="结束"
        />
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { planScheduleUrl } from '@/api/base_w'
import pagination from '@/components/page'
export default {
  components: { pagination },
  data() {
    return {
      tableData: [],
      getParams: {
        page: 1,
        work_schedule__schedule_name: '',
        day_time: ''
      },
      total: 0,
      loading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    findSchedulePlanByClassesName(work_schedule_plan, name) {
      return work_schedule_plan.find(plan => plan.classes_name === name)
    },
    getList() {
      const app = this
      app.loading = true
      planScheduleUrl('get', null, {
        params: this.getParams
      }).then(function(response) {
        app.total = response.count
        app.tableData = response.results || []
        for (const [index, row] of app.tableData.entries()) {
          const work_schedule_plan = [null, null, null]
          work_schedule_plan[0] = app.findSchedulePlanByClassesName(row.work_schedule_plan, '早班')
          work_schedule_plan[1] = app.findSchedulePlanByClassesName(row.work_schedule_plan, '中班')
          work_schedule_plan[2] = app.findSchedulePlanByClassesName(row.work_schedule_plan, '夜班')
          row.work_schedule_plan = work_schedule_plan
        }
        app.loading = false
      }).catch(function() {
        app.loading = false
        // this.$message.error(error)
      })
    },
    getParamsChanged() {
      this.getParams.page = 1
      this.getList()
    },
    currentChange(page) {
      this.getParams.page = page
      this.getList()
    }
  }
}
</script>

<style>

</style>
