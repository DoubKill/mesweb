<template>
  <div v-loading="loading">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="序"
        width="50"
      />
      <el-table-column
        prop="day_time"
        label="日期"
      />
      <el-table-column
        prop="work_schedule"
        label="倒班id"
        width="80"
      />
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
      <el-table-column label="晚班">
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
      getParams: { page: 1 },
      total: 0,
      loading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const app = this
      app.loading = true
      planScheduleUrl('get', null, {
        params: this.getParams
      }).then(function(response) {
        app.total = response.count
        app.tableData = response.results || []
        app.loading = false
      }).catch(function() {
        app.loading = false
        // this.$message.error(error)
      })
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
